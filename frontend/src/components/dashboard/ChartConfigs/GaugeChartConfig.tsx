import { useState, useEffect } from 'react';

interface GaugeChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GaugeChartConfig({ sheetData, onPreviewChange }: GaugeChartConfigProps) {
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');
  const [maxValue, setMaxValue] = useState(100);

  useEffect(() => {
    if (!sheetData || !valueColumn) return;

    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (valueIndex === -1) return;

    const value = parseFloat(sheetData.rows[0]?.[valueIndex]) || 0;

    const config = {
      title: { 
        text: title || `${valueColumn} Gauge`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      series: [{
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: maxValue,
        splitNumber: 10,
        itemStyle: {
          color: '#5470c6'
        },
        progress: {
          show: true,
          width: 30
        },
        pointer: {
          show: true,
          length: '70%',
          width: 8
        },
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.2, '#91cc75'],
              [0.8, '#5470c6'],
              [1, '#ee6666']
            ]
          }
        },
        axisTick: {
          distance: -32,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -40,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 14
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '35%'],
          fontSize: 40,
          fontWeight: 'bolder',
          formatter: '{value}',
          color: 'inherit'
        },
        data: [{
          value: value,
          name: valueColumn
        }]
      }],
      animation: true,
      animationDuration: 2000,
      animationEasing: 'elasticOut'
    };

    onPreviewChange(config);
  }, [valueColumn, title, maxValue, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">⏲️ Configure Gauge Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={valueColumn ? `${valueColumn} Gauge` : "My Gauge"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Column *
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Value
          </label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(parseInt(e.target.value) || 100)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Gauge shows the first row's value. Colors: Green (0-20%), Blue (20-80%), Red (80-100%)
          </p>
        </div>
      </div>
    </div>
  );
}
