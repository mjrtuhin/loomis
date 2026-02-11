import { useState, useEffect } from 'react';

interface AreaChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function AreaChartConfig({ sheetData, onPreviewChange }: AreaChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumns, setYColumns] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [stacked, setStacked] = useState(false);

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
        stack: stacked ? 'Total' : undefined,
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.7,
          color: colors[idx % colors.length]
        },
        emphasis: {
          focus: 'series'
        }
      };
    }).filter(Boolean);

    const config = {
      title: { 
        text: title || `${xColumn} Area Chart`, 
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
  }, [xColumn, yColumns, title, stacked, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Configure Area Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={xColumn ? `${xColumn} Area Chart` : "My Area Chart"}
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="stacked"
            checked={stacked}
            onChange={(e) => setStacked(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="stacked" className="text-sm font-medium text-gray-700 cursor-pointer">
            Stack areas
          </label>
        </div>
      </div>
    </div>
  );
}
