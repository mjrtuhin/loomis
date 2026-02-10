package data

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"regexp"
	"strings"
)

// ExtractFileID extracts the Google Sheets file ID from various URL formats
func ExtractFileID(url string) (string, error) {
	patterns := []string{
		`/spreadsheets/d/([a-zA-Z0-9-_]+)`,
		`/d/([a-zA-Z0-9-_]+)`,
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(url)
		if len(matches) > 1 {
			return matches[1], nil
		}
	}

	return "", fmt.Errorf("could not extract file ID from URL")
}

// FetchGoogleSheet fetches data from a public Google Sheet
func FetchGoogleSheet(url string) (*SheetData, error) {
	// Extract file ID
	fileID, err := ExtractFileID(url)
	if err != nil {
		return nil, err
	}

	// Build CSV export URL
	csvURL := fmt.Sprintf("https://docs.google.com/spreadsheets/d/%s/export?format=csv", fileID)

	// Fetch CSV data
	resp, err := http.Get(csvURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch sheet: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 403 {
		return nil, fmt.Errorf("sheet is not public (403 Forbidden)")
	}

	if resp.StatusCode == 404 {
		return nil, fmt.Errorf("sheet not found (404 Not Found)")
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Parse CSV
	reader := csv.NewReader(resp.Body)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to parse CSV: %w", err)
	}

	if len(records) == 0 {
		return nil, fmt.Errorf("sheet is empty")
	}

	// First row is headers
	headers := records[0]
	var rows [][]string

	// Rest are data rows
	if len(records) > 1 {
		rows = records[1:]
	}

	// Clean headers (remove whitespace)
	for i, header := range headers {
		headers[i] = strings.TrimSpace(header)
	}

	return &SheetData{
		Headers: headers,
		Rows:    rows,
	}, nil
}
