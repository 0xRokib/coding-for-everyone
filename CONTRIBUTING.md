# Contributing to Code for Everyone

We successfully maintain this project by following a structured workflow. Please follow these guidelines.

## 🌿 Branching Strategy

We use a variation of **Gitflow**.

| Branch | Purpose | Protected? |
| :--- | :--- | :--- |
| **`main`** | Production-ready code. Deployed automatically. | 🔒 YES |
| **`develop`** | Integration branch. All features merge here first. | 🔒 YES |
| **`feature/*`** | New features (e.g., `feature/user-profile`). | No |
| **`fix/*`** | Bug fixes (e.g., `fix/login-error`). | No |
| **`hotfix/*`** | Urgent production fixes. | No |

## 🚀 Workflow

1.  **Pull Latest Changes**:
    ```bash
    git checkout develop
    git pull origin develop
    ```

2.  **Create a Branch**:
    *   For a new feature: `git checkout -b feature/my-cool-feature`
    *   For a bug fix: `git checkout -b fix/annoying-bug`

3.  **Commit Often**:
    *   Use conventional commits: `feat: add google login`, `fix: resolve crash on startup`.

4.  **Push & Pull Request**:
    *   Push to GitHub: `git push origin feature/my-cool-feature`
    *   Open a **Pull Request (PR)** targeting `develop`.

## 🛠 Setup for Development

1.  **Backend** (`/backend`):
    *   Copy `.env.example` to `.env` and fill keys.
    *   Run: `go run cmd/api/main.go`

2.  **Frontend** (`/frontend`):
    *   Run: `npm install`
    *   Run: `npm run dev`
