import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface BubbleScatterChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function BubbleScatterChartConfig({ sheetData, onPreviewChange }: BubbleScatterChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [sizeColumn, setSizeColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !sizeColumn) {
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

    const sizeValidation = validateNumericColumn(sheetData.headers, formattedRows, sizeColumn);
    if (!sizeValidation.isValid) {
      onPreviewChange({ error: `Size: ${sizeValidation.error}` });
      return;
    }

    if (categoryColumn) {
      const categoryValidation = validateColumnExists(sheetData.headers, categoryColumn);
      if (!categoryValidation.isValid) {
        onPreviewChange({ error: categoryValidation.error });
        return;
      }
    }

    const bubbleData = formattedRows.map(row => [
      parseFloat(row[xColumn]),
      parseFloat(row[yColumn]),
      parseFloat(row[sizeColumn]),
      categoryColumn ? String(row[categoryColumn]) : 'Data'
    ]);

    const config = {
      title: { text: title || 'Bubble Scatter Chart', left: 'center' },
      tooltip: { trigger: 'item' },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [{
        type: 'scatter',
        data: bubbleData,
        symbolSize: (val: any) => Math.sqrt(val[2]) * 5
      }],
      _columnMetadata: {
        x: xColumn,
        y: yColumn,
        size: sizeColumn,
        category: categoryColumn || null,
        chartType: 'bubbleScatter'
      }
    };

    onPreviewChange(config);
  }, [sheetData, xColumn, yColumn, sizeColumn, categoryColumn, title]);

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
          placeholder="Bubble Scatter Chart"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Bubble Size Column</label>
        <select
          value={sizeColumn}
          onChange={(e) => setSizeColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Column (optional)</label>
        <select
          value={categoryColumn}
          onChange={(e) => setCategoryColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">None</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Requires 3 numeric columns: X, Y, and bubble size
        </p>
      </div>
    </div>
  );
}
