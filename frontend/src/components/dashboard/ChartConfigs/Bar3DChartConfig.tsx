import { useState, useEffect } from 'react';

interface Bar3DChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function Bar3DChartConfig({ sheetData, onPreviewChange }: Bar3DChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !valueColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (xIndex === -1 || yIndex === -1 || valueIndex === -1) return;

    const xCategories = [...new Set(sheetData.rows.map(row => row[xIndex]))];
    const yCategories = [...new Set(sheetData.rows.map(row => row[yIndex]))];

    const barData = sheetData.rows.map(row => {
      const xIdx = xCategories.indexOf(row[xIndex]);
      const yIdx = yCategories.indexOf(row[yIndex]);
      const value = parseFloat(row[valueIndex]) || 0;
      return [xIdx, yIdx, value];
    });

    const config = {
      title: { 
        text: title || '3D Bar Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          return `${xCategories[params.value[0]]}, ${yCategories[params.value[1]]}<br/>Value: ${params.value[2]}`;
        }
      },
      visualMap: {
        show: true,
        dimension: 2,
        min: 0,
        max: Math.max(...barData.map(d => d[2])),
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', 
                  '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      grid3D: {
        boxWidth: 150,
        boxDepth: 150,
        boxHeight: 100,
        viewControl: {
          autoRotate: false,
          distance: 250,
          alpha: 25,
          beta: 40,
          minAlpha: 5,
          maxAlpha: 90
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true
          },
          ambient: {
            intensity: 0.5
          }
        }
      },
      xAxis3D: {
        name: xColumn,
        type: 'category',
        data: xCategories
      },
      yAxis3D: {
        name: yColumn,
        type: 'category',
        data: yCategories
      },
      zAxis3D: {
        name: valueColumn,
        type: 'value'
      },
      series: [{
        type: 'bar3D',
        data: barData,
        shading: 'lambert',
        emphasis: {
          label: {
            show: true,
            textStyle: {
              fontSize: 20,
              color: '#fff'
            }
          },
          itemStyle: {
            color: '#900'
          }
        }
      }],
      animation: true,
      animationDuration: 2000
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, valueColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Configure 3D Bar Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="3D Bar Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X-Axis Categories *
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
            Y-Axis Categories *
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
            Values (Bar Heights) *
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
            💡 Drag to rotate! 3D bars on a grid. Color gradient shows value intensity. Perfect for comparing data across two dimensions!
          </p>
        </div>
      </div>
    </div>
  );
}
