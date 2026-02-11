import { useState, useEffect } from 'react';

interface ViolinPlotChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function ViolinPlotChartConfig({ sheetData, onPreviewChange }: ViolinPlotChartConfigProps) {
  const [categoryColumn, setCategoryColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !categoryColumn || !valueColumn) return;

    const categoryIndex = sheetData.headers.indexOf(categoryColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (categoryIndex === -1 || valueIndex === -1) return;

    // Group values by category
    const grouped: { [key: string]: number[] } = {};
    sheetData.rows.forEach(row => {
      const category = row[categoryIndex];
      const value = parseFloat(row[valueIndex]);
      if (!isNaN(value)) {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(value);
      }
    });

    const categories = Object.keys(grouped);
    const boxData = categories.map(cat => {
      const values = grouped[cat].sort((a, b) => a - b);
      const q1Index = Math.floor(values.length * 0.25);
      const q2Index = Math.floor(values.length * 0.50);
      const q3Index = Math.floor(values.length * 0.75);
      
      return [
        Math.min(...values),
        values[q1Index],
        values[q2Index],
        values[q3Index],
        Math.max(...values)
      ];
    });

    const config = {
      title: { 
        text: title || 'Violin Plot', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: valueColumn,
        splitArea: {
          show: true
        }
      },
      series: [{
        name: 'boxplot',
        type: 'boxplot',
        data: boxData,
        itemStyle: {
          color: '#b8d3ff',
          borderColor: '#5470c6'
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        }
      }],
      animation: true,
      animationDuration: 1000
    };

    onPreviewChange(config);
  }, [categoryColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🎻 Configure Violin Plot</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Violin Plot"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
            💡 Shows distribution shape! Box shows quartiles, whiskers show range. Perfect for comparing distributions across categories!
          </p>
        </div>
      </div>
    </div>
  );
}
