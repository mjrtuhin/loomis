import ReactECharts from 'echarts-for-react';

interface ChartRendererProps {
  config: any;
}

export function ChartRenderer({ config }: ChartRendererProps) {
  return (
    <ReactECharts
      option={config}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
