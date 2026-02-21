import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface SankeyChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function SankeyChartConfig({ sheetData, onPreviewChange }: SankeyChartConfigProps) {
  const [sourceColumn, setSourceColumn] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !sourceColumn || !targetColumn || !valueColumn) {
      onPreviewChange(null);
      return;
    }

    const sourceValidation = validateColumnExists(sheetData.headers, sourceColumn);
    if (!sourceValidation.isValid) {
      onPreviewChange({ error: sourceValidation.error });
      return;
    }

    const targetValidation = validateColumnExists(sheetData.headers, targetColumn);
    if (!targetValidation.isValid) {
      onPreviewChange({ error: targetValidation.error });
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

    const nodes = new Set<string>();
    const links: any[] = [];

    formattedRows.forEach(row => {
      const source = String(row[sourceColumn]);
      const target = String(row[targetColumn]);
      const value = parseFloat(row[valueColumn]);

      if (source && target && !isNaN(value)) {
        nodes.add(source);
        nodes.add(target);
        links.push({ source, target, value });
      }
    });

    const nodesArray = Array.from(nodes).map(name => ({ name }));

    const config = {
      title: { text: title || 'Sankey Diagram', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'sankey',
        data: nodesArray,
        links: links,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5 }
      }],
      _columnMetadata: {
        source: sourceColumn,
        target: targetColumn,
        value: valueColumn,
        chartType: 'sankey'
      }
    };

    onPreviewChange(config);
  }, [sheetData, sourceColumn, targetColumn, valueColumn, title]);

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
          placeholder="Sankey Diagram"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Source Column</label>
        <select
          value={sourceColumn}
          onChange={(e) => setSourceColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Column</label>
        <select
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Flow Value Column</label>
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
          💡 Shows flow between nodes: Source → Target with Value
        </p>
      </div>
    </div>
  );
}
