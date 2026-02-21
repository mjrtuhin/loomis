export interface ChartTypeDefinition {
  id: string;
  name: string;
  category: 'basic' | 'statistical' | 'specialized' | 'geographic' | 'timeseries' | 'advanced';
  description: string;
  icon: string;
  requiredColumns: {
    x?: 'categorical' | 'numeric' | 'date';
    y?: 'numeric';
    multiple?: boolean;
  };
}

export const CHART_TYPES: ChartTypeDefinition[] = [
  // BASIC CHARTS
  {
    id: 'bar',
    name: 'Bar Chart',
    category: 'basic',
    description: 'Compare values across categories',
    icon: '📊',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'bar_horizontal',
    name: 'Horizontal Bar',
    category: 'basic',
    description: 'Bar chart with horizontal orientation',
    icon: '📊',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'bar_stacked',
    name: 'Stacked Bar',
    category: 'basic',
    description: 'Compare multiple series stacked',
    icon: '📊',
    requiredColumns: { x: 'categorical', y: 'numeric', multiple: true },
  },
  {
    id: 'line',
    name: 'Line Chart',
    category: 'basic',
    description: 'Show trends over time',
    icon: '📈',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'line_smooth',
    name: 'Smooth Line',
    category: 'basic',
    description: 'Line chart with smooth curves',
    icon: '📈',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'area',
    name: 'Area Chart',
    category: 'basic',
    description: 'Line chart with filled area',
    icon: '📈',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    category: 'basic',
    description: 'Show proportions of a whole',
    icon: '🥧',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'doughnut',
    name: 'Doughnut Chart',
    category: 'basic',
    description: 'Pie chart with center hole',
    icon: '🍩',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'scatter',
    name: 'Scatter Plot',
    category: 'basic',
    description: 'Show correlation between variables',
    icon: '⚫',
    requiredColumns: { x: 'numeric', y: 'numeric' },
  },

  // STATISTICAL CHARTS
  {
    id: 'boxplot',
    name: 'Box Plot',
    category: 'statistical',
    description: 'Show distribution statistics',
    icon: '📦',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'heatmap',
    name: 'Heatmap',
    category: 'statistical',
    description: 'Show data density with colors',
    icon: '🔥',
    requiredColumns: { x: 'categorical', y: 'categorical' },
  },
  {
    id: 'histogram',
    name: 'Histogram',
    category: 'statistical',
    description: 'Show frequency distribution',
    icon: '📊',
    requiredColumns: { x: 'numeric' },
  },

  // SPECIALIZED CHARTS
  {
    id: 'funnel',
    name: 'Funnel Chart',
    category: 'specialized',
    description: 'Show conversion stages',
    icon: '🔻',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'gauge',
    name: 'Gauge Chart',
    category: 'specialized',
    description: 'Show single value with scale',
    icon: '⏱️',
    requiredColumns: { y: 'numeric' },
  },
  {
    id: 'radar',
    name: 'Radar Chart',
    category: 'specialized',
    description: 'Compare multiple variables',
    icon: '🎯',
    requiredColumns: { x: 'categorical', y: 'numeric', multiple: true },
  },
  {
    id: 'treemap',
    name: 'Treemap',
    category: 'specialized',
    description: 'Show hierarchical data',
    icon: '🗂️',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'sunburst',
    name: 'Sunburst',
    category: 'specialized',
    description: 'Hierarchical data in circular layout',
    icon: '☀️',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
  {
    id: 'sankey',
    name: 'Sankey Diagram',
    category: 'specialized',
    description: 'Show flow between nodes',
    icon: '🌊',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },

  // ADVANCED CHARTS
  {
    id: 'candlestick',
    name: 'Candlestick',
    category: 'advanced',
    description: 'Financial OHLC data',
    icon: '🕯️',
    requiredColumns: { x: 'date', y: 'numeric', multiple: true },
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    category: 'advanced',
    description: 'Show cumulative effect',
    icon: '🌊',
    requiredColumns: { x: 'categorical', y: 'numeric' },
  },
];

export const CHART_CATEGORIES = {
  basic: 'Basic Charts',
  statistical: 'Statistical',
  specialized: 'Specialized',
  geographic: 'Geographic',
  timeseries: 'Time Series',
  advanced: 'Advanced',
};
