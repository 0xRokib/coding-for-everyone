# Code for Everyone 🚀

A personalized, AI-powered coding mentorship platform designed for **everyone**—from visual learners to aspiring professionals.

## 🌟 Mission
To democratize coding education by adapting the curriculum to the learner's style, not the other way around. Whether you are a visual learner, a career switcher, or a project builder, interacting with code should be intuitive and relevant to **you**.

## ✨ Features
* **Personalized AI Curriculum**: Uniquely generated learning paths based on your specific goals (e.g., "Build a game", "Automate excel").
* **Adaptive Learning Styles**:
  * 🎨 **Visual Learner**: Concepts explained with clear analogies and visuals.
  * 💼 **Career Focused**: Fast-track to industry standards and best practices.
  * 🚀 **Project Builder**: Learn by building tools that solve real problems.
* **Interactive Code Studio**: Write, run, and debug code directly in your browser.
* **Real-time AI Mentorship**: Get instant feedback and explanations.

## 🛠️ Tech Stack
* **Frontend**: React, TypeScript, Tailwind CSS, Vite
* **Backend**: Go (Golang), SQLite, Google Gemini AI 1.5
* **Auth**: Google & GitHub OAuth secured with JWT

## 🚀 Run Locally

### Prerequisites
* Node.js & npm
* Go 1.21+

### 1. Setup Backend
```bash
cd backend
# Create .env file with your keys (see .env.example)
go run cmd/api/main.go
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3001` to start your journey!
