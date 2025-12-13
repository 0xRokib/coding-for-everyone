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

// extractJSON extracts JSON from markdown code blocks or raw text
func extractJSON(content string) string {
	// 1. Try to find markdown code blocks
	startCode := -1
	endCode := -1

	// Scan for start of code block
	for i := 0; i < len(content)-2; i++ {
		if content[i:i+3] == "```" {
			startCode = i
			break
		}
	}

	if startCode != -1 {
		// Find end of code block
		for i := len(content); i >= startCode+3; i-- {
			if i >= 3 && content[i-3:i] == "```" {
				endCode = i - 3
				// If this is the same backticks as start, keeping searching backwards?
				// No, searching from end means we find the last closing one.
				if endCode > startCode {
					// Found a valid block
					// We need to skip the "```json" or "```" part at start
					// Find newline after startCode
					jsonStart := startCode + 3
					for j := jsonStart; j < len(content); j++ {
						if content[j] == '\n' {
							jsonStart = j + 1
							break
						}
					}
					// If endCode is valid
					if endCode > jsonStart {
						return content[jsonStart:endCode]
					}
				}
				break
			}
		}
	}

	// 2. If no code blocks, look for first '{' and last '}'
	startBrace := -1
	endBrace := -1

	for i := 0; i < len(content); i++ {
		if content[i] == '{' {
			startBrace = i
			break
		}
	}

	for i := len(content) - 1; i >= 0; i-- {
		if content[i] == '}' {
			endBrace = i + 1
			break
		}
	}

	if startBrace != -1 && endBrace != -1 && endBrace > startBrace {
		return content[startBrace:endBrace]
	}

	return content
}

// GenerateEmailResponse uses AI to draft a polite, professional reply to a contact inquiry.
func (s *AIService) GenerateEmailResponse(name, userMessage string) (string, error) {
	prompt := fmt.Sprintf(`You are an AI support agent for "Code Anyone", a coding education platform.
A user named "%s" sent this message:
"%s"

Draft a polite, professional, and helpful email reply.
- Thank them for reaching out.
- Acknowledge their specific question/message.
- If it's a technical question, provide a brief, high-level helpful tip if possible, or say our engineers will look into it.
- If it's general, be welcoming.
- Keep it concise (under 150 words).
- Sign off as "The Code Anyone Team".

Return ONLY the body of the email text.`, name, userMessage)

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

	// OpenRouter/Gemini usage via your API key
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
		return "Thank you for contacting us. We will review your message shortly.", nil
	}

	if len(openRouterResp.Choices) == 0 {
		return "Thank you for your message. We have received it and will get back to you shortly.", nil
	}

	return openRouterResp.Choices[0].Message.Content, nil
}

// GenerateFullRoadmap uses AI to generate a comprehensive roadmap details JSON.
func (s *AIService) GenerateFullRoadmap(role, experience, goal, otherReqs string) (string, error) {
	prompt := fmt.Sprintf(`Create a detailed learning roadmap for a "%s" (Experience Level: %s, Goal: %s).
	Additional Requirements/Context: "%s".
	
	Generate a valid JSON object matching this exact structure:
	{
		"id": "custom-roadmap",
		"title": "Custom %s Path",
		"description": "A personalized roadmap tailored to your %s level and goal to %s.",
		"sections": [
			{
				"title": "Section Title (e.g. Fundamentals)",
				"topics": [
					{
						"title": "Topic Title",
						"description": "Brief explanation",
						"priority": "high" OR "medium" OR "low",
						"technologies": ["Tech1", "Tech2"]
					}
				]
			}
		]
	}
	
	Ensure:
	1. 'priority' is strictly one of: "high", "medium", "low".
	2. The content is comprehensive, covering 5-8 major sections.
	3. Topics are relevant to 2024/2025 standards.
	4. Return ONLY the JSON string. Do not use markdown code blocks.`, role, experience, goal, otherReqs, role, experience, goal)

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

	content := openRouterResp.Choices[0].Message.Content
	return extractJSON(content), nil
}
