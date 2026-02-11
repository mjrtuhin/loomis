import { useState, useEffect } from 'react';

interface PolarBarChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function PolarBarChartConfig({ sheetData, onPreviewChange }: PolarBarChartConfigProps) {
  const [categoryColumn, setCategoryColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [chartStyle, setChartStyle] = useState<'rose' | 'bar'>('rose');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !categoryColumn || !valueColumn) return;

    const categoryIndex = sheetData.headers.indexOf(categoryColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (categoryIndex === -1 || valueIndex === -1) return;

    const data = sheetData.rows.map(row => ({
      name: row[categoryIndex],
      value: parseFloat(row[valueIndex]) || 0
    }));

    const config = {
      title: { 
        text: title || (chartStyle === 'rose' ? 'Rose Chart' : 'Polar Bar Chart'), 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: 0,
        type: 'scroll'
      },
      polar: chartStyle === 'bar' ? {
        radius: [30, '80%']
      } : undefined,
      angleAxis: chartStyle === 'bar' ? {
        type: 'category',
        data: data.map(d => d.name),
        startAngle: 90
      } : undefined,
      radiusAxis: chartStyle === 'bar' ? {
        type: 'value'
      } : undefined,
      series: [{
        type: chartStyle === 'rose' ? 'pie' : 'bar',
        data: data,
        ...(chartStyle === 'rose' ? {
          roseType: 'area',
          radius: ['15%', '70%'],
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 8
          }
        } : {
          coordinateSystem: 'polar',
          roundCap: true,
          barWidth: 20
        }),
        label: {
          show: true,
          position: chartStyle === 'rose' ? 'outside' : 'middle',
          formatter: chartStyle === 'rose' ? '{b}: {d}%' : '{b}'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }],
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [categoryColumn, valueColumn, chartStyle, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🌹 Configure Polar Bar/Rose Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Rose Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Style
          </label>
          <select
            value={chartStyle}
            onChange={(e) => setChartStyle(e.target.value as 'rose' | 'bar')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="rose">Rose (Nightingale)</option>
            <option value="bar">Polar Bar (Radial)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Column *
          </label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Florence Nightingale's famous chart style! Circular visualization where radius = value. Beautiful for categorical comparisons!
          </p>
        </div>
      </div>
    </div>
  );
}
