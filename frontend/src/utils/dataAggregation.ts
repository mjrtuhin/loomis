export function aggregateData(
  rows: any[],
  categoryColumn: string,
  valueColumn: string
): { categories: string[], values: number[] } {
  const aggregated: { [key: string]: number } = {};
  
  rows.forEach((row: any) => {
    const category = String(row[categoryColumn] || 'Unknown');
    const value = parseFloat(row[valueColumn]);
    
    if (!isNaN(value)) {
      if (aggregated[category]) {
        aggregated[category] += value;
      } else {
        aggregated[category] = value;
      }
    }
  });

  return {
    categories: Object.keys(aggregated),
    values: Object.values(aggregated)
  };
}
