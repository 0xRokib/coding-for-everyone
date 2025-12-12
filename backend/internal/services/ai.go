package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"codefuture-backend/internal/models"
)

type AIService struct {
	apiKey string
	client *http.Client
}

func NewAIService(apiKey string) (*AIService, error) {
	return &AIService{
		apiKey: apiKey,
		client: &http.Client{},
	}, nil
}

func (s *AIService) Close() {
	// No cleanup needed for HTTP client
}

// OpenRouter API structures
type OpenRouterMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenRouterRequest struct {
	Model    string              `json:"model"`
	Messages []OpenRouterMessage `json:"messages"`
}

type OpenRouterChoice struct {
	Message OpenRouterMessage `json:"message"`
}

type OpenRouterResponse struct {
	Choices []OpenRouterChoice `json:"choices"`
	Error   *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (s *AIService) GenerateLessonPlan(persona, goals string) (string, error) {
	prompt := fmt.Sprintf(`Create a curriculum outline for a user with the persona: %s.
Their specific goal is: "%s".

Generate a valid JSON object with the following structure:
{
	"title": "Course Title",
	"description": "Short description",
	"language": "python or javascript",
	"lessons": [
	{
		"id": "1",
		"title": "Lesson Title",
		"content": "A brief explanation of the concept (2-3 sentences)",
		"initialCode": "Code snippet to start with"
	}
	]
}
Provide ONLY the JSON. Generate 3-5 lessons.`, persona, goals)

	reqBody := OpenRouterRequest{
		Model: "google/gemini-flash-1.5", // Free and available
		Messages: []OpenRouterMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %v", err)
	}

	req, err := http.NewRequest("POST", "https://openrouter.ai/api/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "http://localhost:5173")
	req.Header.Set("X-Title", "Coding For Everyone")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("API request failed: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var openRouterResp OpenRouterResponse
	if err := json.Unmarshal(body, &openRouterResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %v", err)
	}

	if openRouterResp.Error != nil {
		return "", fmt.Errorf("OpenRouter API error: %s", openRouterResp.Error.Message)
	}

	if len(openRouterResp.Choices) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	content := openRouterResp.Choices[0].Message.Content

	// Extract JSON from markdown code blocks if present
	content = extractJSON(content)

	fmt.Println("✅ Successfully generated curriculum using OpenRouter")
	return content, nil
}

func (s *AIService) Chat(ctx context.Context, persona, currentCode, message string, history []models.ChatHistory) (string, error) {
	systemPrompt := getSystemInstruction(persona)

	contextPrompt := fmt.Sprintf(`Current Code in Editor:
`+"```"+`
%s
`+"```"+`

User Message: %s`, currentCode, message)

	messages := []OpenRouterMessage{
		{
			Role:    "system",
			Content: systemPrompt,
		},
	}

	// Add history
	for _, h := range history {
		messages = append(messages, OpenRouterMessage{
			Role:    h.Role,
			Content: h.Text,
		})
	}

	// Add current message
	messages = append(messages, OpenRouterMessage{
		Role:    "user",
		Content: contextPrompt,
	})

	reqBody := OpenRouterRequest{
		Model:    "google/gemini-flash-1.5",
		Messages: messages,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %v", err)
	}

	req, err := http.NewRequest("POST", "https://openrouter.ai/api/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "http://localhost:5173")
	req.Header.Set("X-Title", "Coding For Everyone")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("API request failed: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var openRouterResp OpenRouterResponse
	if err := json.Unmarshal(body, &openRouterResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %v", err)
	}

	if openRouterResp.Error != nil {
		return "", fmt.Errorf("OpenRouter API error: %s", openRouterResp.Error.Message)
	}

	if len(openRouterResp.Choices) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	return openRouterResp.Choices[0].Message.Content, nil
}

func (s *AIService) ExecuteCode(ctx context.Context, code, language string) (string, error) {
	prompt := fmt.Sprintf(`Act as a %s interpreter.
Execute the following code and return ONLY the output (stdout).
If there is an error, return the error message as the interpreter would.
Do not provide any conversational text, just the execution result.

Code:
%s`, language, code)

	reqBody := OpenRouterRequest{
		Model: "google/gemini-flash-1.5",
		Messages: []OpenRouterMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %v", err)
	}

	req, err := http.NewRequest("POST", "https://openrouter.ai/api/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "http://localhost:5173")
	req.Header.Set("X-Title", "Coding For Everyone")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("API request failed: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var openRouterResp OpenRouterResponse
	if err := json.Unmarshal(body, &openRouterResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %v", err)
	}

	if openRouterResp.Error != nil {
		return "", fmt.Errorf("OpenRouter API error: %s", openRouterResp.Error.Message)
	}

	if len(openRouterResp.Choices) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	return openRouterResp.Choices[0].Message.Content, nil
}

func getSystemInstruction(persona string) string {
	switch persona {
	case "kid":
		return "You are a friendly and visual coding tutor. The user is a 'Visual Learner'. Use clear analogies (like recipes, building blocks, traffic lights), keep explanations concise, and focus on the 'Why' and 'How' with simple examples. Avoid jargon unless explained."
	case "doctor_engineer":
		return "You are a solution-focused technical consultant. The user is a 'Project Builder' or domain expert. Focus on practical application, automation, and efficiency. Show how code solves real problems directly."
	case "professional":
		return "You are a senior developer mentor. Focus on best practices, career advice, clean code, and industry-standard tools. Be concise and practical."
	default:
		return "You are a helpful and patient coding tutor."
	}
}

// extractJSON extracts JSON from markdown code blocks
func extractJSON(content string) string {
	// Remove markdown code blocks if present
	if len(content) > 7 && content[:3] == "```" {
		// Find the end of the opening ```json or ```
		start := 0
		for i := 3; i < len(content); i++ {
			if content[i] == '\n' {
				start = i + 1
				break
			}
		}

		// Find the closing ```
		end := len(content)
		for i := len(content) - 1; i >= start; i-- {
			if i >= 2 && content[i-2:i+1] == "```" {
				end = i - 2
				break
			}
		}

		if start < end {
			return content[start:end]
		}
	}

	return content
}
