import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface GaugeChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GaugeChartConfig({ sheetData, onPreviewChange }: GaugeChartConfigProps) {
  const [labelColumn, setLabelColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [maxValue, setMaxValue] = useState('100');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !labelColumn || !valueColumn) {
      onPreviewChange(null);
      return;
    }

    const labelValidation = validateColumnExists(sheetData.headers, labelColumn);
    if (!labelValidation.isValid) {
      onPreviewChange({ error: labelValidation.error });
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
    const gaugeValue = parseFloat(firstRow[valueColumn]) || 0;
    const gaugeLabel = String(firstRow[labelColumn]) || 'Value';

    const config = {
      title: { text: title || 'Gauge Chart', left: 'center' },
      tooltip: { formatter: '{a} <br/>{b} : {c}%' },
      series: [{
        type: 'gauge',
        detail: { formatter: '{value}' },
        data: [{ value: gaugeValue, name: gaugeLabel }],
        max: parseFloat(maxValue) || 100,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        }
      }],
      _columnMetadata: {
        label: labelColumn,
        value: valueColumn,
        max: maxValue,
        chartType: 'gauge'
      }
    };

    onPreviewChange(config);
  }, [sheetData, labelColumn, valueColumn, maxValue, title]);

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
          placeholder="Gauge Chart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label Column</label>
        <select
          value={labelColumn}
          onChange={(e) => setLabelColumn(e.target.value)}
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
          💡 Displays the first row value as a gauge meter
        </p>
      </div>
    </div>
  );
}
