import { useState, useEffect } from 'react';

interface BoxPlotChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function BoxPlotChartConfig({ sheetData, onPreviewChange }: BoxPlotChartConfigProps) {
  const [valueColumn, setValueColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !valueColumn) return;

    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (valueIndex === -1) return;

    let categories: string[] = ['Data'];
    let boxData: number[][][] = [[]];

    if (categoryColumn) {
      const categoryIndex = sheetData.headers.indexOf(categoryColumn);
      if (categoryIndex !== -1) {
        const grouped: { [key: string]: number[] } = {};
        
        sheetData.rows.forEach(row => {
          const cat = row[categoryIndex];
          const val = parseFloat(row[valueIndex]);
          if (!isNaN(val)) {
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(val);
          }
        });

        categories = Object.keys(grouped);
        boxData = categories.map(cat => {
          const values = grouped[cat].sort((a, b) => a - b);
          const q1 = values[Math.floor(values.length * 0.25)];
          const median = values[Math.floor(values.length * 0.5)];
          const q3 = values[Math.floor(values.length * 0.75)];
          const min = values[0];
          const max = values[values.length - 1];
          return [min, q1, median, q3, max];
        });
      }
    } else {
      const values = sheetData.rows
        .map(row => parseFloat(row[valueIndex]))
        .filter(v => !isNaN(v))
        .sort((a, b) => a - b);
      
      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const min = values[0];
      const max = values[values.length - 1];
      
      boxData = [[min, q1, median, q3, max]];
    }

    const config = {
      title: { 
        text: title || `${valueColumn} Distribution`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data;
          return `Min: ${data[0]}<br/>Q1: ${data[1]}<br/>Median: ${data[2]}<br/>Q3: ${data[3]}<br/>Max: ${data[4]}`;
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
        splitArea: {
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
          color: '#fac858',
          borderColor: '#ee6666'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            borderWidth: 2
          }
        }
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'elasticOut'
    };

    onPreviewChange(config);
  }, [valueColumn, categoryColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📦 Configure Box Plot</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={valueColumn ? `${valueColumn} Distribution` : "My Box Plot"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Column (Numeric) *
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
            Category Column (Optional)
          </label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (single box)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
