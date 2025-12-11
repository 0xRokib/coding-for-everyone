package store

import (
	"codefuture-backend/internal/models"
	"database/sql"
	"fmt"
	"strings"
	"time"
)

func (s *Store) CreateUser(user *models.User) error {
	if s.db == nil {
		return fmt.Errorf("database not connected")
	}

	query := `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
	result, err := s.db.Exec(query, user.Name, user.Email, user.Password)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") { // SQLite specific error
			return fmt.Errorf("email already exists")
		}
		return fmt.Errorf("error creating user: %v", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert id: %v", err)
	}

	user.ID = int(id)
	user.CreatedAt = time.Now()
	return nil
}

func (s *Store) GetUserByEmail(email string) (*models.User, error) {
	if s.db == nil {
		return nil, fmt.Errorf("database not connected")
	}

	user := &models.User{}
	query := `SELECT id, name, email, password, created_at FROM users WHERE email = ?`
	err := s.db.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Not found
		}
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}
