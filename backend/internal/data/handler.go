package data

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

// AnalyzeSheet handles POST /api/sheets/analyze
func (h *Handler) AnalyzeSheet(c *gin.Context) {
	var req AnalyzeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": err.Error(),
		})
		return
	}

	// Fetch data from Google Sheets
	data, err := FetchGoogleSheet(req.URL)
	if err != nil {
		if err.Error() == "sheet is not public (403 Forbidden)" {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Sheet not accessible",
				"message": "The Google Sheet is not public. Please share it with 'Anyone with the link can view'.",
			})
			return
		}

		if err.Error() == "sheet not found (404 Not Found)" {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Sheet not found",
				"message": "Could not find the Google Sheet. Please check the URL.",
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Failed to load sheet",
			"message": err.Error(),
		})
		return
	}

	// Analyze data quality
	quality := AnalyzeQuality(data)

	// Return response
	c.JSON(http.StatusOK, AnalyzeResponse{
		Data:    *data,
		Quality: *quality,
	})
}
