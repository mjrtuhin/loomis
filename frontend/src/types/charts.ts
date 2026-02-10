export type ChartType = 
  | 'bar' | 'bar_horizontal' | 'bar_stacked'
  | 'line' | 'line_smooth' | 'line_area'
  | 'pie' | 'pie_doughnut' | 'pie_rose'
  | 'scatter' | 'scatter_bubble'
  | 'heatmap' | 'boxplot' | 'candlestick'
  | 'radar' | 'funnel' | 'gauge'
  | 'sankey' | 'sunburst' | 'treemap' | 'tree'
  | 'graph' | 'graph_force' | 'graph_circular' | 'chord';

export type FilterType = 'all' | 'range' | 'top' | 'bottom' | 'between' | 'above' | 'below';

export interface RowFilter {
  type: FilterType;
  value?: number | { start?: number; end?: number; min?: number; max?: number; column?: string };
}

export interface ChartColumns {
  x: string;
  y: string[];
  category?: string | null;
}

export interface ChartStyle {
  colorScheme: string;
  showLegend: boolean;
  showTooltip: boolean;
}

export interface ChartConfig {
  title: string;
  columns: ChartColumns;
  rowFilter: RowFilter;
  style: ChartStyle;
}

export interface ChartPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChartItem {
  id: string;
  type: ChartType;
  position: ChartPosition;
  config: ChartConfig;
}

export interface ChartTypeInfo {
  type: ChartType;
  name: string;
  category: string;
  description: string;
  requiredColumns: {
    x: string;
    y: string;
  };
}

export interface EChartsOption {
  title?: object;
  tooltip?: object;
  legend?: object;
  xAxis?: object;
  yAxis?: object;
  series?: object[];
  [key: string]: unknown;
}
