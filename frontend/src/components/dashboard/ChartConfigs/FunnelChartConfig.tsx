import { useState, useEffect } from 'react';

interface FunnelChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function FunnelChartConfig({ sheetData, onPreviewChange }: FunnelChartConfigProps) {
  const [labelColumn, setLabelColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !labelColumn || !valueColumn) return;

    const labelIndex = sheetData.headers.indexOf(labelColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (labelIndex === -1 || valueIndex === -1) return;

    const funnelData = sheetData.rows.map(row => ({
      name: row[labelIndex],
      value: parseFloat(row[valueIndex]) || 0
    })).sort((a, b) => b.value - a.value);

    const config = {
      title: { 
        text: title || `${labelColumn} Funnel`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: { 
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}'
      },
      legend: {
        show: true,
        top: 'bottom'
      },
      series: [{
        name: valueColumn,
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: Math.max(...funnelData.map(d => d.value)),
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 16,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        },
        data: funnelData
      }],
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicInOut'
    };

    onPreviewChange(config);
  }, [labelColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🔻 Configure Funnel Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labelColumn ? `${labelColumn} Funnel` : "My Funnel Chart"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stage Labels *
          </label>
          <select
            value={labelColumn}
            onChange={(e) => setLabelColumn(e.target.value)}
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
            Values (Numbers) *
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
            💡 Funnel stages are automatically sorted by value (largest to smallest)
          </p>
        </div>
      </div>
    </div>
  );
}
