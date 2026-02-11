import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface ViolinPlotChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function ViolinPlotChartConfig({ sheetData, onPreviewChange }: ViolinPlotChartConfigProps) {
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
    const violinData = categories.map(cat => groupedData[cat]);

    const config = {
      title: { text: title || 'Violin Plot', left: 'center' },
      tooltip: { trigger: 'item' },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{
        type: 'custom',
        renderItem: (params: any, api: any) => {
          return {
            type: 'group',
            children: []
          };
        },
        data: violinData
      }],
      _columnMetadata: {
        category: categoryColumn,
        value: valueColumn,
        chartType: 'violin'
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
          placeholder="Violin Plot"
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
          💡 Shows probability density distribution for each category
        </p>
      </div>
    </div>
  );
}
