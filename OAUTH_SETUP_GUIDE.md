# Google & GitHub OAuth Setup Guide

Your Google and GitHub login buttons aren't working because you need to set up OAuth credentials. Follow these steps:

## 🔴 Current Issue
The OAuth buttons redirect to Google/GitHub, but the authentication fails because:
- Missing `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Missing `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

## ✅ Solution: Set Up OAuth Apps

### 1️⃣ **Google OAuth Setup**

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "CodeFuture Academy" → Click "Create"

#### Step 2: Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

#### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **CodeFuture Academy**
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue" through all steps
4. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: **CodeFuture Academy**
   - Authorized JavaScript origins:
     - `http://localhost:3002`
   - Authorized redirect URIs:
     - `http://localhost:8081/api/auth/google/callback`
   - Click "Create"

#### Step 4: Copy Your Credentials
You'll see a popup with:
- **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123xyz`)

**Save these!** You'll need them for your `.env` file.

---

### 2️⃣ **GitHub OAuth Setup**

#### Step 1: Create a GitHub OAuth App
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"

#### Step 2: Fill in the Details
- **Application name**: `CodeFuture Academy`
- **Homepage URL**: `http://localhost:3002`
- **Authorization callback URL**: `http://localhost:8081/api/auth/github/callback`
- Click "Register application"

#### Step 3: Generate Client Secret
1. After creating, you'll see your **Client ID**
2. Click "Generate a new client secret"
3. Copy the **Client Secret** (you can only see it once!)

**Save these!** You'll need them for your `.env` file.

---

### 3️⃣ **Update Your `.env` File**

Open `/Users/rokib/Desktop/coding-for-everyone/backend/.env` and add:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Also update the frontend URL if needed
FRONTEND_URL=http://localhost:3002
```

Replace the placeholder values with your actual credentials from steps 1 and 2.

---

### 4️⃣ **Restart the Backend**

After updating `.env`, restart your backend server:

```bash
cd backend
go run cmd/api/main.go
```

---

### 5️⃣ **Test OAuth Login**

1. Go to `http://localhost:3002/login`
2. Click "Google" or "GitHub" button
3. You should be redirected to Google/GitHub
4. After authorizing, you'll be redirected back and logged in!

---

## 🔒 Security Notes

- **Never commit your `.env` file to git** (it's already in `.gitignore`)
- Keep your Client Secrets private
- For production, update the callback URLs to your production domain
- Use environment variables in production (not `.env` file)

---

## 🐛 Troubleshooting

### "Redirect URI mismatch" error
- Make sure your callback URL in Google/GitHub exactly matches:
  - Google: `http://localhost:8081/api/auth/google/callback`
  - GitHub: `http://localhost:8081/api/auth/github/callback`

### "Invalid client" error
- Double-check your Client ID and Secret in `.env`
- Make sure there are no extra spaces or quotes

### Still not working?
- Check backend logs for errors
- Verify the backend is running on port 8081
- Verify the frontend is running on port 3002
- Clear browser cache and try again

---

## 📝 Quick Reference

**Backend runs on**: `http://localhost:8081`
**Frontend runs on**: `http://localhost:3002`

**Google Callback**: `http://localhost:8081/api/auth/google/callback`
**GitHub Callback**: `http://localhost:8081/api/auth/github/callback`

---

## ✅ After Setup

Once you've added the credentials to `.env` and restarted the backend:

1. ✅ Google OAuth will work
2. ✅ GitHub OAuth will work
3. ✅ Users can sign up/login with social accounts
4. ✅ Email/password login will continue to work

Good luck! 🚀
