import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface BoxPlotChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function BoxPlotChartConfig({ sheetData, onPreviewChange }: BoxPlotChartConfigProps) {
  const [categoryColumn, setCategoryColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !categoryColumn || !valueColumn) {
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

    const valueValidation = validateNumericColumn(sheetData.headers, formattedRows, valueColumn);
    if (!valueValidation.isValid) {
      onPreviewChange({ error: valueValidation.error });
      return;
    }

    const groupedData: { [key: string]: number[] } = {};
    
    formattedRows.forEach(row => {
      const category = String(row[categoryColumn] || 'Unknown');
      const value = parseFloat(row[valueColumn]);
      
      if (!isNaN(value)) {
        if (!groupedData[category]) {
          groupedData[category] = [];
        }
        groupedData[category].push(value);
      }
    });

    const categories = Object.keys(groupedData);
    const boxData = categories.map(cat => {
      const values = groupedData[cat].sort((a, b) => a - b);
      const min = values[0];
      const max = values[values.length - 1];
      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];
      return [min, q1, median, q3, max];
    });

    const config = {
      title: { text: title || 'Box Plot', left: 'center' },
      tooltip: { trigger: 'item', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{
        type: 'boxplot',
        data: boxData
      }],
      _columnMetadata: {
        category: categoryColumn,
        value: valueColumn,
        chartType: 'boxplot'
      }
    };

    onPreviewChange(config);
  }, [sheetData, categoryColumn, valueColumn, title]);

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
          placeholder="Box Plot"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Value Column</label>
        <select
          value={valueColumn}
          onChange={(e) => setValueColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Shows distribution: min, Q1, median, Q3, max for each category
        </p>
      </div>
    </div>
  );
}
