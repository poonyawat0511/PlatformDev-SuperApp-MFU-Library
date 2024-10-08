package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	// Load the general .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Load the secrets .env.secret file
	err = godotenv.Load(".env.secret")
	if err != nil {
		log.Fatalf("Error loading .env.secret file: %v", err)
	}
}

func GetMongoURI() string {
	return os.Getenv("MONGO_URI")
}

func GetJWTSecret() string {
	return os.Getenv("JWT_SECRET")
}

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if PORT is not set
	}
	return port
}
