package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mjrtuhin/loomis-backend/internal/auth"
)

type AuthMiddleware struct {
	firebaseAuth *auth.FirebaseAuth
}

func NewAuthMiddleware(firebaseAuth *auth.FirebaseAuth) *AuthMiddleware {
	return &AuthMiddleware{
		firebaseAuth: firebaseAuth,
	}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		token := parts[1]

		// Verify token with Firebase
		ctx := context.Background()
		decodedToken, err := m.firebaseAuth.VerifyToken(ctx, token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store user ID in context
		c.Set("userID", decodedToken.UID)
		c.Set("email", decodedToken.Claims["email"])

		c.Next()
	}
}
