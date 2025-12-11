package services

import (
	"context"
	"fmt"

	"codefuture-backend/internal/models"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type AIService struct {
	client *genai.Client
}

func NewAIService(apiKey string) (*AIService, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}
	return &AIService{client: client}, nil
}

func (s *AIService) Close() {
	s.client.Close()
}

func (s *AIService) GenerateLessonPlan(persona, goals string) (string, error) {
	model := s.client.GenerativeModel("gemini-1.5-flash")
	model.ResponseMIMEType = "application/json"

	prompt := fmt.Sprintf(`
	Create a curriculum outline for a user with the persona: %s.
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
	Provide ONLY the JSON. Generate 3-5 lessons.
	`, persona, goals)

	resp, err := model.GenerateContent(context.Background(), genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to generate lesson plan: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	text, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return "", fmt.Errorf("unexpected response format")
	}

	return string(text), nil
}

func (s *AIService) Chat(ctx context.Context, persona, currentCode, message string, history []models.ChatHistory) (string, error) {
	model := s.client.GenerativeModel("gemini-1.5-flash")
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(getSystemInstruction(persona))},
	}

	cs := model.StartChat()

	if len(history) > 0 {
		var genHistory []*genai.Content
		for _, h := range history {
			role := "user"
			if h.Role == "model" {
				role = "model"
			}
			genHistory = append(genHistory, &genai.Content{
				Role:  role,
				Parts: []genai.Part{genai.Text(h.Text)},
			})
		}
		cs.History = genHistory
	}

	contextPrompt := fmt.Sprintf(`
      Current Code in Editor:
      `+"```"+`
      %s
      `+"```"+`
      
      User Message: %s
    `, currentCode, message)

	resp, err := cs.SendMessage(ctx, genai.Text(contextPrompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	text, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return "", fmt.Errorf("unexpected response format")
	}

	return string(text), nil
}

func (s *AIService) ExecuteCode(ctx context.Context, code, language string) (string, error) {
	model := s.client.GenerativeModel("gemini-1.5-flash")
	prompt := fmt.Sprintf(`
      Act as a %s interpreter.
      Execute the following code and return ONLY the output (stdout).
      If there is an error, return the error message as the interpreter would.
      Do not provide any conversational text, just the execution result.
      
      Code:
      %s
    `, language, code)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	text, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return "", fmt.Errorf("unexpected response format")
	}

	return string(text), nil
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
