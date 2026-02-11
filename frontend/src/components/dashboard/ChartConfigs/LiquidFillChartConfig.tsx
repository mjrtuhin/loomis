import { useState, useEffect } from 'react';
import { validateNumericColumn } from '../../../utils/chartValidation';

interface LiquidFillChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function LiquidFillChartConfig({ sheetData, onPreviewChange }: LiquidFillChartConfigProps) {
  const [valueColumn, setValueColumn] = useState('');
  const [maxValue, setMaxValue] = useState('100');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !valueColumn) {
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

    const valueValidation = validateNumericColumn(sheetData.headers, formattedRows, valueColumn);
    if (!valueValidation.isValid) {
      onPreviewChange({ error: valueValidation.error });
      return;
    }

    const firstRow = formattedRows[0];
    const liquidValue = parseFloat(firstRow[valueColumn]) || 0;
    const max = parseFloat(maxValue) || 100;
    const percentage = (liquidValue / max);

    const config = {
      title: { text: title || 'Liquid Fill Chart', left: 'center' },
      series: [{
        type: 'liquidFill',
        data: [percentage],
        outline: { show: true },
        label: {
          formatter: `{c}%`,
          fontSize: 30
        }
      }],
      _columnMetadata: {
        value: valueColumn,
        max: maxValue,
        chartType: 'liquidFill'
      }
    };

    onPreviewChange(config);
  }, [sheetData, valueColumn, maxValue, title]);

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
          placeholder="Liquid Fill Chart"
        />
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Value</label>
        <input
          type="number"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="100"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Displays percentage as animated liquid fill
        </p>
      </div>
    </div>
  );
}
