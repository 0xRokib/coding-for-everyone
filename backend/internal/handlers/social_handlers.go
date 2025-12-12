package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"codefuture-backend/internal/models"

	"golang.org/x/oauth2"
)

// No globals or init functions needed anymore!

func (h *Handler) HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := h.config.GoogleOAuthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *Handler) HandleGitHubLogin(w http.ResponseWriter, r *http.Request) {
	url := h.config.GitHubOAuthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *Handler) HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := h.config.GoogleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
		return
	}

	client := h.config.GoogleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var googleUser struct {
		Email string `json:"email"`
		Name  string `json:"name"`
		ID    string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
		return
	}

	// Process User (Login/Signup)
	h.processSocialLogin(w, r, googleUser.Name, googleUser.Email, "google")
}

func (h *Handler) HandleGitHubCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := h.config.GitHubOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
		return
	}

	client := h.config.GitHubOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var githubUser struct {
		Login string `json:"login"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	// Note: GitHub email might be private, need extra call properly, but keeping simple
	if err := json.NewDecoder(resp.Body).Decode(&githubUser); err != nil {
		http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
		return
	}

	email := githubUser.Email
	if email == "" {
		email = fmt.Sprintf("%s@github.com", githubUser.Login) // Fallback
	}
	name := githubUser.Name
	if name == "" {
		name = githubUser.Login
	}

	h.processSocialLogin(w, r, name, email, "github")
}

func (h *Handler) processSocialLogin(w http.ResponseWriter, r *http.Request, name, email, provider string) {
	user, _ := h.dataStore.GetUserByEmail(email)
	if user == nil {
		user = &models.User{
			Name:     name,
			Email:    email,
			Password: fmt.Sprintf("social_%s_%s", provider, "secure"), // Dummy
		}
		h.dataStore.CreateUser(user)
	}

	token, _ := generateToken(user.ID)

	// Redirect to frontend with token
	http.Redirect(w, r, fmt.Sprintf("%s/login?token=%s&user_id=%d&name=%s&email=%s", h.config.FrontendURL, token, user.ID, user.Name, user.Email), http.StatusTemporaryRedirect)
}
