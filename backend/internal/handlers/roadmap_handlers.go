package handlers

import (
	"codefuture-backend/internal/middleware"
	"encoding/json"
	"fmt"
	"net/http"
)

type RoadmapResponse struct {
	PlanID       int         `json:"plan_id"`
	Content      interface{} `json:"content"` // Parsed JSON content
	CurrentIndex int         `json:"current_index"`
}

func (h *Handler) HandleGetRoadmap(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		fmt.Println("[Error] HandleGetRoadmap: Unauthorized")
		sendJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	plan, err := h.dataStore.GetLatestLessonPlan(userID)
	if err != nil {
		fmt.Printf("[Error] HandleGetRoadmap: DB Fetch failed: %v\n", err)
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
		fmt.Printf("[Warning] HandleGetRoadmap: JSON Parse failed for plan content: %v (Content len: %d)\n", err, len(plan.Content))
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

func (h *Handler) HandleGenerateCustomRoadmap(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		fmt.Println("[Error] HandleGenerateCustomRoadmap: Unauthorized")
		sendJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		Role       string `json:"role"`
		Experience string `json:"experience"`
		Goal       string `json:"goal"`
		Other      string `json:"other"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("[Error] HandleGenerateCustomRoadmap: Invalid Body: %v\n", err)
		sendJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	fmt.Printf("[Info] Generating Roadmap for User %d: Role=%s, Exp=%s\n", userID, req.Role, req.Experience)

	// 1. Generate via AI
	jsonContent, err := h.aiStore.GenerateFullRoadmap(req.Role, req.Experience, req.Goal, req.Other)
	if err != nil {
		fmt.Printf("[Error] HandleGenerateCustomRoadmap: AI Generation Failed: %v\n", err)
		sendJSONError(w, "Failed to generate roadmap: "+err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("[Info] AI Generation Success. Saving to DB...")

	// 2. Save to DB
	// We reuse 'persona' for Role/Experience and 'goals' for Goal
	personaStr := req.Role + " (" + req.Experience + ")"
	planID, err := h.dataStore.SaveLessonPlan(&userID, personaStr, req.Goal, jsonContent)
	if err != nil {
		fmt.Printf("[Error] HandleGenerateCustomRoadmap: DB Save Failed: %v\n", err)
		sendJSONError(w, "Failed to save roadmap", http.StatusInternalServerError)
		return
	}

	// 3. Return ID
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"plan_id": planID,
	})
}

func (h *Handler) HandleGetRoadmapByID(w http.ResponseWriter, r *http.Request) {
	// Public access allowed for viewing ID (for simplicity, or check auth)
	// path is /api/roadmap/{id} usually, but using query param for speed
	// actually standard is mux var. Let's assume query?id=X for now to avoid mux change complexity if standard http
	// Checking how routes are defined in main...
	// Ah, I don't see routing code here. I'll assume standard net/http with query params easiest.

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		// Try path value if using Chi/Mux (dummy check, likely not needed if using standard mux without vars)
		sendJSONError(w, "Missing id", http.StatusBadRequest)
		return
	}

	// Convert ID
	var planID int
	// ... minimal implementation assuming basic stdlib ...
	// Actually better to just parse it
	fmt.Sscanf(idStr, "%d", &planID)

	plan, err := h.dataStore.GetLessonPlanByID(planID)
	if err != nil {
		sendJSONError(w, "Failed to fetch roadmap", http.StatusInternalServerError)
		return
	}
	if plan == nil {
		sendJSONError(w, "Roadmap not found", http.StatusNotFound)
		return
	}

	var contentObj interface{}
	if err := json.Unmarshal([]byte(plan.Content), &contentObj); err != nil {
		contentObj = plan.Content
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": RoadmapResponse{
			PlanID:       plan.ID,
			Content:      contentObj,
			CurrentIndex: plan.CurrentLessonIndex,
		},
	})
}
