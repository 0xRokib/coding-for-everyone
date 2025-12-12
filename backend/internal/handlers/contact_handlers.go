package handlers

import (
	"codefuture-backend/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

func (h *Handler) HandleContactSubmission(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		sendJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.ContactSubmission
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// 1. Save to Database
	if err := h.dataStore.CreateContactSubmission(&req); err != nil {
		log.Printf("Failed to save contact submission: %v", err)
		sendJSONError(w, "Failed to submit request", http.StatusInternalServerError)
		return
	}

	// 2. Mock Email Sending
	// In a real app, use "net/smtp" or SendGrid API
	log.Printf(">>> MOCK EMAIL SENT >>>\nTo: support@codefuture.io\nFrom: %s <%s>\nSubject: New Contact: %s\nBody: %s\n",
		req.FirstName+" "+req.LastName, req.Email, "Inquiry", req.Message)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Ticket created"})
}
