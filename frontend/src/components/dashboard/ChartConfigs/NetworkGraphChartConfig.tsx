import { useState, useEffect } from 'react';
import { validateColumnExists } from '../../../utils/chartValidation';

interface NetworkGraphChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function NetworkGraphChartConfig({ sheetData, onPreviewChange }: NetworkGraphChartConfigProps) {
  const [sourceColumn, setSourceColumn] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !sourceColumn || !targetColumn) {
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

    const nodes = new Set<string>();
    const links: any[] = [];

    formattedRows.forEach(row => {
      const source = String(row[sourceColumn]);
      const target = String(row[targetColumn]);

      if (source && target) {
        nodes.add(source);
        nodes.add(target);
        links.push({ source, target });
      }
    });

    const nodesArray = Array.from(nodes).map(name => ({ name, symbolSize: 30 }));

    const config = {
      title: { text: title || 'Network Graph', left: 'center' },
      tooltip: {},
      series: [{
        type: 'graph',
        layout: 'force',
        data: nodesArray,
        links: links,
        roam: true,
        label: { show: true, position: 'right' },
        force: {
          repulsion: 100,
          edgeLength: 150
        }
      }],
      _columnMetadata: {
        source: sourceColumn,
        target: targetColumn,
        chartType: 'networkGraph'
      }
    };

    onPreviewChange(config);
  }, [sheetData, sourceColumn, targetColumn, title]);

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
          placeholder="Network Graph"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Source Node Column</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Node Column</label>
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

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Shows relationships between nodes with force-directed layout
        </p>
      </div>
    </div>
  );
}
