package handlers

import (
	"codefuture-backend/internal/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"strings"
	"time"

	"codefuture-backend/internal/middleware"
)

// Minimal CSS inlined for email compatibility
const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; }
.container { max-width: 600px; margin: 40px auto; padding: 0; border: none; border-radius: 16px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); overflow: hidden; }
.header { background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); padding: 30px; text-align: center; color: white; }
.header h2 { margin: 0; font-size: 24px; font-weight: 700; }
.header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
.content { padding: 30px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #f0f0f0; }
.info-item { margin-bottom: 10px; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 700; display: block; margin-bottom: 4px; }
.value { font-size: 15px; color: #111827; font-weight: 500; }
.message-section { background-color: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; margin-bottom: 25px; }
.ai-section { background-color: #eff6ff; border-radius: 12px; padding: 20px; border: 1px solid #dbeafe; position: relative; }
.ai-badge { position: absolute; top: -10px; left: 20px; background-color: #3b82f6; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h2>New Inquiry</h2>
        <p>A user has contacted Code Anyone support.</p>
    </div>
    
    <div class="content">
        <div class="info-grid">
            <div class="info-item">
                <span class="label">From</span>
                <span class="value">%s %s</span>
            </div>
             <div class="info-item">
                <span class="label">User Status</span>
                <span class="value">%s</span>
            </div>
            <div class="info-item" style="grid-column: span 2;">
                <span class="label">Email Address</span>
                <span class="value"><a href="mailto:%s" style="color: #4f46e5; text-decoration: none;">%s</a></span>
            </div>
        </div>

        <span class="label">User Message</span>
        <div class="message-section">
            %s
        </div>

        <div class="ai-section">
            <span class="ai-badge">AI Draft</span>
            <span class="label" style="color: #1e40af;">Suggested Reply</span>
            <div style="margin-top: 8px; font-style: italic; color: #1e3a8a;">
                %s
            </div>
        </div>
    </div>

    <div class="footer">
        Received via Code Anyone Contact Form<br>
        <span style="opacity: 0.7;">%s</span>
    </div>
</div>
</body>
</html>
`

const userConfirmationTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f6f8; }
.container { max-width: 600px; margin: 40px auto; padding: 40px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 24px; font-weight: bold; color: #4f46e5; text-decoration: none; }
.content { color: #4b5563; font-size: 16px; }
.highlight { color: #111827; font-weight: 600; }
.summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5; }
.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;font-size: 14px; color: #9ca3af; text-align: center; }
.button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px;}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <a href="https://codeanyone.io" class="logo">Code Anyone</a>
    </div>
    <div class="content">
        <p>Hi <span class="highlight">%s</span>,</p>
        <p>Thanks for reaching out! We've received your message and our team is already looking into it.</p>
        <p>We typically respond within 24 hours. In the meantime, feel free to explore our latest courses or community discussions.</p>
        
        <div class="summary">
            <p style="margin: 0; font-size: 14px; color: #6b7280; margin-bottom: 8px;">YOU WROTE:</p>
            <p style="margin: 0; font-style: italic; color: #374151;">"%s"</p>
        </div>

        <p><a href="http://localhost:3000" class="button">Back to Learning</a></p>
    </div>
    <div class="footer">
        <p>&copy; 2025 Code Anyone. All rights reserved.</p>
        <p>Play. Learn. Create.</p>
    </div>
</div>
</body>
</html>
`

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

	// 1. Extract User ID (if authenticated)
	// Note: You must ensure this route uses OptionalAuthMiddleware in main.go
	if val, ok := r.Context().Value(middleware.UserIDKey).(int); ok {
		req.UserID = &val
	}

	// 2. Save to Database
	if err := h.dataStore.CreateContactSubmission(&req); err != nil {
		log.Printf("Failed to save contact submission: %v", err)
		sendJSONError(w, "Failed to submit request", http.StatusInternalServerError)
		return
	}

	// 3. Generate AI Auto-Draft Response (Optional Value-Add)
	aiDraft, _ := h.aiStore.GenerateEmailResponse(req.FirstName, req.Message)
	if aiDraft == "" {
		aiDraft = "Could not generate draft."
	}

	// 4. Prepare Email Content to Admin
	userIDStr := "Guest"
	if req.UserID != nil {
		userIDStr = fmt.Sprintf("%d", *req.UserID)
	}

	subject := fmt.Sprintf("Inquiry from %s %s [%s]", req.FirstName, req.LastName, userIDStr)

	// Escape HTML special characters in the message to prevent injection
	// Simplistic escaping for plain text message insert
	safeMessage := strings.ReplaceAll(req.Message, "\n", "<br>")
	safeDraft := strings.ReplaceAll(aiDraft, "\n", "<br>")

	body := fmt.Sprintf(emailTemplate,
		req.FirstName, req.LastName,
		userIDStr,
		req.Email, req.Email,
		safeMessage,
		safeDraft,
		time.Now().Format("Jan 02, 2006 at 15:04 MST")) // Added timestamp to footer

	// 5. Send Real Emails (if configured)
	if h.config.SMTPUser != "" && h.config.SMTPPass != "" {
		// A. Send Notification to Admin
		// Use a Goroutine to not block the request? No, keep it sync for now to debug.
		err := h.sendHTMLEmail([]string{h.config.AdminEmail}, subject, body)
		if err != nil {
			log.Printf("[Error] Failed to send admin email: %v", err)
		} else {
			log.Println("[Success] Admin notification sent to", h.config.AdminEmail)
		}

		// B. Send Confirmation to User
		userEmail := strings.TrimSpace(req.Email)
		if userEmail != "" {
			userSubject := "We received your message - Code Anyone"
			userBody := fmt.Sprintf(userConfirmationTemplate, req.FirstName, safeMessage)

			log.Printf("[Info] Attempting to send confirmation to user: %s", userEmail)
			err = h.sendHTMLEmail([]string{userEmail}, userSubject, userBody)
			if err != nil {
				log.Printf("[Error] Failed to send user confirmation to %s: %v", userEmail, err)
			} else {
				log.Println("[Success] User confirmation sent to", userEmail)
			}
		} else {
			log.Println("[Warning] No user email provided, skipping confirmation.")
		}

	} else {
		// Fallback Log
		log.Printf(">>> MOCK EMAIL >>> \n%s\n", body)
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Ticket created"})
}

func (h *Handler) sendHTMLEmail(to []string, subject, body string) error {
	auth := smtp.PlainAuth("", h.config.SMTPUser, h.config.SMTPPass, h.config.SMTPHost)

	// Headers for HTML email
	headers := make(map[string]string)
	headers["From"] = h.config.SMTPUser
	headers["To"] = strings.Join(to, ",")
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=UTF-8"

	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + body

	addr := fmt.Sprintf("%s:%s", h.config.SMTPHost, h.config.SMTPPort)
	return smtp.SendMail(addr, auth, h.config.SMTPUser, to, []byte(message))
}
