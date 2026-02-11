import { useState, useEffect, useCallback } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { registerMap, AVAILABLE_MAPS } from '../../../utils/mapRegistry';

interface MapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function MapChartConfig({ sheetData, onPreviewChange }: MapChartConfigProps) {
  const [regionColumn, setRegionColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [mapType, setMapType] = useState<string>('world');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);

  const generateConfig = useCallback(async () => {
    setError(null);

    if (!sheetData || !regionColumn || !valueColumn) return;

    const regionValidation = validateColumnExists(sheetData.headers, regionColumn);
    if (!regionValidation.isValid) {
      setError(regionValidation.error!);
      return;
    }

    const valueIndex = sheetData.headers.indexOf(valueColumn);
    const valueValidation = validateNumericColumn(sheetData.rows, valueIndex, valueColumn);
    if (!valueValidation.isValid) {
      setError(valueValidation.error!);
      return;
    }

    setIsLoadingMap(true);
    const mapLoaded = await registerMap(mapType);
    setIsLoadingMap(false);

    if (!mapLoaded) {
      setError(`Failed to load ${mapType} map. Please try another map.`);
      return;
    }

    const regionIndex = sheetData.headers.indexOf(regionColumn);

    const mapData = sheetData.rows.map(row => ({
      name: row[regionIndex],
      value: parseFloat(row[valueIndex]) || 0
    }));

    const allValues = mapData.map(d => d.value);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const config = {
      title: { 
        text: title || 'Regional Map', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>Value: {c}'
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
        },
        bottom: 50,
        left: 20
      },
      series: [{
        type: 'map',
        map: mapType,
        roam: true,
        data: mapData,
        label: {
          show: false,
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          areaColor: '#eeeeee',
          borderColor: '#404a59'
        },
        emphasis: {
          label: {
            show: true
          },
          itemStyle: {
            areaColor: '#ffd700'
          }
        }
      }],
      animation: true,
      animationDuration: 1500
    };

    onPreviewChange(config);
  }, [sheetData, regionColumn, valueColumn, mapType, title, onPreviewChange]);

  useEffect(() => {
    generateConfig();
  }, [generateConfig]);

  const selectedMapInfo = AVAILABLE_MAPS.find(m => m.value === mapType);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🌍 Configure Regional Map</h3>
        
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
            placeholder="Regional Map"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Map</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedMapInfo?.regionType || 'Region'} Name Column *
          </label>
          <select
            value={regionColumn}
            onChange={(e) => setRegionColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value Column *</label>
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

        {selectedMapInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-semibold mb-1">
              📍 {selectedMapInfo.regionType} for {selectedMapInfo.label}:
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Examples: {selectedMapInfo.examples}
            </p>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-semibold">
            ✅ Region names only - No coordinates needed!
          </p>
          <p className="text-xs text-green-700 mt-1">
            Just provide region/state/province names and values
          </p>
        </div>
      </div>
    </div>
  );
}
