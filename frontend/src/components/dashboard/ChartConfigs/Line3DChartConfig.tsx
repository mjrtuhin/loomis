import { useState, useEffect } from 'react';

interface Line3DChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function Line3DChartConfig({ sheetData, onPreviewChange }: Line3DChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [zColumn, setZColumn] = useState('');
  const [seriesColumn, setSeriesColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !zColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    const zIndex = sheetData.headers.indexOf(zColumn);
    if (xIndex === -1 || yIndex === -1 || zIndex === -1) return;

    let seriesData;

    if (seriesColumn) {
      const seriesIndex = sheetData.headers.indexOf(seriesColumn);
      if (seriesIndex === -1) return;

      // Group by series
      const grouped: { [key: string]: number[][] } = {};
      sheetData.rows.forEach(row => {
        const series = row[seriesIndex];
        const x = parseFloat(row[xIndex]) || 0;
        const y = parseFloat(row[yIndex]) || 0;
        const z = parseFloat(row[zIndex]) || 0;

        if (!grouped[series]) grouped[series] = [];
        grouped[series].push([x, y, z]);
      });

      seriesData = Object.keys(grouped).map(series => ({
        name: series,
        type: 'line3D',
        data: grouped[series],
        lineStyle: {
          width: 4
        }
      }));
    } else {
      const data = sheetData.rows.map(row => [
        parseFloat(row[xIndex]) || 0,
        parseFloat(row[yIndex]) || 0,
        parseFloat(row[zIndex]) || 0
      ]);

      seriesData = [{
        name: '3D Line',
        type: 'line3D',
        data: data,
        lineStyle: {
          width: 4
        }
      }];
    }

    const config = {
      title: { 
        text: title || '3D Line Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {},
      visualMap: {
        show: true,
        dimension: 2,
        min: Math.min(...sheetData.rows.map(row => parseFloat(row[zIndex]) || 0)),
        max: Math.max(...sheetData.rows.map(row => parseFloat(row[zIndex]) || 0)),
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', 
                  '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      grid3D: {
        boxWidth: 100,
        boxDepth: 100,
        boxHeight: 100,
        viewControl: {
          autoRotate: false,
          distance: 200,
          alpha: 30,
          beta: 40
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true
          },
          ambient: {
            intensity: 0.3
          }
        }
      },
      xAxis3D: {
        name: xColumn,
        type: 'value'
      },
      yAxis3D: {
        name: yColumn,
        type: 'value'
      },
      zAxis3D: {
        name: zColumn,
        type: 'value'
      },
      series: seriesData,
      animation: true,
      animationDuration: 2000
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, zColumn, seriesColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🎲 Configure 3D Line Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="3D Line Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              X-Axis *
            </label>
            <select
              value={xColumn}
              onChange={(e) => setXColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
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
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Z-Axis *
            </label>
            <select
              value={zColumn}
              onChange={(e) => setZColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Series/Group Column (Optional)
          </label>
          <select
            value={seriesColumn}
            onChange={(e) => setSeriesColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (single line)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Drag to rotate the 3D view! Scroll to zoom. Color gradient based on Z-axis values. Perfect for visualizing 3D trajectories!
          </p>
        </div>
      </div>
    </div>
  );
}
