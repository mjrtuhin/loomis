import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface LineChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function LineChartConfig({ sheetData, onPreviewChange }: LineChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [title, setTitle] = useState('');
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn) {
      onPreviewChange(null);
      return;
    }

    const xValidation = validateColumnExists(sheetData.headers, xColumn);
    if (!xValidation.isValid) {
      onPreviewChange({ error: xValidation.error });
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    const yValidation = validateNumericColumn(sheetData.headers, formattedRows, yColumn);
    if (!yValidation.isValid) {
      onPreviewChange({ error: yValidation.error });
      return;
    }

    const { categories, values } = aggregateData(formattedRows, xColumn, yColumn);

    const config = {
      title: { text: title || 'Line Chart', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        data: values,
        smooth: smooth,
        lineStyle: { color: '#5470c6' },
        itemStyle: { color: '#5470c6' }
      }],
      _columnMetadata: {
        x: xColumn,
        y: yColumn,
        chartType: 'line',
        smooth: smooth
      }
    };

    onPreviewChange(config);
  }, [sheetData, xColumn, yColumn, title, smooth]);

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
          placeholder="Line Chart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">X-axis Column</label>
        <select
          value={xColumn}
          onChange={(e) => setXColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Y-axis Column</label>
        <select
          value={yColumn}
          onChange={(e) => setYColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={smooth}
          onChange={(e) => setSmooth(e.target.checked)}
          className="rounded"
        />
        <label className="text-sm text-gray-700">Smooth curve</label>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Auto-aggregation:</strong> Duplicate X values are automatically summed
        </p>
      </div>
    </div>
  );
}
