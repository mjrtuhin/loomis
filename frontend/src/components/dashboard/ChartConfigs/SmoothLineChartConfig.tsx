import { useState, useEffect } from 'react';

interface SmoothLineChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function SmoothLineChartConfig({ sheetData, onPreviewChange }: SmoothLineChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumns, setYColumns] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const toggleYColumn = (column: string) => {
    setYColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (!sheetData || !xColumn || yColumns.length === 0) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    if (xIndex === -1) return;

    const xData = sheetData.rows.map(row => row[xIndex]);
    
    const seriesData = yColumns.map((yCol, idx) => {
      const yIndex = sheetData.headers.indexOf(yCol);
      if (yIndex === -1) return null;
      
      const yData = sheetData.rows.map(row => parseFloat(row[yIndex]) || 0);
      
      const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'];
      
      return {
        name: yCol,
        type: 'line',
        data: yData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: colors[idx % colors.length]
        },
        itemStyle: {
          color: colors[idx % colors.length]
        },
        symbol: 'circle',
        symbolSize: 8,
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        }
      };
    }).filter(Boolean);

    const config = {
      title: { 
        text: title || `${xColumn} Trends`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: { 
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: { 
        show: true,
        top: 30,
        selectedMode: 'multiple'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: seriesData,
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicInOut'
    };

    onPreviewChange(config);
  }, [xColumn, yColumns, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📈 Configure Smooth Line Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={xColumn ? `${xColumn} Trends` : "My Smooth Line Chart"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X-Axis *
          </label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
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
            Y-Axis Series (Select Multiple) *
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
            {sheetData?.headers.map((header) => (
              <label key={header} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={yColumns.includes(header)}
                  onChange={() => toggleYColumn(header)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{header}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {yColumns.length} series selected
          </p>
        </div>
      </div>
    </div>
  );
}
