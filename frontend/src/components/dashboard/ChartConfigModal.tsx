import { useState, useEffect } from 'react';
import { ChartRenderer } from './ChartRenderer';

interface ChartConfigModalProps {
  isOpen: boolean;
  chartType: string;
  onClose: () => void;
  onSave: (config: any) => void;
  sheetData: {
    headers: string[];
    rows: string[][];
  } | null;
}

export function ChartConfigModal({
  isOpen,
  chartType,
  onClose,
  onSave,
  sheetData,
}: ChartConfigModalProps) {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [title, setTitle] = useState('');
  const [previewConfig, setPreviewConfig] = useState<any>(null);

  useEffect(() => {
    const generatePreview = async () => {
      if (!sheetData || !xColumn || !yColumn) return;

      const xIndex = sheetData.headers.indexOf(xColumn);
      const yIndex = sheetData.headers.indexOf(yColumn);

      if (xIndex === -1 || yIndex === -1) return;

      const xData = sheetData.rows.map(row => row[xIndex]);
      const yData = sheetData.rows.map(row => parseFloat(row[yIndex]) || 0);

      const requestData = {
        type: chartType,
        title: title || xColumn + ' vs ' + yColumn,
        xAxisData: xData,
        series: [{ name: yColumn, data: yData }],
      };

      try {
        const response = await fetch('http://localhost:8080/api/charts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();
        
        const enhancedConfig = {
          ...result.chartConfig,
          title: {
            text: title || (xColumn + ' vs ' + yColumn),
            left: 'center',
          },
          xAxis: {
            type: 'category',
            data: xData,
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            name: yColumn,
            type: chartType === 'line' ? 'line' : chartType === 'pie' ? 'pie' : 'bar',
            data: yData,
            smooth: chartType === 'line',
          }],
        };
        
        setPreviewConfig(enhancedConfig);
      } catch (error) {
        console.error('Failed to generate chart:', error);
      }
    };

    generatePreview();
  }, [xColumn, yColumn, title, chartType]);

  const handleSave = () => {
    if (previewConfig) {
      onSave({
        type: chartType,
        title: title || 'My Chart',
        xColumn,
        yColumn,
        config: previewConfig,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Configure {chartType} Chart
          </h2>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Data Mapping</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={xColumn && yColumn ? `${xColumn} vs ${yColumn}` : "My Chart"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X-Axis Column
                  </label>
                  <select
                    value={xColumn}
                    onChange={(e) => setXColumn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {sheetData?.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Y-Axis Column
                  </label>
                  <select
                    value={yColumn}
                    onChange={(e) => setYColumn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {sheetData?.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Live Preview</h3>
              <div className="border border-gray-300 rounded-lg bg-gray-50 h-80">
                {previewConfig ? (
                  <ChartRenderer config={previewConfig} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select columns to see preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewConfig}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
