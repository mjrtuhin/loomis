export interface SheetData {
  headers: string[];
  rows: string[][];
}

export interface QualityIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  row: number;
  column: string;
  message: string;
  type: 'missing_value' | 'type_mismatch' | 'negative_value' | 'outlier' | 
        'range_anomaly' | 'duplicate_row' | 'format_inconsistency';
}

export interface QualityReport {
  score: number;
  totalRows: number;
  totalColumns: number;
  cleanRows: number;
  issueRows: number;
  issues: QualityIssue[];
}

export interface AnalyzeResponse {
  data: SheetData;
  quality: QualityReport;
}
