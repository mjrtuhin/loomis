import { useState, useEffect } from 'react';

interface RadarChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function RadarChartConfig({ sheetData, onPreviewChange }: RadarChartConfigProps) {
  const [dimensionColumns, setDimensionColumns] = useState<string[]>([]);
  const [seriesColumn, setSeriesColumn] = useState('');
  const [title, setTitle] = useState('');

  const toggleDimensionColumn = (column: string) => {
    setDimensionColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (!sheetData || dimensionColumns.length === 0) return;

    // Build indicators (dimensions) with dynamic max values
    const indicators = dimensionColumns.map(dim => {
      const dimIndex = sheetData.headers.indexOf(dim);
      if (dimIndex === -1) return null;
      
      const values = sheetData.rows.map(row => parseFloat(row[dimIndex]) || 0);
      const maxVal = Math.max(...values);
      
      return {
        name: dim,
        max: Math.ceil(maxVal * 1.2) // 20% padding
      };
    }).filter(Boolean);

    // Build series data - one series per row
    const seriesData = sheetData.rows.map((row, rowIdx) => {
      const values = dimensionColumns.map(dim => {
        const dimIndex = sheetData.headers.indexOf(dim);
        return parseFloat(row[dimIndex]) || 0;
      });

      let seriesName = `Series ${rowIdx + 1}`;
      if (seriesColumn) {
        const seriesIndex = sheetData.headers.indexOf(seriesColumn);
        if (seriesIndex !== -1) {
          seriesName = row[seriesIndex];
        }
      }

      return {
        name: seriesName,
        value: values
      };
    });

    const config = {
      title: { 
        text: title || 'Interactive Radar Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: true,
        bottom: 0,
        type: 'scroll'
      },
      radar: {
        indicator: indicators,
        shape: 'polygon',
        splitNumber: 4,
        radius: '60%',
        name: {
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        splitLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(114,172,209,0.1)', 'rgba(114,172,209,0.05)']
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      series: [{
        type: 'radar',
        data: seriesData,
        emphasis: {
          lineStyle: {
            width: 4
          },
          areaStyle: {
            opacity: 0.7
          }
        },
        areaStyle: {
          opacity: 0.25
        },
        lineStyle: {
          width: 2
        },
        symbolSize: 6
      }],
      animation: true,
      animationDuration: 1500,
      animationEasing: 'elasticOut'
    };

    onPreviewChange(config);
  }, [dimensionColumns, seriesColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🕸️ Configure Interactive Radar Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Interactive Radar Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dimensions (Select Multiple Numeric Columns) *
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
            {sheetData?.headers.map((header) => (
              <label key={header} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={dimensionColumns.includes(header)}
                  onChange={() => toggleDimensionColumn(header)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{header}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {dimensionColumns.length} dimensions selected
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Series Name Column (Optional)
          </label>
          <select
            value={seriesColumn}
            onChange={(e) => setSeriesColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Auto (Row 1, Row 2, etc.)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Each row becomes a series. Select numeric columns as dimensions. Perfect for comparing multiple entities!
          </p>
        </div>
      </div>
    </div>
  );
}
