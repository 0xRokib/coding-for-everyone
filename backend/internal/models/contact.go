package models

import "time"

type ContactSubmission struct {
	ID        int       `json:"id"`
	UserID    *int      `json:"user_id,omitempty"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}
