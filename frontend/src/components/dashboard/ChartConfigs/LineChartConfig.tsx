import { useState, useEffect } from 'react';
import { ChartRenderer } from '../ChartRenderer';

interface LineChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function LineChartConfig({ sheetData, onPreviewChange }: LineChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    if (xIndex === -1 || yIndex === -1) return;

    const xData = sheetData.rows.map(row => row[xIndex]);
    const yData = sheetData.rows.map(row => parseFloat(row[yIndex]) || 0);

    const config = {
      title: { 
        text: title || `${xColumn} vs ${yColumn}`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: { 
        trigger: 'axis'
      },
      legend: { 
        show: true,
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        name: yColumn
      },
      series: [{
        name: yColumn,
        type: 'line',
        data: yData,
        smooth: false,
        lineStyle: {
          width: 2,
          color: '#5470c6'
        },
        itemStyle: {
          color: '#5470c6'
        },
        symbol: 'circle',
        symbolSize: 6
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📈 Configure Line Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={xColumn && yColumn ? `${xColumn} vs ${yColumn}` : "My Line Chart"}
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
            Y-Axis *
          </label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
