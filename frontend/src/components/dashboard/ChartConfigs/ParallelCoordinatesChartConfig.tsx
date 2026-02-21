import { useState, useEffect } from 'react';
import { validateNumericColumn } from '../../../utils/chartValidation';

interface ParallelCoordinatesChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function ParallelCoordinatesChartConfig({ sheetData, onPreviewChange }: ParallelCoordinatesChartConfigProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (!sheetData || selectedColumns.length < 2) {
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

    for (const col of selectedColumns) {
      const validation = validateNumericColumn(sheetData.headers, formattedRows, col);
      if (!validation.isValid) {
        onPreviewChange({ error: `${col}: ${validation.error}` });
        return;
      }
    }

    const parallelData = formattedRows.map(row =>
      selectedColumns.map(col => parseFloat(row[col]) || 0)
    );

    const config = {
      title: { text: title || 'Parallel Coordinates', left: 'center' },
      tooltip: {},
      parallelAxis: selectedColumns.map((col, idx) => ({
        dim: idx,
        name: col
      })),
      series: [{
        type: 'parallel',
        lineStyle: { width: 2 },
        data: parallelData
      }],
      _columnMetadata: {
        columns: selectedColumns,
        chartType: 'parallelCoordinates'
      }
    };

    onPreviewChange(config);
  }, [sheetData, selectedColumns, title]);

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
          placeholder="Parallel Coordinates"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numeric Columns (select 2+)
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
          {sheetData.headers.map((header) => (
            <div key={header} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes(header)}
                onChange={() => toggleColumn(header)}
                className="rounded"
              />
              <label className="text-sm text-gray-700">{header}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Visualize multivariate data across parallel axes
        </p>
      </div>
    </div>
  );
}
