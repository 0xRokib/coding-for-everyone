package models

import "time"

type Post struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	AuthorName string    `json:"author_name"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Topic      string    `json:"topic"`
	Likes      int       `json:"likes"`
	CreatedAt  time.Time `json:"created_at"`
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Topic   string `json:"topic"`
}
