import { useState, useEffect } from 'react';

interface SankeyChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function SankeyChartConfig({ sheetData, onPreviewChange }: SankeyChartConfigProps) {
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  const toggleSourceColumn = (column: string) => {
    setSourceColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (!sheetData || sourceColumns.length === 0 || !targetColumn || !valueColumn) return;

    const targetIndex = sheetData.headers.indexOf(targetColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (targetIndex === -1 || valueIndex === -1) return;

    // Get all source column indices
    const sourceIndices = sourceColumns
      .map(col => sheetData.headers.indexOf(col))
      .filter(idx => idx !== -1);
    
    if (sourceIndices.length === 0) return;

    // Collect all unique nodes and links
    const nodes = new Set<string>();
    const linksMap = new Map<string, number>();

    sheetData.rows.forEach(row => {
      const target = row[targetIndex];
      const value = parseFloat(row[valueIndex]) || 0;
      
      nodes.add(target);

      // Create links from each source column to target
      sourceIndices.forEach(sourceIdx => {
        const source = row[sourceIdx];
        nodes.add(source);
        
        const linkKey = `${source}→${target}`;
        linksMap.set(linkKey, (linksMap.get(linkKey) || 0) + value);
      });
    });

    const nodesData = Array.from(nodes).map(name => ({ name }));
    const linksData = Array.from(linksMap.entries()).map(([key, value]) => {
      const [source, target] = key.split('→');
      return { source, target, value };
    });

    const config = {
      title: { 
        text: title || 'Sankey Diagram', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>Flow: ${params.data.value}`;
          }
          return `${params.name}<br/>Total: ${params.value}`;
        }
      },
      series: [{
        type: 'sankey',
        data: nodesData,
        links: linksData,
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        },
        label: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: '#5470c6'
            }
          },
          {
            depth: 1,
            itemStyle: {
              color: '#91cc75'
            }
          },
          {
            depth: 2,
            itemStyle: {
              color: '#fac858'
            }
          }
        ],
        layout: 'none',
        layoutIterations: 32,
        nodeGap: 20,
        nodeWidth: 20
      }],
      animation: true,
      animationDuration: 1500
    };

    onPreviewChange(config);
  }, [sourceColumns, targetColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🔄 Configure Sankey Diagram</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sankey Diagram"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source Columns (Flow From) - Select Multiple *
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
            {sheetData?.headers.map((header) => (
              <label key={header} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={sourceColumns.includes(header)}
                  onChange={() => toggleSourceColumn(header)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{header}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {sourceColumns.length} source{sourceColumns.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Column (Flow To) *
          </label>
          <select
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flow Value Column *
          </label>
          <select
            value={valueColumn}
            onChange={(e) => setValueColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Select multiple sources! Each will flow to the target. Flow width = aggregated value. Perfect for multi-stage processes!
          </p>
        </div>
      </div>
    </div>
  );
}
