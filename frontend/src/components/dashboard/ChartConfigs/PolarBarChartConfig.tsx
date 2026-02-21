import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface PolarBarChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function PolarBarChartConfig({ sheetData, onPreviewChange }: PolarBarChartConfigProps) {
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

    const { categories, values } = aggregateData(formattedRows, categoryColumn, valueColumn);

    const polarData = categories.map((name, idx) => ({
      name,
      value: values[idx]
    }));

    const config = {
      title: { text: title || 'Polar Bar Chart', left: 'center' },
      tooltip: {},
      angleAxis: { type: 'category', data: categories },
      radiusAxis: {},
      polar: {},
      series: [{
        type: 'bar',
        data: values,
        coordinateSystem: 'polar',
        label: { show: false }
      }],
      _columnMetadata: {
        category: categoryColumn,
        value: valueColumn,
        chartType: 'polarBar'
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
          placeholder="Polar Bar Chart"
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
          💡 <strong>Auto-aggregation:</strong> Duplicate categories are automatically summed. Also known as Rose Chart.
        </p>
      </div>
    </div>
  );
}
