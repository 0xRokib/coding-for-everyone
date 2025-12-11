package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Attempt to load .env from backend root
	err := godotenv.Load("../../.env")
	if err != nil {
		err = godotenv.Load(".env") // Fallback
	}

	keys := []string{
		"GEMINI_API_KEY",
		"JWT_SECRET",
		"GOOGLE_CLIENT_ID",
		"GOOGLE_CLIENT_SECRET",
		"GITHUB_CLIENT_ID",
		"GITHUB_CLIENT_SECRET",
		"CALLBACK_URL_BASE",
		"FRONTEND_URL",
	}

	fmt.Println("--- ENV CHECK REPORT ---")
	if err != nil {
		fmt.Printf("⚠️  Could not load .env file directly (Error: %v). Checking system vars...\n", err)
	} else {
		fmt.Println("✅ .env file loaded successfully.")
	}

	missingCount := 0
	for _, key := range keys {
		val := os.Getenv(key)
		if val == "" {
			fmt.Printf("❌ %-20s : MISSING\n", key)
			missingCount++
		} else {
			// Check for placeholder values users often forget to change
			if val == "your_google_client_id" || val == "your_secret" {
				fmt.Printf("⚠️  %-20s : EXPOSED PLACEHOLDER (Change this!)\n", key)
				missingCount++
			} else {
				fmt.Printf("✅ %-20s : PRESENT\n", key)
			}
		}
	}

	if missingCount > 0 {
		fmt.Printf("\nFAILURE: %d critical variables are missing or invalid.\n", missingCount)
	} else {
		fmt.Println("\nSUCCESS: All login variables are configured.")
	}
}
