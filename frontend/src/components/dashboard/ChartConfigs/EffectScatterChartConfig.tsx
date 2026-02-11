import { useState, useEffect } from 'react';

interface EffectScatterChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function EffectScatterChartConfig({ sheetData, onPreviewChange }: EffectScatterChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    if (xIndex === -1 || yIndex === -1) return;

    const data = sheetData.rows.map(row => [
      parseFloat(row[xIndex]) || 0,
      parseFloat(row[yIndex]) || 0
    ]);

    const config = {
      title: { 
        text: title || `${xColumn} vs ${yColumn}`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${xColumn}: ${params.value[0]}<br/>${yColumn}: ${params.value[1]}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: xColumn,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: yColumn,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [{
        type: 'effectScatter',
        data: data,
        symbolSize: 15,
        itemStyle: {
          color: '#ee6666'
        },
        emphasis: {
          scale: true,
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(255,0,0,0.5)'
          }
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4
        }
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
        <h3 className="text-lg font-semibold text-gray-900">✨ Configure Effect Scatter (Blinking Dots)</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={xColumn && yColumn ? `${xColumn} vs ${yColumn}` : "My Effect Scatter"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X-Axis (Numeric) *
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
            Y-Axis (Numeric) *
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
