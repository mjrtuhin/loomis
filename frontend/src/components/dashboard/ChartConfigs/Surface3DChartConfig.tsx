import { useState, useEffect } from 'react';

interface Surface3DChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function Surface3DChartConfig({ sheetData, onPreviewChange }: Surface3DChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [zColumn, setZColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !zColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    const zIndex = sheetData.headers.indexOf(zColumn);
    if (xIndex === -1 || yIndex === -1 || zIndex === -1) return;

    // Get unique X and Y values for grid
    const xValues = [...new Set(sheetData.rows.map(row => parseFloat(row[xIndex]) || 0))].sort((a, b) => a - b);
    const yValues = [...new Set(sheetData.rows.map(row => parseFloat(row[yIndex]) || 0))].sort((a, b) => a - b);

    // Build 2D grid for surface
    const surfaceData: number[][] = [];
    
    yValues.forEach(y => {
      const row: number[] = [];
      xValues.forEach(x => {
        // Find matching Z value for this X,Y combination
        const matchingRow = sheetData.rows.find(r => 
          (parseFloat(r[xIndex]) || 0) === x && (parseFloat(r[yIndex]) || 0) === y
        );
        const z = matchingRow ? (parseFloat(matchingRow[zIndex]) || 0) : 0;
        row.push(z);
      });
      surfaceData.push(row);
    });

    const config = {
      title: { 
        text: title || '3D Surface Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {},
      visualMap: {
        show: true,
        dimension: 2,
        min: Math.min(...surfaceData.flat()),
        max: Math.max(...surfaceData.flat()),
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', 
                  '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      grid3D: {
        boxWidth: 100,
        boxDepth: 100,
        boxHeight: 50,
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
            intensity: 0.5
          }
        },
        postEffect: {
          enable: true,
          SSAO: {
            enable: true,
            radius: 2
          }
        }
      },
      xAxis3D: {
        name: xColumn,
        type: 'value',
        min: Math.min(...xValues),
        max: Math.max(...xValues)
      },
      yAxis3D: {
        name: yColumn,
        type: 'value',
        min: Math.min(...yValues),
        max: Math.max(...yValues)
      },
      zAxis3D: {
        name: zColumn,
        type: 'value'
      },
      series: [{
        type: 'surface',
        data: surfaceData,
        shading: 'color',
        wireframe: {
          show: true,
          lineStyle: {
            opacity: 0.1
          }
        },
        itemStyle: {
          opacity: 0.9
        }
      }],
      animation: true,
      animationDuration: 2000
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, zColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🏔️ Configure 3D Surface Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="3D Surface Chart"
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
              Z-Axis (Height) *
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Creates smooth 3D mesh surface! Drag to rotate, scroll to zoom. Perfect for mathematical functions or terrain visualization!
          </p>
        </div>
      </div>
    </div>
  );
}
