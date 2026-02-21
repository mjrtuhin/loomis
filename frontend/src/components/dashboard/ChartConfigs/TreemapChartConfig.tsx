import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface TreemapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function TreemapChartConfig({ sheetData, onPreviewChange }: TreemapChartConfigProps) {
  const [nameColumn, setNameColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !nameColumn || !valueColumn) {
      onPreviewChange(null);
      return;
    }

    const nameValidation = validateColumnExists(sheetData.headers, nameColumn);
    if (!nameValidation.isValid) {
      onPreviewChange({ error: nameValidation.error });
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

    const { categories, values } = aggregateData(formattedRows, nameColumn, valueColumn);

    const treemapData = categories.map((name, idx) => ({
      name,
      value: values[idx]
    }));

    const config = {
      title: { text: title || 'Treemap', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'treemap',
        data: treemapData,
        label: { show: true, formatter: '{b}' },
        breadcrumb: { show: false }
      }],
      _columnMetadata: {
        name: nameColumn,
        value: valueColumn,
        chartType: 'treemap'
      }
    };

    onPreviewChange(config);
  }, [sheetData, nameColumn, valueColumn, title]);

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
          placeholder="Treemap"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name Column</label>
        <select
          value={nameColumn}
          onChange={(e) => setNameColumn(e.target.value)}
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
          💡 <strong>Auto-aggregation:</strong> Duplicate names are automatically summed
        </p>
      </div>
    </div>
  );
}
