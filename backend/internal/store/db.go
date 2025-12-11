package store

import (
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
		name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS lesson_plans (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		persona TEXT,
		goals TEXT,
		content TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id)
	);
	`
	_, err := s.db.Exec(query)
	if err != nil {
		log.Printf("Error creating schema: %v", err)
	} else {
		log.Println("Schema initialized successfully (SQLite)")
	}
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

func (s *Store) Close() {
	if s.db != nil {
		s.db.Close()
	}
}
