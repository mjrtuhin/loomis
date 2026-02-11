import { useState, useEffect } from 'react';

interface HeatmapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function HeatmapChartConfig({ sheetData, onPreviewChange }: HeatmapChartConfigProps) {
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
    if (!sheetData || selectedColumns.length === 0) return;

    // Get all selected column indices
    const columnIndices = selectedColumns
      .map(col => sheetData.headers.indexOf(col))
      .filter(idx => idx !== -1);

    if (columnIndices.length === 0) return;

    // Build heatmap data: [row_index, column_index, value]
    const heatmapData: number[][] = [];
    sheetData.rows.forEach((row, rowIdx) => {
      columnIndices.forEach((colIdx, selectedColIdx) => {
        const value = parseFloat(row[colIdx]) || 0;
        heatmapData.push([selectedColIdx, rowIdx, value]);
      });
    });

    const values = heatmapData.map(d => d[2]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    const config = {
      title: { 
        text: title || 'Interactive Heatmap', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const colName = selectedColumns[params.data[0]];
          const rowNum = params.data[1] + 1;
          const value = params.data[2];
          return `Row ${rowNum}, ${colName}: ${value}`;
        }
      },
      grid: {
        height: '60%',
        top: '15%',
        left: '10%',
        right: '10%'
      },
      xAxis: {
        type: 'category',
        data: selectedColumns,
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'category',
        data: sheetData.rows.map((_, idx) => `Row ${idx + 1}`),
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '2%',
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', 
                  '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: 'Heatmap',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          fontSize: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 3,
            borderColor: '#333'
          }
        }
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [selectedColumns, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🔥 Configure Interactive Heatmap</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Interactive Heatmap"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Columns to Display (Multiple) *
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
            {sheetData?.headers.map((header) => (
              <label key={header} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(header)}
                  onChange={() => toggleColumn(header)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{header}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {selectedColumns.length} columns selected
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Select multiple numeric columns. Each cell shows the value with color intensity. Hover to see details!
          </p>
        </div>
      </div>
    </div>
  );
}
