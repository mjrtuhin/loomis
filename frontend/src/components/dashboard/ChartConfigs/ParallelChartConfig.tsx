import { useState, useEffect } from 'react';

interface ParallelChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function ParallelChartConfig({ sheetData, onPreviewChange }: ParallelChartConfigProps) {
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

    // Build parallel dimensions
    const parallelAxis = selectedColumns.map((col, idx) => {
      const colIndex = sheetData.headers.indexOf(col);
      if (colIndex === -1) return null;

      const values = sheetData.rows.map(row => parseFloat(row[colIndex]) || 0);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);

      return {
        dim: idx,
        name: col,
        min: minVal,
        max: maxVal
      };
    }).filter(Boolean);

    // Build data rows
    const parallelData = sheetData.rows.map(row => {
      return selectedColumns.map(col => {
        const colIndex = sheetData.headers.indexOf(col);
        return parseFloat(row[colIndex]) || 0;
      });
    });

    const config = {
      title: { 
        text: title || 'Parallel Coordinates', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item'
      },
      parallelAxis: parallelAxis,
      parallel: {
        left: '5%',
        right: '13%',
        bottom: 100,
        parallelAxisDefault: {
          type: 'value',
          name: 'value',
          nameLocation: 'end',
          nameGap: 20,
          nameTextStyle: {
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#aaa'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#777'
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: '#999'
          }
        }
      },
      series: [{
        type: 'parallel',
        lineStyle: {
          width: 2,
          opacity: 0.5
        },
        emphasis: {
          lineStyle: {
            width: 5,
            opacity: 1,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        },
        progressive: 500,
        smooth: true,
        data: parallelData
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
        <h3 className="text-lg font-semibold text-gray-900">📊 Configure Parallel Coordinates</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Parallel Coordinates"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Dimensions (Multiple Numeric Columns) *
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
            {selectedColumns.length} dimensions selected
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Click on any line to highlight it! Perfect for comparing multi-dimensional data. Each row is a line connecting all dimensions.
          </p>
        </div>
      </div>
    </div>
  );
}
