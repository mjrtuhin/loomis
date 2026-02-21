package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mjrtuhin/loomis-backend/internal/auth"
	"github.com/mjrtuhin/loomis-backend/internal/charts"
	"github.com/mjrtuhin/loomis-backend/internal/config"
	"github.com/mjrtuhin/loomis-backend/internal/data"
	"github.com/mjrtuhin/loomis-backend/internal/middleware"
)

func main() {
	cfg := config.Load()

	firebaseAuth, err := auth.NewFirebaseAuth(cfg.FirebaseCredentials)
	if err != nil {
		log.Fatal("Failed to initialize Firebase:", err)
	}

	authMiddleware := middleware.NewAuthMiddleware(firebaseAuth)

	dataHandler := data.NewHandler()
	chartHandler := charts.NewHandler()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := router.Group("/api")
	{
		api.POST("/auth/verify-token", authMiddleware.RequireAuth(), func(c *gin.Context) {
			userID, _ := c.Get("userID")
			email, _ := c.Get("email")

			c.JSON(200, gin.H{
				"valid":  true,
				"userId": userID,
				"email":  email,
			})
		})

		api.POST("/sheets/analyze", dataHandler.AnalyzeSheet)
		api.POST("/charts/generate", chartHandler.GenerateChart)
		api.GET("/charts/types", chartHandler.GetChartTypes)
	}

	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
