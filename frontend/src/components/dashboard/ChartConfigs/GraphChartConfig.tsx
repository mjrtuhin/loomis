import { useState, useEffect } from 'react';

interface GraphChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GraphChartConfig({ sheetData, onPreviewChange }: GraphChartConfigProps) {
  const [sourceColumn, setSourceColumn] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !sourceColumn || !targetColumn) return;

    const sourceIndex = sheetData.headers.indexOf(sourceColumn);
    const targetIndex = sheetData.headers.indexOf(targetColumn);
    if (sourceIndex === -1 || targetIndex === -1) return;

    let valueIndex = -1;
    if (valueColumn) {
      valueIndex = sheetData.headers.indexOf(valueColumn);
    }

    // Build nodes and links
    const nodeSet = new Set<string>();
    const links: any[] = [];

    sheetData.rows.forEach(row => {
      const source = row[sourceIndex];
      const target = row[targetIndex];
      const value = valueIndex !== -1 ? (parseFloat(row[valueIndex]) || 1) : 1;

      nodeSet.add(source);
      nodeSet.add(target);

      links.push({
        source: source,
        target: target,
        value: value
      });
    });

    const nodes = Array.from(nodeSet).map(name => ({
      name: name,
      symbolSize: 30,
      draggable: true
    }));

    const config = {
      title: { 
        text: title || 'Network Graph', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>Value: ${params.data.value}`;
          } else {
            return params.data.name;
          }
        }
      },
      legend: {
        show: false
      },
      series: [{
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        roam: true,
        draggable: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        labelLayout: {
          hideOverlap: true
        },
        scaleLimit: {
          min: 0.4,
          max: 2
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
          opacity: 0.6
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5,
            opacity: 1
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        },
        force: {
          repulsion: 200,
          gravity: 0.1,
          edgeLength: 150,
          layoutAnimation: true
        }
      }],
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [sourceColumn, targetColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🕸️ Configure Network Graph</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Network Graph"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source Node Column *
          </label>
          <select
            value={sourceColumn}
            onChange={(e) => setSourceColumn(e.target.value)}
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
            Target Node Column *
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
            Link Value/Weight (Optional)
          </label>
          <select
            value={valueColumn}
            onChange={(e) => setValueColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (all equal)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Drag nodes to rearrange! Click nodes to highlight connections. Force-directed layout animates automatically. Perfect for relationship data!
          </p>
        </div>
      </div>
    </div>
  );
}
