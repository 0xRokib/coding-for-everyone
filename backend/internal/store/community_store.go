package store

import (
	"codefuture-backend/internal/models"
)

func (s *Store) CreatePost(post *models.Post) error {
	res, err := s.db.Exec(`
		INSERT INTO posts (user_id, author_name, title, content, topic, likes, created_at)
		VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
		post.UserID, post.AuthorName, post.Title, post.Content, post.Topic,
	)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	post.ID = int(id)
	return nil
}

func (s *Store) GetPosts() ([]models.Post, error) {
	rows, err := s.db.Query(`SELECT id, user_id, author_name, title, content, topic, likes, created_at FROM posts ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.AuthorName, &p.Title, &p.Content, &p.Topic, &p.Likes, &p.CreatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}
