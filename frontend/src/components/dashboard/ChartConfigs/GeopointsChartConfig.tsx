import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';

interface GeopointsChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GeopointsChartConfig({ sheetData, onPreviewChange }: GeopointsChartConfigProps) {
  const [nameColumn, setNameColumn] = useState('');
  const [latColumn, setLatColumn] = useState('');
  const [lonColumn, setLonColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !nameColumn || !latColumn || !lonColumn) {
      onPreviewChange(null);
      return;
    }

    const nameValidation = validateColumnExists(sheetData.headers, nameColumn);
    if (!nameValidation.isValid) {
      onPreviewChange({ error: nameValidation.error });
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    const latValidation = validateNumericColumn(sheetData.headers, formattedRows, latColumn);
    if (!latValidation.isValid) {
      onPreviewChange({ error: `Latitude: ${latValidation.error}` });
      return;
    }

    const lonValidation = validateNumericColumn(sheetData.headers, formattedRows, lonColumn);
    if (!lonValidation.isValid) {
      onPreviewChange({ error: `Longitude: ${lonValidation.error}` });
      return;
    }

    if (valueColumn) {
      const valueValidation = validateNumericColumn(sheetData.headers, formattedRows, valueColumn);
      if (!valueValidation.isValid) {
        onPreviewChange({ error: `Value: ${valueValidation.error}` });
        return;
      }
    }

    const geoData = formattedRows.map(row => ({
      name: String(row[nameColumn]),
      value: [
        parseFloat(row[lonColumn]),
        parseFloat(row[latColumn]),
        valueColumn ? parseFloat(row[valueColumn]) : 1
      ]
    }));

    const config = {
      title: { text: title || 'Geo Points Map', left: 'center' },
      tooltip: { trigger: 'item' },
      geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#eee',
          borderColor: '#404a59'
        }
      },
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        data: geoData,
        symbolSize: (val: any) => Math.sqrt(val[2]) * 5,
        label: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          label: { show: true }
        }
      }],
      _columnMetadata: {
        name: nameColumn,
        lat: latColumn,
        lon: lonColumn,
        value: valueColumn || null,
        chartType: 'geopoints'
      }
    };

    onPreviewChange(config);
  }, [sheetData, nameColumn, latColumn, lonColumn, valueColumn, title]);

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
          placeholder="Geo Points Map"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name/Label Column</label>
        <select
          value={nameColumn}
          onChange={(e) => setNameColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude Column</label>
        <select
          value={latColumn}
          onChange={(e) => setLatColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude Column</label>
        <select
          value={lonColumn}
          onChange={(e) => setLonColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value Column (optional - for marker size)</label>
        <select
          value={valueColumn}
          onChange={(e) => setValueColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">None</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Plot points on world map using latitude and longitude
        </p>
      </div>
    </div>
  );
}
