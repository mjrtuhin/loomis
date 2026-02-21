import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface FunnelChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function FunnelChartConfig({ sheetData, onPreviewChange }: FunnelChartConfigProps) {
  const [labelColumn, setLabelColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
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

    const { categories, values } = aggregateData(formattedRows, labelColumn, valueColumn);

    const funnelData = categories.map((name, idx) => ({
      name,
      value: values[idx]
    })).sort((a, b) => b.value - a.value);

    const config = {
      title: { text: title || 'Funnel Chart', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'funnel',
        data: funnelData,
        label: { show: true, position: 'inside' },
        labelLine: { show: false }
      }],
      _columnMetadata: {
        label: labelColumn,
        value: valueColumn,
        chartType: 'funnel'
      }
    };

    onPreviewChange(config);
  }, [sheetData, labelColumn, valueColumn, title]);

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
          placeholder="Funnel Chart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stage Label Column</label>
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

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Auto-aggregation:</strong> Duplicate stages are automatically summed and sorted
        </p>
      </div>
    </div>
  );
}
