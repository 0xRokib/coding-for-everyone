package models

import "time"

type LessonPlanRequest struct {
	Persona string `json:"persona"`
	Goals   string `json:"goals"`
}

type ChatRequest struct {
	Message     string        `json:"message"`
	History     []ChatHistory `json:"history"`
	Persona     string        `json:"persona"`
	CurrentCode string        `json:"currentCode"`
}

type ChatHistory struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type ExecuteRequest struct {
	Code     string `json:"code"`
	Language string `json:"language"`
}

type Response struct {
	Text string `json:"text"`
}

type LessonPlanResponse struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type LessonPlan struct {
	ID        int       `json:"id"`
	Persona   string    `json:"persona"`
	Goals     string    `json:"goals"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
