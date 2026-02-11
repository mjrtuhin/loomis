import { useState, useEffect } from 'react';
import { BarChartConfig } from './ChartConfigs/BarChartConfig';
import { LineChartConfig } from './ChartConfigs/LineChartConfig';
import { PieChartConfig } from './ChartConfigs/PieChartConfig';
import { HorizontalBarChartConfig } from './ChartConfigs/HorizontalBarChartConfig';
import { StackedBarChartConfig } from './ChartConfigs/StackedBarChartConfig';
import { AreaChartConfig } from './ChartConfigs/AreaChartConfig';
import { SmoothLineChartConfig } from './ChartConfigs/SmoothLineChartConfig';
import { BoxPlotChartConfig } from './ChartConfigs/BoxPlotChartConfig';
import { ViolinPlotChartConfig } from './ChartConfigs/ViolinPlotChartConfig';
import { HeatmapChartConfig } from './ChartConfigs/HeatmapChartConfig';
import { CandlestickChartConfig } from './ChartConfigs/CandlestickChartConfig';
import { RadarChartConfig } from './ChartConfigs/RadarChartConfig';
import { ParallelCoordinatesChartConfig } from './ChartConfigs/ParallelCoordinatesChartConfig';
import { EffectScatterChartConfig } from './ChartConfigs/EffectScatterChartConfig';
import { BubbleScatterChartConfig } from './ChartConfigs/BubbleScatterChartConfig';
import { FunnelChartConfig } from './ChartConfigs/FunnelChartConfig';
import { GaugeChartConfig } from './ChartConfigs/GaugeChartConfig';
import { LiquidFillChartConfig } from './ChartConfigs/LiquidFillChartConfig';
import { WordCloudChartConfig } from './ChartConfigs/WordCloudChartConfig';
import { PolarBarChartConfig } from './ChartConfigs/PolarBarChartConfig';
import { SankeyChartConfig } from './ChartConfigs/SankeyChartConfig';
import { TreemapChartConfig } from './ChartConfigs/TreemapChartConfig';
import { NetworkGraphChartConfig } from './ChartConfigs/NetworkGraphChartConfig';
import { ThemeRiverChartConfig } from './ChartConfigs/ThemeRiverChartConfig';
import { CalendarHeatmapChartConfig } from './ChartConfigs/CalendarHeatmapChartConfig';
import { GanttChartConfig } from './ChartConfigs/GanttChartConfig';
import { GeopointsChartConfig } from './ChartConfigs/GeopointsChartConfig';
import { RegionalMapChartConfig } from './ChartConfigs/RegionalMapChartConfig';
import { Line3DChartConfig } from './ChartConfigs/Line3DChartConfig';
import { Bar3DChartConfig } from './ChartConfigs/Bar3DChartConfig';
import { Scatter3DChartConfig } from './ChartConfigs/Scatter3DChartConfig';
import { ChartRenderer } from './ChartRenderer';

interface ChartConfigModalProps {
  isOpen: boolean;
  chartType: string;
  sheetData: { headers: string[]; rows: string[][] } | null;
  onSave: (config: any) => void;
  onClose: () => void;
}

export function ChartConfigModal({ isOpen, chartType, sheetData, onSave, onClose }: ChartConfigModalProps) {
  const [previewConfig, setPreviewConfig] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setPreviewConfig(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (previewConfig && !previewConfig.error) {
      onSave(previewConfig);
      onClose();
    }
  };

  const renderConfigForm = () => {
    const configProps = { sheetData, onPreviewChange: setPreviewConfig };

    switch (chartType) {
      case 'bar': return <BarChartConfig {...configProps} />;
      case 'line': return <LineChartConfig {...configProps} />;
      case 'pie': return <PieChartConfig {...configProps} />;
      case 'horizontalBar': return <HorizontalBarChartConfig {...configProps} />;
      case 'stackedBar': return <StackedBarChartConfig {...configProps} />;
      case 'area': return <AreaChartConfig {...configProps} />;
      case 'smoothLine': return <SmoothLineChartConfig {...configProps} />;
      case 'boxplot': return <BoxPlotChartConfig {...configProps} />;
      case 'violin': return <ViolinPlotChartConfig {...configProps} />;
      case 'heatmap': return <HeatmapChartConfig {...configProps} />;
      case 'candlestick': return <CandlestickChartConfig {...configProps} />;
      case 'radar': return <RadarChartConfig {...configProps} />;
      case 'parallelCoordinates': return <ParallelCoordinatesChartConfig {...configProps} />;
      case 'effectScatter': return <EffectScatterChartConfig {...configProps} />;
      case 'bubbleScatter': return <BubbleScatterChartConfig {...configProps} />;
      case 'funnel': return <FunnelChartConfig {...configProps} />;
      case 'gauge': return <GaugeChartConfig {...configProps} />;
      case 'liquidFill': return <LiquidFillChartConfig {...configProps} />;
      case 'wordCloud': return <WordCloudChartConfig {...configProps} />;
      case 'polarBar': return <PolarBarChartConfig {...configProps} />;
      case 'sankey': return <SankeyChartConfig {...configProps} />;
      case 'treemap': return <TreemapChartConfig {...configProps} />;
      case 'networkGraph': return <NetworkGraphChartConfig {...configProps} />;
      case 'themeRiver': return <ThemeRiverChartConfig {...configProps} />;
      case 'calendarHeatmap': return <CalendarHeatmapChartConfig {...configProps} />;
      case 'gantt': return <GanttChartConfig {...configProps} />;
      case 'geopoints': return <GeopointsChartConfig {...configProps} />;
      case 'regionalMap': return <RegionalMapChartConfig {...configProps} />;
      case 'line3D': return <Line3DChartConfig {...configProps} />;
      case 'bar3D': return <Bar3DChartConfig {...configProps} />;
      case 'scatter3D': return <Scatter3DChartConfig {...configProps} />;
      default: return <div className="text-gray-500">Chart type not yet configured</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Configure Chart: {chartType}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">
            ×
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Title</h3>
            {renderConfigForm()}
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            {previewConfig?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h4 className="text-lg font-semibold text-red-900 mb-2">Configuration Error</h4>
                <p className="text-sm text-red-700">{previewConfig.error}</p>
              </div>
            ) : previewConfig ? (
              <div className="bg-white rounded-lg shadow-md p-4 h-[500px]">
                <ChartRenderer config={previewConfig} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center h-[500px]">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg">Configure chart to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewConfig || previewConfig.error}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
