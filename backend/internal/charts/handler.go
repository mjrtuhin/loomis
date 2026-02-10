package charts

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	generator *ChartGenerator
}

func NewHandler() *Handler {
	return &Handler{
		generator: NewChartGenerator(),
	}
}

func (h *Handler) GenerateChart(c *gin.Context) {
	var req ChartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.generator.GenerateChart(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetChartTypes(c *gin.Context) {
	chartTypes := []map[string]interface{}{
		{
			"type":        "bar",
			"name":        "Bar Chart",
			"category":    "basic",
			"description": "Compare values across categories",
		},
		{
			"type":        "bar_horizontal",
			"name":        "Horizontal Bar",
			"category":    "basic",
			"description": "Bar chart with horizontal orientation",
		},
		{
			"type":        "bar_stacked",
			"name":        "Stacked Bar",
			"category":    "basic",
			"description": "Compare multiple series stacked",
		},
		{
			"type":        "line",
			"name":        "Line Chart",
			"category":    "basic",
			"description": "Show trends over time",
		},
		{
			"type":        "line_smooth",
			"name":        "Smooth Line",
			"category":    "basic",
			"description": "Line chart with smooth curves",
		},
		{
			"type":        "area",
			"name":        "Area Chart",
			"category":    "basic",
			"description": "Line chart with filled area",
		},
		{
			"type":        "pie",
			"name":        "Pie Chart",
			"category":    "basic",
			"description": "Show proportions of a whole",
		},
		{
			"type":        "scatter",
			"name":        "Scatter Plot",
			"category":    "basic",
			"description": "Show relationship between variables",
		},
	}

	c.JSON(http.StatusOK, gin.H{"charts": chartTypes})
}
