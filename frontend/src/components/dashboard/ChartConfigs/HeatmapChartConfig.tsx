import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface HeatmapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function HeatmapChartConfig({ sheetData, onPreviewChange }: HeatmapChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !valueColumn) {
      onPreviewChange(null);
      return;
    }

    const xValidation = validateColumnExists(sheetData.headers, xColumn);
    if (!xValidation.isValid) {
      onPreviewChange({ error: xValidation.error });
      return;
    }

    const yValidation = validateColumnExists(sheetData.headers, yColumn);
    if (!yValidation.isValid) {
      onPreviewChange({ error: yValidation.error });
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

    const xCategories = [...new Set(formattedRows.map(r => String(r[xColumn])))];
    const yCategories = [...new Set(formattedRows.map(r => String(r[yColumn])))];
    
    const heatmapData: any[] = [];
    formattedRows.forEach(row => {
      const xVal = String(row[xColumn]);
      const yVal = String(row[yColumn]);
      const value = parseFloat(row[valueColumn]);
      
      if (!isNaN(value)) {
        const xIndex = xCategories.indexOf(xVal);
        const yIndex = yCategories.indexOf(yVal);
        heatmapData.push([xIndex, yIndex, value]);
      }
    });

    const config = {
      title: { text: title || 'Heatmap', left: 'center' },
      tooltip: { position: 'top' },
      grid: { height: '50%', top: '10%' },
      xAxis: { type: 'category', data: xCategories },
      yAxis: { type: 'category', data: yCategories },
      visualMap: {
        min: 0,
        max: Math.max(...heatmapData.map(d => d[2])),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [{
        type: 'heatmap',
        data: heatmapData,
        label: { show: true }
      }],
      _columnMetadata: {
        x: xColumn,
        y: yColumn,
        value: valueColumn,
        chartType: 'heatmap'
      }
    };

    onPreviewChange(config);
  }, [sheetData, xColumn, yColumn, valueColumn, title]);

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
          placeholder="Heatmap"
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
          💡 Requires 3 columns: X category, Y category, and numeric value
        </p>
      </div>
    </div>
  );
}
