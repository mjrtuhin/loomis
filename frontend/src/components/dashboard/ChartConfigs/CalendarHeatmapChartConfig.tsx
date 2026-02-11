import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface CalendarHeatmapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function CalendarHeatmapChartConfig({ sheetData, onPreviewChange }: CalendarHeatmapChartConfigProps) {
  const [dateColumn, setDateColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !dateColumn || !valueColumn) {
      onPreviewChange(null);
      return;
    }

    const dateValidation = validateColumnExists(sheetData.headers, dateColumn);
    if (!dateValidation.isValid) {
      onPreviewChange({ error: dateValidation.error });
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

    const calendarData = formattedRows.map(row => [
      String(row[dateColumn]),
      parseFloat(row[valueColumn])
    ]);

    const config = {
      title: { text: title || 'Calendar Heatmap', left: 'center' },
      tooltip: { position: 'top' },
      visualMap: {
        min: 0,
        max: Math.max(...calendarData.map(d => d[1])),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 'top'
      },
      calendar: {
        range: year,
        cellSize: ['auto', 13]
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: calendarData
      }],
      _columnMetadata: {
        date: dateColumn,
        value: valueColumn,
        year: year,
        chartType: 'calendarHeatmap'
      }
    };

    onPreviewChange(config);
  }, [sheetData, dateColumn, valueColumn, year, title]);

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
          placeholder="Calendar Heatmap"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Column (YYYY-MM-DD format)</label>
        <select
          value={dateColumn}
          onChange={(e) => setDateColumn(e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="2024"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Visualizes daily data across a calendar year
        </p>
      </div>
    </div>
  );
}
