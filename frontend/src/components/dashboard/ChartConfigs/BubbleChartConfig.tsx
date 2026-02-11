import { useState, useEffect } from 'react';

interface BubbleChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function BubbleChartConfig({ sheetData, onPreviewChange }: BubbleChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [sizeColumn, setSizeColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !sizeColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    const sizeIndex = sheetData.headers.indexOf(sizeColumn);
    if (xIndex === -1 || yIndex === -1 || sizeIndex === -1) return;

    let seriesData;

    if (categoryColumn) {
      const categoryIndex = sheetData.headers.indexOf(categoryColumn);
      if (categoryIndex === -1) return;

      // Group by category
      const grouped: { [key: string]: number[][] } = {};
      sheetData.rows.forEach(row => {
        const category = row[categoryIndex];
        const x = parseFloat(row[xIndex]) || 0;
        const y = parseFloat(row[yIndex]) || 0;
        const size = parseFloat(row[sizeIndex]) || 10;

        if (!grouped[category]) grouped[category] = [];
        grouped[category].push([x, y, size]);
      });

      seriesData = Object.keys(grouped).map(category => ({
        name: category,
        type: 'scatter',
        data: grouped[category],
        symbolSize: (data: number[]) => Math.sqrt(data[2]) * 3,
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            borderWidth: 2,
            borderColor: '#fff'
          }
        }
      }));
    } else {
      const data = sheetData.rows.map(row => [
        parseFloat(row[xIndex]) || 0,
        parseFloat(row[yIndex]) || 0,
        parseFloat(row[sizeIndex]) || 10
      ]);

      seriesData = [{
        name: 'Bubble',
        type: 'scatter',
        data: data,
        symbolSize: (data: number[]) => Math.sqrt(data[2]) * 3,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            borderWidth: 2,
            borderColor: '#fff'
          }
        }
      }];
    }

    const config = {
      title: { 
        text: title || 'Bubble Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.seriesName}<br/>
                  ${xColumn}: ${params.value[0]}<br/>
                  ${yColumn}: ${params.value[1]}<br/>
                  ${sizeColumn}: ${params.value[2]}`;
        }
      },
      legend: {
        show: !!categoryColumn,
        bottom: 0,
        type: 'scroll'
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: categoryColumn ? '15%' : '10%',
        containLabel: true
      },
      xAxis: {
        name: xColumn,
        nameLocation: 'middle',
        nameGap: 30,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        name: yColumn,
        nameLocation: 'middle',
        nameGap: 40,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: seriesData,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'elasticOut'
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, sizeColumn, categoryColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🫧 Configure Bubble Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bubble Chart"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bubble Size *
          </label>
          <select
            value={sizeColumn}
            onChange={(e) => setSizeColumn(e.target.value)}
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
            Category (Optional - for colored groups)
          </label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (single color)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Bubble size represents the third dimension. Larger values = bigger bubbles!
          </p>
        </div>
      </div>
    </div>
  );
}
