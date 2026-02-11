import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface StackedBarChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function StackedBarChartConfig({ sheetData, onPreviewChange }: StackedBarChartConfigProps) {
  const [categoryColumn, setCategoryColumn] = useState('');
  const [valueColumns, setValueColumns] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const toggleValueColumn = (column: string) => {
    setValueColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (!sheetData || !categoryColumn || valueColumns.length === 0) {
      onPreviewChange(null);
      return;
    }

    const categoryValidation = validateColumnExists(sheetData.headers, categoryColumn);
    if (!categoryValidation.isValid) {
      onPreviewChange({ error: categoryValidation.error });
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    for (const col of valueColumns) {
      const validation = validateNumericColumn(sheetData.headers, formattedRows, col);
      if (!validation.isValid) {
        onPreviewChange({ error: `${col}: ${validation.error}` });
        return;
      }
    }

    const categorySet = new Set<string>();
    const categoryData: { [key: string]: { [key: string]: number } } = {};

    formattedRows.forEach(row => {
      const category = String(row[categoryColumn] || 'Unknown');
      categorySet.add(category);

      if (!categoryData[category]) {
        categoryData[category] = {};
      }

      valueColumns.forEach(col => {
        const value = parseFloat(row[col]);
        if (!isNaN(value)) {
          categoryData[category][col] = (categoryData[category][col] || 0) + value;
        }
      });
    });

    const categories = Array.from(categorySet);
    const series = valueColumns.map(col => ({
      name: col,
      type: 'bar',
      stack: 'total',
      data: categories.map(cat => categoryData[cat]?.[col] || 0)
    }));

    const config = {
      title: { text: title || 'Stacked Bar Chart', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: valueColumns },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: series,
      _columnMetadata: {
        category: categoryColumn,
        values: valueColumns,
        chartType: 'stackedBar'
      }
    };

    onPreviewChange(config);
  }, [sheetData, categoryColumn, valueColumns, title]);

  if (!sheetData) {
    return <div className="text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Stacked Bar Chart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Column</label>
        <select
          value={categoryColumn}
          onChange={(e) => setCategoryColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value Columns (select 2+)
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
          {sheetData.headers.filter(h => h !== categoryColumn).map((header) => (
            <div key={header} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={valueColumns.includes(header)}
                onChange={() => toggleValueColumn(header)}
                className="rounded"
              />
              <label className="text-sm text-gray-700">{header}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Auto-aggregation:</strong> Duplicate categories are automatically summed
        </p>
      </div>
    </div>
  );
}
