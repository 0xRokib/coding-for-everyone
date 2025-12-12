package handlers

import (
	"codefuture-backend/internal/middleware"
	"encoding/json"
	"net/http"
)

type RoadmapResponse struct {
	PlanID       int         `json:"plan_id"`
	Content      interface{} `json:"content"` // Parsed JSON content
	CurrentIndex int         `json:"current_index"`
}

func (h *Handler) HandleGetRoadmap(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		sendJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	plan, err := h.dataStore.GetLatestLessonPlan(userID)
	if err != nil {
		sendJSONError(w, "Failed to fetch roadmap", http.StatusInternalServerError)
		return
	}

	if plan == nil {
		// No roadmap yet
		json.NewEncoder(w).Encode(map[string]interface{}{"found": false})
		return
	}

	// Parse the content string (which is JSON) back to object
	var contentObj interface{}
	if err := json.Unmarshal([]byte(plan.Content), &contentObj); err != nil {
		// If fails (maybe plain text? shouldn't happen with new AI), return raw
		contentObj = plan.Content
	}

	resp := RoadmapResponse{
		PlanID:       plan.ID,
		Content:      contentObj,
		CurrentIndex: plan.CurrentLessonIndex,
	}

	wrapper := map[string]interface{}{
		"found": true,
		"data":  resp,
	}

	json.NewEncoder(w).Encode(wrapper)
}

func (h *Handler) HandleUpdateProgress(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		return
	}

	var req struct {
		PlanID int `json:"plan_id"`
		Index  int `json:"index"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.dataStore.UpdateLessonProgress(req.PlanID, req.Index); err != nil {
		sendJSONError(w, "Failed to update progress", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
