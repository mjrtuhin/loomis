import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface CandlestickChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function CandlestickChartConfig({ sheetData, onPreviewChange }: CandlestickChartConfigProps) {
  const [dateColumn, setDateColumn] = useState('');
  const [openColumn, setOpenColumn] = useState('');
  const [closeColumn, setCloseColumn] = useState('');
  const [lowColumn, setLowColumn] = useState('');
  const [highColumn, setHighColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !dateColumn || !openColumn || !closeColumn || !lowColumn || !highColumn) {
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

    const columns = [openColumn, closeColumn, lowColumn, highColumn];
    for (const col of columns) {
      const validation = validateNumericColumn(sheetData.headers, formattedRows, col);
      if (!validation.isValid) {
        onPreviewChange({ error: `${col}: ${validation.error}` });
        return;
      }
    }

    const dates = formattedRows.map(r => String(r[dateColumn]));
    const candleData = formattedRows.map(r => [
      parseFloat(r[openColumn]),
      parseFloat(r[closeColumn]),
      parseFloat(r[lowColumn]),
      parseFloat(r[highColumn])
    ]);

    const config = {
      title: { text: title || 'Candlestick Chart', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      xAxis: { type: 'category', data: dates },
      yAxis: { type: 'value' },
      series: [{
        type: 'candlestick',
        data: candleData
      }],
      _columnMetadata: {
        date: dateColumn,
        open: openColumn,
        close: closeColumn,
        low: lowColumn,
        high: highColumn,
        chartType: 'candlestick'
      }
    };

    onPreviewChange(config);
  }, [sheetData, dateColumn, openColumn, closeColumn, lowColumn, highColumn, title]);

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
          placeholder="Candlestick Chart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Column</label>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Open</label>
          <select
            value={openColumn}
            onChange={(e) => setOpenColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            {sheetData.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Close</label>
          <select
            value={closeColumn}
            onChange={(e) => setCloseColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            {sheetData.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Low</label>
          <select
            value={lowColumn}
            onChange={(e) => setLowColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            {sheetData.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">High</label>
          <select
            value={highColumn}
            onChange={(e) => setHighColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            {sheetData.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Requires: Date, Open, Close, Low, High columns (OHLC data)
        </p>
      </div>
    </div>
  );
}
