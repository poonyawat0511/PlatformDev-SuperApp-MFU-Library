package routes

import (
	"auth/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func AuthRoutes(r *gin.Engine, userCollection *mongo.Collection) {
	r.POST("/auth/register", func(c *gin.Context) {
		controllers.Register(c, userCollection)
	})
	r.POST("/auth/login", func(c *gin.Context) {
		controllers.Login(c, userCollection)
	})
	r.POST("/auth/refresh", func(c *gin.Context) {
		controllers.RefreshToken(c, userCollection)
	})
	r.GET("/auth/profile", func(c *gin.Context) {
		controllers.GetProfile(c, userCollection)
	})
}
