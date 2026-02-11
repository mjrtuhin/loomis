import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import 'echarts-gl';

interface ChartRendererProps {
  config: any;
}

export function ChartRenderer({ config }: ChartRendererProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Chart Error</h3>
          <p className="text-sm text-red-700 max-w-md">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-3 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">No chart configuration</p>
      </div>
    );
  }

  try {
    return (
      <ReactECharts
        option={config}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
        lazyUpdate={true}
        onChartReady={(chart: any) => {
          // Chart loaded successfully
          setError(null);
        }}
      />
    );
  } catch (err: any) {
    console.error('Chart render error:', err);
    return (
      <div className="h-full flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Rendering Failed</h3>
          <p className="text-sm text-red-700 max-w-md">{err.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}
