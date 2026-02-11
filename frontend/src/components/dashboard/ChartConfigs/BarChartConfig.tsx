import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface BarChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function BarChartConfig({ sheetData, onPreviewChange }: BarChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    
    if (!sheetData || !xColumn || !yColumn) return;

    // Validation
    const xValidation = validateColumnExists(sheetData.headers, xColumn);
    if (!xValidation.isValid) {
      setError(xValidation.error!);
      return;
    }

    const yIndex = sheetData.headers.indexOf(yColumn);
    const yValidation = validateNumericColumn(sheetData.rows, yIndex, yColumn);
    if (!yValidation.isValid) {
      setError(yValidation.error!);
      return;
    }

    const xIndex = sheetData.headers.indexOf(xColumn);
    const xData = sheetData.rows.map(row => row[xIndex]);
    const yData = sheetData.rows.map(row => parseFloat(row[yIndex]) || 0);

    const config = {
      title: { text: title || 'Bar Chart', left: 'center', textStyle: { fontSize: 18 } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'category', data: xData, axisLabel: { rotate: 45 } },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: yData,
        itemStyle: { color: '#5470c6' },
        emphasis: { itemStyle: { color: '#3ba272' } }
      }],
      animation: true,
      animationDuration: 1000
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Configure Bar Chart</h3>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bar Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis (Categories) *</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis (Values) *</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">💡 Y-axis must be numeric values!</p>
        </div>
      </div>
    </div>
  );
}
