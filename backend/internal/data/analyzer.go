package data

import (
	"math"
	"strconv"
	"strings"
)

// AnalyzeQuality performs comprehensive data quality analysis
func AnalyzeQuality(data *SheetData) *QualityReport {
	issues := []QualityIssue{}
	rowsWithIssues := make(map[int]bool)

	totalRows := len(data.Rows)
	totalColumns := len(data.Headers)

	// Check each cell for issues
	for rowIdx, row := range data.Rows {
		rowNum := rowIdx + 2 // +2 because row 1 is headers, and we're 0-indexed

		for colIdx, cell := range row {
			if colIdx >= len(data.Headers) {
				continue
			}

			colName := data.Headers[colIdx]

			// Check for missing values
			if isMissingValue(cell) {
				issues = append(issues, QualityIssue{
					Severity: "WARNING",
					Row:      rowNum,
					Column:   colName,
					Message:  "Missing value",
					Type:     "missing_value",
				})
				rowsWithIssues[rowNum] = true
			}

			// Check for negative values in columns that should be positive
			if shouldBePositive(colName) && isNegative(cell) {
				issues = append(issues, QualityIssue{
					Severity: "ERROR",
					Row:      rowNum,
					Column:   colName,
					Message:  "Negative value " + cell + " (should be positive)",
					Type:     "negative_value",
				})
				rowsWithIssues[rowNum] = true
			}
		}
	}

	// Calculate quality score
	totalCells := totalRows * totalColumns
	issueCount := len(issues)
	score := 100
	if totalCells > 0 {
		score = 100 - int(float64(issueCount)/float64(totalCells)*100)
		if score < 0 {
			score = 0
		}
	}

	cleanRows := totalRows - len(rowsWithIssues)

	return &QualityReport{
		Score:        score,
		TotalRows:    totalRows,
		TotalColumns: totalColumns,
		CleanRows:    cleanRows,
		IssueRows:    len(rowsWithIssues),
		Issues:       issues,
	}
}

// isMissingValue checks if a cell value is empty or whitespace
func isMissingValue(value string) bool {
	return strings.TrimSpace(value) == ""
}

// shouldBePositive checks if column name suggests positive values only
func shouldBePositive(colName string) bool {
	lower := strings.ToLower(colName)
	positiveKeywords := []string{
		"price", "cost", "amount", "total", "sum", "revenue", "sales",
		"quantity", "count", "number", "qty", "age", "population",
		"weight", "height", "distance", "duration", "time",
	}

	for _, keyword := range positiveKeywords {
		if strings.Contains(lower, keyword) {
			return true
		}
	}
	return false
}

// isNegative checks if a value is a negative number
func isNegative(value string) bool {
	value = strings.TrimSpace(value)
	if value == "" {
		return false
	}

	num, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return false
	}

	return num < 0
}

// isNumeric checks if a value can be parsed as a number
func isNumeric(value string) bool {
	value = strings.TrimSpace(value)
	if value == "" {
		return false
	}

	_, err := strconv.ParseFloat(value, 64)
	return err == nil
}

// calculateOutliers detects statistical outliers using IQR method
func calculateOutliers(values []float64) (lowerBound, upperBound float64) {
	if len(values) < 4 {
		return math.Inf(-1), math.Inf(1)
	}

	// Sort values (simple bubble sort for small datasets)
	sorted := make([]float64, len(values))
	copy(sorted, values)
	for i := 0; i < len(sorted); i++ {
		for j := i + 1; j < len(sorted); j++ {
			if sorted[i] > sorted[j] {
				sorted[i], sorted[j] = sorted[j], sorted[i]
			}
		}
	}

	// Calculate quartiles
	q1Index := len(sorted) / 4
	q3Index := (len(sorted) * 3) / 4

	q1 := sorted[q1Index]
	q3 := sorted[q3Index]
	iqr := q3 - q1

	lowerBound = q1 - (1.5 * iqr)
	upperBound = q3 + (1.5 * iqr)

	return lowerBound, upperBound
}
