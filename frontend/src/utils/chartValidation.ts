export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateNumericColumn = (
  data: string[][],
  columnIndex: number,
  columnName: string
): ValidationResult => {
  if (columnIndex === -1) {
    return { isValid: false, error: `Column "${columnName}" not found` };
  }

  const nonNumericRows: number[] = [];
  data.forEach((row, idx) => {
    const value = row[columnIndex];
    if (value && isNaN(parseFloat(value))) {
      nonNumericRows.push(idx + 1);
    }
  });

  if (nonNumericRows.length > 0) {
    return {
      isValid: false,
      error: `Column "${columnName}" contains non-numeric values at rows: ${nonNumericRows.slice(0, 5).join(', ')}${nonNumericRows.length > 5 ? '...' : ''}`
    };
  }

  return { isValid: true };
};

export const validateDateColumn = (
  data: string[][],
  columnIndex: number,
  columnName: string
): ValidationResult => {
  if (columnIndex === -1) {
    return { isValid: false, error: `Column "${columnName}" not found` };
  }

  const invalidRows: number[] = [];
  data.forEach((row, idx) => {
    const value = row[columnIndex];
    if (value && isNaN(Date.parse(value))) {
      invalidRows.push(idx + 1);
    }
  });

  if (invalidRows.length > 0) {
    return {
      isValid: false,
      error: `Column "${columnName}" contains invalid dates at rows: ${invalidRows.slice(0, 5).join(', ')}${invalidRows.length > 5 ? '...' : ''}. Use format: YYYY-MM-DD`
    };
  }

  return { isValid: true };
};

export const validateCoordinates = (
  data: string[][],
  latIndex: number,
  lonIndex: number,
  latName: string,
  lonName: string
): ValidationResult => {
  if (latIndex === -1) {
    return { isValid: false, error: `Latitude column "${latName}" not found` };
  }
  if (lonIndex === -1) {
    return { isValid: false, error: `Longitude column "${lonName}" not found` };
  }

  const invalidRows: number[] = [];
  data.forEach((row, idx) => {
    const lat = parseFloat(row[latIndex]);
    const lon = parseFloat(row[lonIndex]);
    
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      invalidRows.push(idx + 1);
    }
  });

  if (invalidRows.length > 0) {
    return {
      isValid: false,
      error: `Invalid coordinates at rows: ${invalidRows.slice(0, 5).join(', ')}${invalidRows.length > 5 ? '...' : ''}. Lat: -90 to 90, Lon: -180 to 180`
    };
  }

  return { isValid: true };
};

export const validateMinimumRows = (
  data: string[][],
  minimum: number,
  chartType: string
): ValidationResult => {
  if (data.length < minimum) {
    return {
      isValid: false,
      error: `${chartType} requires at least ${minimum} rows of data. Found: ${data.length}`
    };
  }
  return { isValid: true };
};

export const validateColumnExists = (
  headers: string[],
  columnName: string
): ValidationResult => {
  if (!columnName) {
    return { isValid: false, error: 'Please select a column' };
  }
  if (!headers.includes(columnName)) {
    return { isValid: false, error: `Column "${columnName}" not found in data` };
  }
  return { isValid: true };
};

export const validateOHLC = (
  data: string[][],
  openIdx: number,
  highIdx: number,
  lowIdx: number,
  closeIdx: number
): ValidationResult => {
  const invalidRows: number[] = [];
  
  data.forEach((row, idx) => {
    const open = parseFloat(row[openIdx]);
    const high = parseFloat(row[highIdx]);
    const low = parseFloat(row[lowIdx]);
    const close = parseFloat(row[closeIdx]);
    
    if (isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
      invalidRows.push(idx + 1);
    } else if (high < low || high < open || high < close || low > open || low > close) {
      invalidRows.push(idx + 1);
    }
  });

  if (invalidRows.length > 0) {
    return {
      isValid: false,
      error: `Invalid OHLC data at rows: ${invalidRows.slice(0, 5).join(', ')}${invalidRows.length > 5 ? '...' : ''}. Ensure High ≥ Low, Open, Close`
    };
  }

  return { isValid: true };
};
