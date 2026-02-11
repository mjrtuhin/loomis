import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface RegionalMapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function RegionalMapChartConfig({ sheetData, onPreviewChange }: RegionalMapChartConfigProps) {
  const [regionColumn, setRegionColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [mapType, setMapType] = useState('world');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !regionColumn || !valueColumn) {
      onPreviewChange(null);
      return;
    }

    const regionValidation = validateColumnExists(sheetData.headers, regionColumn);
    if (!regionValidation.isValid) {
      onPreviewChange({ error: regionValidation.error });
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    const valueValidation = validateNumericColumn(sheetData.headers, formattedRows, valueColumn);
    if (!valueValidation.isValid) {
      onPreviewChange({ error: valueValidation.error });
      return;
    }

    const { categories, values } = aggregateData(formattedRows, regionColumn, valueColumn);

    const mapData = categories.map((name, idx) => ({
      name,
      value: values[idx]
    }));

    const config = {
      title: { text: title || 'Regional Map', left: 'center' },
      tooltip: { trigger: 'item' },
      visualMap: {
        min: 0,
        max: Math.max(...values),
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
        }
      },
      series: [{
        type: 'map',
        map: mapType,
        roam: true,
        data: mapData,
        emphasis: {
          label: { show: true }
        }
      }],
      _columnMetadata: {
        region: regionColumn,
        value: valueColumn,
        mapType: mapType,
        chartType: 'regionalMap'
      }
    };

    onPreviewChange(config);
  }, [sheetData, regionColumn, valueColumn, mapType, title]);

  if (!sheetData) {
    return <div className="text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Regional Map"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Map Type</label>
        <select
          value={mapType}
          onChange={(e) => setMapType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="world">World</option>
          <option value="USA">USA</option>
          <option value="china">China</option>
          <option value="india">India</option>
          <option value="UK">United Kingdom</option>
          <option value="germany">Germany</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Region/Country Column</label>
        <select
          value={regionColumn}
          onChange={(e) => setRegionColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value Column</label>
        <select
          value={valueColumn}
          onChange={(e) => setValueColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Auto-aggregation:</strong> Duplicate regions are automatically summed. Color-coded choropleth map.
        </p>
      </div>
    </div>
  );
}
