import { useState, useEffect } from 'react';
import { ChartRenderer } from '../ChartRenderer';

interface PieChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function PieChartConfig({ sheetData, onPreviewChange }: PieChartConfigProps) {
  const [labelColumn, setLabelColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !labelColumn || !valueColumn) return;

    const labelIndex = sheetData.headers.indexOf(labelColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (labelIndex === -1 || valueIndex === -1) return;

    const labels = sheetData.rows.map(row => row[labelIndex]);
    const values = sheetData.rows.map(row => parseFloat(row[valueIndex]) || 0);
    
    const pieData = labels.map((label, i) => ({ 
      name: label, 
      value: values[i] 
    }));

    const config = {
      title: { 
        text: title || `${labelColumn} Distribution`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: { 
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        selectedMode: true
      },
      series: [{
        name: valueColumn,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        label: {
          formatter: '{b}: {d}%'
        },
        labelLine: {
          show: true
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        }
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationType: 'expansion'
    };

    onPreviewChange(config);
  }, [labelColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🥧 Configure Pie Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labelColumn ? `${labelColumn} Distribution` : "My Pie Chart"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Labels (Categories) *
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
      </div>
    </div>
  );
}
