package config

import (
	"log"
	"os"
)

type Config struct {
	Port                string
	FirebaseProjectID   string
	FirebaseCredentials string
	AllowedOrigins      []string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	firebaseProjectID := os.Getenv("FIREBASE_PROJECT_ID")
	firebaseCredentials := os.Getenv("FIREBASE_CREDENTIALS_PATH")
	if firebaseCredentials == "" {
		firebaseCredentials = "firebase-admin-key.json"
	}

	allowedOrigins := []string{
		"http://localhost:5173",
		"http://localhost:3000",
	}

	config := &Config{
		Port:                port,
		FirebaseProjectID:   firebaseProjectID,
		FirebaseCredentials: firebaseCredentials,
		AllowedOrigins:      allowedOrigins,
	}

	log.Printf("Configuration loaded: Port=%s, Project=%s", config.Port, config.FirebaseProjectID)
	return config
}
