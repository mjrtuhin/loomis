import { useState, useEffect } from 'react';
import { validateCoordinates, validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { registerMap, AVAILABLE_MAPS } from '../../../utils/mapRegistry';

interface GeoChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GeoChartConfig({ sheetData, onPreviewChange }: GeoChartConfigProps) {
  const [nameColumn, setNameColumn] = useState('');
  const [latColumn, setLatColumn] = useState('');
  const [lonColumn, setLonColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [mapType, setMapType] = useState<string>('world');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);

  useEffect(() => {
    setError(null);

    if (!sheetData || !nameColumn || !latColumn || !lonColumn || !valueColumn) return;

    const nameValidation = validateColumnExists(sheetData.headers, nameColumn);
    if (!nameValidation.isValid) {
      setError(nameValidation.error!);
      return;
    }

    const latIndex = sheetData.headers.indexOf(latColumn);
    const lonIndex = sheetData.headers.indexOf(lonColumn);
    const coordValidation = validateCoordinates(sheetData.rows, latIndex, lonIndex, latColumn, lonColumn);
    if (!coordValidation.isValid) {
      setError(coordValidation.error!);
      return;
    }

    const valueIndex = sheetData.headers.indexOf(valueColumn);
    const valueValidation = validateNumericColumn(sheetData.rows, valueIndex, valueColumn);
    if (!valueValidation.isValid) {
      setError(valueValidation.error!);
      return;
    }

    const loadMapAndGenerateConfig = async () => {
      setIsLoadingMap(true);
      await registerMap(mapType);
      setIsLoadingMap(false);

      const nameIndex = sheetData.headers.indexOf(nameColumn);

      const geoData = sheetData.rows.map(row => ({
        name: row[nameIndex],
        value: [
          parseFloat(row[lonIndex]),
          parseFloat(row[latIndex]),
          parseFloat(row[valueIndex]) || 0
        ]
      }));

      const config = {
        title: { 
          text: title || 'Geographic Points', 
          left: 'center',
          textStyle: { fontSize: 18 }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `${params.name}<br/>Lat: ${params.value[1].toFixed(2)}<br/>Lon: ${params.value[0].toFixed(2)}<br/>Value: ${params.value[2]}`;
          }
        },
        geo: {
          map: mapType,
          roam: true,
          zoom: 1.2,
          label: {
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            areaColor: '#e0e0e0',
            borderColor: '#404a59'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#ffd700'
            }
          }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          data: geoData,
          symbolSize: (val: number[]) => Math.max(Math.sqrt(val[2]) * 2, 8),
          label: {
            show: false
          },
          itemStyle: {
            color: '#c23531'
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{b}',
              fontSize: 12
            },
            itemStyle: {
              color: '#ff4500',
              shadowBlur: 10,
              shadowColor: 'rgba(255, 69, 0, 0.5)'
            }
          }
        }],
        animation: true,
        animationDuration: 2000
      };

      onPreviewChange(config);
    };

    loadMapAndGenerateConfig();
  }, [nameColumn, latColumn, lonColumn, valueColumn, mapType, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🗺️ Configure Geographic Points</h3>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        {isLoadingMap && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">⏳ Loading {mapType} map...</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Geographic Points"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Map</label>
          <select
            value={mapType}
            onChange={(e) => setMapType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {AVAILABLE_MAPS.map(map => (
              <option key={map.value} value={map.value}>
                {map.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location Name Column *</label>
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitude Column *</label>
            <select
              value={latColumn}
              onChange={(e) => setLatColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitude Column *</label>
            <select
              value={lonColumn}
              onChange={(e) => setLonColumn(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Value Column (Point Size) *</label>
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
          <p className="text-sm text-blue-800 font-semibold mb-1">📍 Coordinate Requirements:</p>
          <p className="text-xs text-blue-700">
            • Latitude: -90 to 90 (North/South)<br/>
            • Longitude: -180 to 180 (East/West)<br/>
            • Point size based on value
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-800 font-semibold">💡 Use Case:</p>
          <p className="text-xs text-purple-700">
            Perfect for plotting specific locations (stores, offices, events) on a map with exact coordinates!
          </p>
        </div>
      </div>
    </div>
  );
}
