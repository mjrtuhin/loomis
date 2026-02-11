import { useState, useEffect } from 'react';

interface Scatter3DChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function Scatter3DChartConfig({ sheetData, onPreviewChange }: Scatter3DChartConfigProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [zColumn, setZColumn] = useState('');
  const [sizeColumn, setSizeColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !xColumn || !yColumn || !zColumn) return;

    const xIndex = sheetData.headers.indexOf(xColumn);
    const yIndex = sheetData.headers.indexOf(yColumn);
    const zIndex = sheetData.headers.indexOf(zColumn);
    if (xIndex === -1 || yIndex === -1 || zIndex === -1) return;

    let sizeIndex = -1;
    if (sizeColumn) {
      sizeIndex = sheetData.headers.indexOf(sizeColumn);
    }

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
        const z = parseFloat(row[zIndex]) || 0;
        const size = sizeIndex !== -1 ? (parseFloat(row[sizeIndex]) || 10) : 10;

        if (!grouped[category]) grouped[category] = [];
        grouped[category].push([x, y, z, size]);
      });

      seriesData = Object.keys(grouped).map(category => ({
        name: category,
        type: 'scatter3D',
        data: grouped[category],
        symbolSize: (data: number[]) => sizeIndex !== -1 ? Math.sqrt(data[3]) * 2 : 10,
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff'
          }
        }
      }));
    } else {
      const data = sheetData.rows.map(row => {
        const x = parseFloat(row[xIndex]) || 0;
        const y = parseFloat(row[yIndex]) || 0;
        const z = parseFloat(row[zIndex]) || 0;
        const size = sizeIndex !== -1 ? (parseFloat(row[sizeIndex]) || 10) : 10;
        return [x, y, z, size];
      });

      seriesData = [{
        name: '3D Scatter',
        type: 'scatter3D',
        data: data,
        symbolSize: (data: number[]) => sizeIndex !== -1 ? Math.sqrt(data[3]) * 2 : 10,
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff'
          }
        }
      }];
    }

    // Get Z values for color mapping
    const zValues = sheetData.rows.map(row => parseFloat(row[zIndex]) || 0);
    const minZ = Math.min(...zValues);
    const maxZ = Math.max(...zValues);

    const config = {
      title: { 
        text: title || '3D Scatter Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          if (sizeIndex !== -1) {
            return `${params.seriesName}<br/>
                    ${xColumn}: ${params.value[0]}<br/>
                    ${yColumn}: ${params.value[1]}<br/>
                    ${zColumn}: ${params.value[2]}<br/>
                    ${sizeColumn}: ${params.value[3]}`;
          } else {
            return `${params.seriesName}<br/>
                    ${xColumn}: ${params.value[0]}<br/>
                    ${yColumn}: ${params.value[1]}<br/>
                    ${zColumn}: ${params.value[2]}`;
          }
        }
      },
      legend: {
        show: !!categoryColumn,
        bottom: 0,
        type: 'scroll'
      },
      visualMap: {
        show: true,
        dimension: 2,
        min: minZ,
        max: maxZ,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', 
                  '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        text: ['High', 'Low'],
        calculable: true,
        orient: 'vertical',
        left: 'right',
        top: 'center'
      },
      grid3D: {
        boxWidth: 100,
        boxDepth: 100,
        boxHeight: 100,
        viewControl: {
          autoRotate: false,
          rotateSensitivity: 1,
          zoomSensitivity: 1,
          panSensitivity: 1,
          distance: 200,
          alpha: 30,
          beta: 40,
          minAlpha: -90,
          maxAlpha: 90
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true,
            shadowQuality: 'high'
          },
          ambient: {
            intensity: 0.4
          }
        },
        postEffect: {
          enable: true,
          bloom: {
            enable: false
          },
          SSAO: {
            enable: true,
            radius: 2
          }
        }
      },
      xAxis3D: {
        name: xColumn,
        type: 'value',
        nameTextStyle: {
          fontSize: 14
        }
      },
      yAxis3D: {
        name: yColumn,
        type: 'value',
        nameTextStyle: {
          fontSize: 14
        }
      },
      zAxis3D: {
        name: zColumn,
        type: 'value',
        nameTextStyle: {
          fontSize: 14
        }
      },
      series: seriesData,
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [xColumn, yColumn, zColumn, sizeColumn, categoryColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🎯 Configure 3D Scatter Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="3D Scatter Chart"
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
            Point Size Column (Optional)
          </label>
          <select
            value={sizeColumn}
            onChange={(e) => setSizeColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (uniform size)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Column (Optional - for colored groups)
          </label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (single color gradient)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Interactive Controls:</strong> Drag to rotate | Scroll to zoom | Right-drag to pan<br/>
            Color gradient based on Z-axis values. Perfect for 3D data exploration!
          </p>
        </div>
      </div>
    </div>
  );
}
