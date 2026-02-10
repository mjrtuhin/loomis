package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mjrtuhin/loomis-backend/internal/auth"
	"github.com/mjrtuhin/loomis-backend/internal/config"
	"github.com/mjrtuhin/loomis-backend/internal/data"
	"github.com/mjrtuhin/loomis-backend/internal/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize Firebase Admin SDK
	firebaseAuth, err := auth.NewFirebaseAuth(cfg.FirebaseCredentials)
	if err != nil {
		log.Fatal("Failed to initialize Firebase:", err)
	}

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(firebaseAuth)

	// Initialize handlers
	dataHandler := data.NewHandler()

	// Create Gin router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public routes
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := router.Group("/api")
	{
		// Auth verification endpoint (protected)
		api.POST("/auth/verify-token", authMiddleware.RequireAuth(), func(c *gin.Context) {
			userID, _ := c.Get("userID")
			email, _ := c.Get("email")
			
			c.JSON(200, gin.H{
				"valid":  true,
				"userId": userID,
				"email":  email,
			})
		})

		// Sheets endpoint (protected)
		api.POST("/sheets/analyze", authMiddleware.RequireAuth(), dataHandler.AnalyzeSheet)

		// TODO: Add more endpoints
		// /api/charts/generate
		// /api/charts/types
		// /api/dashboard/save
		// /api/dashboard (GET)
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
