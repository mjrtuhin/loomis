import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface EffectScatterChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function EffectScatterChartConfig({ sheetData, onPreviewChange }: EffectScatterChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [sizeColumn, setSizeColumn] = useState('');
  const [title, setTitle] = useState('');

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

    if (sizeColumn) {
      const sizeValidation = validateNumericColumn(sheetData.headers, formattedRows, sizeColumn);
      if (!sizeValidation.isValid) {
        onPreviewChange({ error: `Size: ${sizeValidation.error}` });
        return;
      }
    }

    const scatterData = formattedRows.map(row => {
      const x = String(row[xColumn]);
      const y = parseFloat(row[yColumn]);
      const size = sizeColumn ? parseFloat(row[sizeColumn]) : 10;
      return [x, y, size];
    });

    const config = {
      title: { text: title || 'Effect Scatter Chart', left: 'center' },
      tooltip: { trigger: 'item' },
      xAxis: { type: 'category' },
      yAxis: { type: 'value' },
      series: [{
        type: 'effectScatter',
        data: scatterData,
        symbolSize: (val: any) => val[2] || 10,
        rippleEffect: { scale: 3, brushType: 'stroke' }
      }],
      _columnMetadata: {
        x: xColumn,
        y: yColumn,
        size: sizeColumn || null,
        chartType: 'effectScatter'
      }
    };

    onPreviewChange(config);
  }, [sheetData, xColumn, yColumn, sizeColumn, title]);

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
          placeholder="Effect Scatter Chart"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Size Column (optional)</label>
        <select
          value={sizeColumn}
          onChange={(e) => setSizeColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">None</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Scatter plot with ripple animation effect
        </p>
      </div>
    </div>
  );
}
