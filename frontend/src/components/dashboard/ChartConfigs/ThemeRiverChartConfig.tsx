import { useState, useEffect } from 'react';
import { validateDateColumn, validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface ThemeRiverChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function ThemeRiverChartConfig({ sheetData, onPreviewChange }: ThemeRiverChartConfigProps) {
  const [timeColumn, setTimeColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    if (!sheetData || !timeColumn || !categoryColumn || !valueColumn) return;

    // Validation
    const timeValidation = validateColumnExists(sheetData.headers, timeColumn);
    if (!timeValidation.isValid) {
      setError(timeValidation.error!);
      return;
    }

    const timeIndex = sheetData.headers.indexOf(timeColumn);
    const dateValidation = validateDateColumn(sheetData.rows, timeIndex, timeColumn);
    if (!dateValidation.isValid) {
      setError(dateValidation.error!);
      return;
    }

    const valueIndex = sheetData.headers.indexOf(valueColumn);
    const valueValidation = validateNumericColumn(sheetData.rows, valueIndex, valueColumn);
    if (!valueValidation.isValid) {
      setError(valueValidation.error!);
      return;
    }

    const categoryIndex = sheetData.headers.indexOf(categoryColumn);
    
    // Group data by category
    const categories = [...new Set(sheetData.rows.map(row => row[categoryIndex]))];
    const timePoints = [...new Set(sheetData.rows.map(row => row[timeIndex]))].sort();

    const seriesData = categories.map(category => {
      const data = timePoints.map(time => {
        const matchingRow = sheetData.rows.find(
          row => row[categoryIndex] === category && row[timeIndex] === time
        );
        return matchingRow ? parseFloat(matchingRow[valueIndex]) || 0 : 0;
      });
      
      return {
        name: category,
        type: 'themeRiver',
        data: data.map((value, idx) => [timePoints[idx], value, category])
      };
    });

    const config = {
      title: { 
        text: title || 'ThemeRiver Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: 'rgba(0,0,0,0.2)', width: 1, type: 'solid' } }
      },
      legend: {
        data: categories,
        bottom: 0,
        type: 'scroll'
      },
      singleAxis: {
        top: 50,
        bottom: 80,
        type: 'time',
        axisPointer: {
          animation: true,
          label: { show: true }
        }
      },
      series: seriesData,
      animation: true,
      animationDuration: 2000
    };

    onPreviewChange(config);
  }, [timeColumn, categoryColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🌊 Configure ThemeRiver Chart</h3>
        
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
            placeholder="ThemeRiver Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Column (Date) *</label>
          <select
            value={timeColumn}
            onChange={(e) => setTimeColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Column *</label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value Column *</label>
          <select
            value={valueColumn}
            onChange={(e) => setValueColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">💡 Time must be valid dates (YYYY-MM-DD). Values must be numeric!</p>
        </div>
      </div>
    </div>
  );
}
