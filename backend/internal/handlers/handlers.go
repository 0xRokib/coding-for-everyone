package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"codefuture-backend/internal/config"
	"codefuture-backend/internal/middleware"
	"codefuture-backend/internal/models"
	"codefuture-backend/internal/services"
	"codefuture-backend/internal/store"
)

type Handler struct {
	aiStore   *services.AIService
	dataStore *store.Store
	config    *config.Config
}

func NewHandler(ai *services.AIService, db *store.Store, cfg *config.Config) *Handler {
	return &Handler{
		aiStore:   ai,
		dataStore: db,
		config:    cfg,
	}
}

func (h *Handler) HandleLessonPlan(w http.ResponseWriter, r *http.Request) {

	var req models.LessonPlanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	content, err := h.aiStore.GenerateLessonPlan(req.Persona, req.Goals)
	if err != nil {
		sendJSONError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Save to DB (sync)
	// Extract user ID from context if present
	var userID *int
	if val, ok := r.Context().Value(middleware.UserIDKey).(int); ok {
		userID = &val
	}

	id, err := h.dataStore.SaveLessonPlan(userID, req.Persona, req.Goals, content)
	if err != nil {
		// If save fails, we should probably still return content but maybe warn?
		// For now, let's treat DB error as non-fatal for generation but fatal for "saving" feature.
		// Actually, if we want to redirect to /course/:id, we NEED the ID.
		// So we must return error.
		sendJSONError(w, "Failed to save lesson plan: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.LessonPlanResponse{
		ID:   id,
		Text: content,
	})
}

func (h *Handler) HandleChat(w http.ResponseWriter, r *http.Request) {

	var req models.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	resp, err := h.aiStore.Chat(r.Context(), req.Persona, req.CurrentCode, req.Message, req.History)
	if err != nil {
		sendJSONError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.Response{Text: resp})
}

func (h *Handler) HandleExecute(w http.ResponseWriter, r *http.Request) {

	var req models.ExecuteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	resp, err := h.aiStore.ExecuteCode(r.Context(), req.Code, req.Language)
	if err != nil {
		sendJSONError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.Response{Text: resp})
}

// HandleMath performs a simple arithmetic operation (addition) on two numbers.
func (h *Handler) HandleMath(w http.ResponseWriter, r *http.Request) {

	var req models.MathRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := req.A + req.B // simple addition; can be extended
	json.NewEncoder(w).Encode(models.MathResponse{Result: result})
}

func (h *Handler) HandleGetCourses(w http.ResponseWriter, r *http.Request) {

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		sendJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Refactoring HandleGetCourses to switch on method
	if r.Method == "DELETE" {
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			sendJSONError(w, "Missing id parameter", http.StatusBadRequest)
			return
		}

		courseID, err := strconv.Atoi(idStr)
		if err != nil {
			sendJSONError(w, "Invalid id parameter", http.StatusBadRequest)
			return
		}

		if err := h.dataStore.DeleteCourse(userID, courseID); err != nil {
			sendJSONError(w, "Failed to delete course", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
		return
	}

	courses, err := h.dataStore.GetCoursesByUserID(userID)
	if err != nil {
		sendJSONError(w, "Failed to fetch courses", http.StatusInternalServerError)
		return
	}

	if courses == nil {
		courses = []map[string]interface{}{}
	}

	json.NewEncoder(w).Encode(courses)
}

func sendJSONError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(models.ErrorResponse{Error: message})
}
