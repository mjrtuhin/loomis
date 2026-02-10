package data

type SheetData struct {
	Headers []string   `json:"headers"`
	Rows    [][]string `json:"rows"`
}

type QualityIssue struct {
	Severity string `json:"severity"` // "ERROR", "WARNING", "INFO"
	Row      int    `json:"row"`
	Column   string `json:"column"`
	Message  string `json:"message"`
	Type     string `json:"type"` // "missing_value", "type_mismatch", etc.
}

type QualityReport struct {
	Score        int             `json:"score"`
	TotalRows    int             `json:"totalRows"`
	TotalColumns int             `json:"totalColumns"`
	CleanRows    int             `json:"cleanRows"`
	IssueRows    int             `json:"issueRows"`
	Issues       []QualityIssue  `json:"issues"`
}

type AnalyzeResponse struct {
	Data    SheetData     `json:"data"`
	Quality QualityReport `json:"quality"`
}

type AnalyzeRequest struct {
	URL string `json:"url" binding:"required"`
}
