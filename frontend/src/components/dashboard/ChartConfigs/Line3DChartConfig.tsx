import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface Line3DChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function Line3DChartConfig({ sheetData, onPreviewChange }: Line3DChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [zColumn, setZColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !zColumn) {
      onPreviewChange(null);
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    const xValidation = validateNumericColumn(sheetData.headers, formattedRows, xColumn);
    if (!xValidation.isValid) {
      onPreviewChange({ error: `X: ${xValidation.error}` });
      return;
    }

    const yValidation = validateNumericColumn(sheetData.headers, formattedRows, yColumn);
    if (!yValidation.isValid) {
      onPreviewChange({ error: `Y: ${yValidation.error}` });
      return;
    }

    const zValidation = validateNumericColumn(sheetData.headers, formattedRows, zColumn);
    if (!zValidation.isValid) {
      onPreviewChange({ error: `Z: ${zValidation.error}` });
      return;
    }

    const lineData = formattedRows.map(row => [
      parseFloat(row[xColumn]),
      parseFloat(row[yColumn]),
      parseFloat(row[zColumn])
    ]);

    const config = {
      title: { text: title || '3D Line Chart', left: 'center' },
      tooltip: {},
      xAxis3D: { type: 'value' },
      yAxis3D: { type: 'value' },
      zAxis3D: { type: 'value' },
      grid3D: {
        viewControl: {
          projection: 'perspective'
        }
      },
      series: [{
        type: 'line3D',
        data: lineData,
        lineStyle: { width: 4 }
      }],
      _columnMetadata: {
        x: xColumn,
        y: yColumn,
        z: zColumn,
        chartType: 'line3D'
      }
    };

    onPreviewChange(config);
  }, [sheetData, xColumn, yColumn, zColumn, title]);

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
          placeholder="3D Line Chart"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Z-axis Column</label>
        <select
          value={zColumn}
          onChange={(e) => setZColumn(e.target.value)}
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
          💡 3D line visualization with X, Y, Z coordinates
        </p>
      </div>
    </div>
  );
}
