package store

import (
	"codefuture-backend/internal/models"
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	db *sql.DB
}

func NewStore() *Store {
	// Use SQLite for reliability. Store DB in backend root (up two dirs from cmd/api)
	dbPath := "../../codefuture.db"

	// Check if we are running from root (tests or direct go run)
	if _, err := os.Stat("cmd/api/main.go"); err == nil {
		dbPath = "./codefuture.db"
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Printf("Warning: Failed to connect to database: %v", err)
		return &Store{db: nil}
	}

	return &Store{db: db}
}

func (s *Store) InitSchema() {
	if s.db == nil {
		return
	}

	query := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE,
		name TEXT,
		password TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS lesson_plans (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		persona TEXT,
		goals TEXT,
		content TEXT,
		current_lesson_index INTEGER DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id)
	);
	CREATE TABLE IF NOT EXISTS posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		author_name TEXT,
		title TEXT,
		content TEXT,
		topic TEXT,
		likes INTEGER DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id)
	);
	CREATE TABLE IF NOT EXISTS contact_submissions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name TEXT,
		last_name TEXT,
		email TEXT,
		message TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := s.db.Exec(query)
	if err != nil {
		log.Printf("Error creating schema: %v", err)
	} else {
		log.Println("Schema initialized successfully (SQLite)")
	}
	// Try to add user_id column if it doesn't exist (primitive migration)
	_, _ = s.db.Exec("ALTER TABLE contact_submissions ADD COLUMN user_id INTEGER REFERENCES users(id)")
	// Try to add current_lesson_index column if it doesn't exist (primitive migration for roadmap)
	_, _ = s.db.Exec("ALTER TABLE lesson_plans ADD COLUMN current_lesson_index INTEGER DEFAULT 0")
}

func (s *Store) Ping() error {
	if s.db == nil {
		return nil
	}
	return s.db.Ping()
}

func (s *Store) SaveLessonPlan(userID *int, persona, goals, content string) (int, error) {
	if s.db == nil {
		return 0, nil
	}
	// SQLite uses ? for placeholders
	res, err := s.db.Exec("INSERT INTO lesson_plans (user_id, persona, goals, content) VALUES (?, ?, ?, ?)", userID, persona, goals, content)
	if err != nil {
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (s *Store) GetCoursesByUserID(userID int) ([]map[string]interface{}, error) {
	if s.db == nil {
		return nil, nil
	}
	// SQLite uses ?
	rows, err := s.db.Query("SELECT id, persona, goals, created_at FROM lesson_plans WHERE user_id = ? ORDER BY created_at DESC", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []map[string]interface{}
	for rows.Next() {
		var id int
		var persona, goals string
		var createdAt interface{}
		if err := rows.Scan(&id, &persona, &goals, &createdAt); err != nil {
			continue
		}
		courses = append(courses, map[string]interface{}{
			"id":        id,
			"persona":   persona,
			"goals":     goals,
			"createdAt": createdAt, // SQLite returns string or time based on driver settings
		})
	}
	return courses, nil
}

func (s *Store) GetLatestLessonPlan(userID int) (*models.LessonPlan, error) {
	if s.db == nil {
		return nil, nil
	}
	var lp models.LessonPlan
	// Fix: Ensure we scan current_lesson_index. If it's NULL (old schema), SQLite handles DEFAULT 0
	err := s.db.QueryRow(`
		SELECT id, persona, goals, content, current_lesson_index, created_at 
		FROM lesson_plans 
		WHERE user_id = ? 
		ORDER BY created_at DESC 
		LIMIT 1`, userID).Scan(&lp.ID, &lp.Persona, &lp.Goals, &lp.Content, &lp.CurrentLessonIndex, &lp.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &lp, nil
}

func (s *Store) UpdateLessonProgress(planID int, lessonIndex int) error {
	if s.db == nil {
		return nil
	}
	_, err := s.db.Exec("UPDATE lesson_plans SET current_lesson_index = ? WHERE id = ?", lessonIndex, planID)
	return err
}

func (s *Store) GetLessonPlanByID(planID int) (*models.LessonPlan, error) {
	if s.db == nil {
		return nil, nil
	}
	var lp models.LessonPlan
	err := s.db.QueryRow(`
		SELECT id, persona, goals, content, current_lesson_index, created_at 
		FROM lesson_plans 
		WHERE id = ?`, planID).Scan(&lp.ID, &lp.Persona, &lp.Goals, &lp.Content, &lp.CurrentLessonIndex, &lp.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &lp, nil
}

func (s *Store) DeleteCourse(userID int, courseID int) error {
	if s.db == nil {
		return nil
	}
	_, err := s.db.Exec("DELETE FROM lesson_plans WHERE id = ? AND user_id = ?", courseID, userID)
	return err
}

func (s *Store) Close() {
	if s.db != nil {
		s.db.Close()
	}
}

func (s *Store) CreateContactSubmission(sub *models.ContactSubmission) error {
	if s.db == nil {
		return nil
	}
	_, err := s.db.Exec("INSERT INTO contact_submissions (first_name, last_name, email, message, user_id) VALUES (?, ?, ?, ?, ?)",
		sub.FirstName, sub.LastName, sub.Email, sub.Message, sub.UserID)
	return err
}
