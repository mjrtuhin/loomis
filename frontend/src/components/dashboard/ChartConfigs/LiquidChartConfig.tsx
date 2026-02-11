import { useState, useEffect } from 'react';

interface LiquidChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function LiquidChartConfig({ sheetData, onPreviewChange }: LiquidChartConfigProps) {
  const [valueColumn, setValueColumn] = useState('');
  const [aggregation, setAggregation] = useState<'sum' | 'average' | 'max' | 'min'>('sum');
  const [maxValue, setMaxValue] = useState('100');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !valueColumn) return;

    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (valueIndex === -1) return;

    const values = sheetData.rows.map(row => parseFloat(row[valueIndex]) || 0);
    
    let aggregatedValue: number;
    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'average':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      default:
        aggregatedValue = values[0] || 0;
    }

    const max = parseFloat(maxValue) || 100;
    const percentage = (aggregatedValue / max) * 100;

    const config = {
      title: { 
        text: title || 'Liquid Fill Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      series: [{
        type: 'liquidFill',
        data: [percentage / 100],
        radius: '70%',
        outline: {
          show: true,
          borderDistance: 8,
          itemStyle: {
            borderWidth: 4,
            borderColor: '#5470c6',
            shadowBlur: 20,
            shadowColor: 'rgba(84, 112, 198, 0.4)'
          }
        },
        label: {
          fontSize: 50,
          fontWeight: 'bold',
          formatter: function() {
            return `${percentage.toFixed(1)}%`;
          }
        },
        backgroundStyle: {
          color: '#e3f2fd'
        },
        itemStyle: {
          opacity: 0.95,
          shadowBlur: 50,
          shadowColor: 'rgba(0, 0, 0, 0.4)'
        },
        emphasis: {
          itemStyle: {
            opacity: 1
          }
        }
      }],
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicInOut'
    };

    onPreviewChange(config);
  }, [valueColumn, aggregation, maxValue, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">💧 Configure Liquid Fill Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Liquid Fill Chart"
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
            Aggregation Method
          </label>
          <select
            value={aggregation}
            onChange={(e) => setAggregation(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sum">Sum (Total)</option>
            <option value="average">Average (Mean)</option>
            <option value="max">Maximum</option>
            <option value="min">Minimum</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Value (for percentage)
          </label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Aggregates all values using selected method, then shows as percentage of max value. Perfect for KPIs!
          </p>
        </div>
      </div>
    </div>
  );
}
