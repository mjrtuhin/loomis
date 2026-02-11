import { useState, useEffect } from 'react';

interface TreemapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function TreemapChartConfig({ sheetData, onPreviewChange }: TreemapChartConfigProps) {
  const [nameColumn, setNameColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !nameColumn || !valueColumn) return;

    const nameIndex = sheetData.headers.indexOf(nameColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (nameIndex === -1 || valueIndex === -1) return;

    let treemapData;

    if (categoryColumn) {
      const categoryIndex = sheetData.headers.indexOf(categoryColumn);
      if (categoryIndex === -1) return;

      // Group by category and aggregate values
      const grouped: { [key: string]: { [item: string]: number } } = {};
      
      sheetData.rows.forEach(row => {
        const category = row[categoryIndex];
        const item = row[nameIndex];
        const value = parseFloat(row[valueIndex]) || 0;
        
        if (!grouped[category]) grouped[category] = {};
        grouped[category][item] = (grouped[category][item] || 0) + value;
      });

      // Build hierarchical structure
      treemapData = Object.keys(grouped).map(category => ({
        name: category,
        children: Object.keys(grouped[category]).map(item => ({
          name: item,
          value: grouped[category][item]
        }))
      }));
    } else {
      // No category - aggregate by name only
      const aggregated: { [key: string]: number } = {};
      
      sheetData.rows.forEach(row => {
        const item = row[nameIndex];
        const value = parseFloat(row[valueIndex]) || 0;
        aggregated[item] = (aggregated[item] || 0) + value;
      });
      
      treemapData = Object.keys(aggregated).map(item => ({
        name: item,
        value: aggregated[item]
      }));
    }

    const config = {
      title: { 
        text: title || 'Treemap Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          if (params.value) {
            return `${params.name}<br/>Value: ${params.value}`;
          }
          return params.name;
        }
      },
      series: [{
        type: 'treemap',
        data: categoryColumn ? treemapData : [{ name: 'root', children: treemapData }],
        width: '95%',
        height: '80%',
        top: '12%',
        roam: false,
        nodeClick: 'zoomToNode',
        breadcrumb: {
          show: categoryColumn ? true : false,
          height: 25,
          bottom: 0
        },
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 12
        },
        upperLabel: {
          show: true,
          height: 30,
          fontSize: 14,
          fontWeight: 'bold'
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          gapWidth: 2
        },
        levels: [
          {
            itemStyle: {
              borderColor: '#555',
              borderWidth: 4,
              gapWidth: 4
            }
          },
          {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              borderWidth: 5,
              gapWidth: 1,
              borderColorSaturation: 0.6
            }
          }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }],
      animation: true,
      animationDuration: 1500
    };

    onPreviewChange(config);
  }, [nameColumn, valueColumn, categoryColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📦 Configure Treemap Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Treemap Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name Column *
          </label>
          <select
            value={nameColumn}
            onChange={(e) => setNameColumn(e.target.value)}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category/Group Column (Optional)
          </label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (flat structure)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Space-filling visualization! Rectangle size = aggregated value. Click to zoom into categories. Auto-sums duplicate items!
          </p>
        </div>
      </div>
    </div>
  );
}
