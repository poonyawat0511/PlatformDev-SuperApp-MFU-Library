package main

import (
	"context"
	"log"
	"time"

	"auth/config"
	"auth/routes"

	"github.com/gin-contrib/cors" // Import the cors middleware package
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	config.LoadEnv()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.GetMongoURI()))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("auth_db")
	userCollection := db.Collection("users")

	r := gin.Default()

	// CORS middleware configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"}, // Allows all origins
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	routes.AuthRoutes(r, userCollection)

	port := config.GetPort()
	r.Run(":" + port)
}
