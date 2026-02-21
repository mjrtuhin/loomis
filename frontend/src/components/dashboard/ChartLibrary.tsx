import { useState } from 'react';

interface ChartLibraryProps {
  onChartSelect: (chartType: string) => void;
  onAddTextBlock: () => void;
}

const CHART_CATEGORIES = {
  'Basic Charts': [
    { type: 'bar', name: 'Bar Chart', icon: '📊', description: 'Compare values across categories' },
    { type: 'line', name: 'Line Chart', icon: '📈', description: 'Show trends over time' },
    { type: 'pie', name: 'Pie Chart', icon: '🥧', description: 'Show proportions' },
    { type: 'horizontalBar', name: 'Horizontal Bar', icon: '📊', description: 'Horizontal comparison' },
    { type: 'area', name: 'Area Chart', icon: '📉', description: 'Filled line chart' },
    { type: 'smoothLine', name: 'Smooth Line', icon: '〰️', description: 'Curved line chart' },
    { type: 'stackedBar', name: 'Stacked Bar', icon: '📊', description: 'Part-to-whole bars' },
  ],
  'Statistical': [
    { type: 'boxplot', name: 'Box Plot', icon: '📦', description: 'Show distribution quartiles' },
    { type: 'violin', name: 'Violin Plot', icon: '🎻', description: 'Distribution comparison' },
    { type: 'heatmap', name: 'Heatmap', icon: '🔥', description: 'Color-coded matrix' },
    { type: 'candlestick', name: 'Candlestick', icon: '🕯️', description: 'OHLC financial data' },
    { type: 'radar', name: 'Radar Chart', icon: '🎯', description: 'Multi-dimensional comparison' },
    { type: 'parallelCoordinates', name: 'Parallel Coordinates', icon: '📊', description: 'Multi-variable analysis' },
  ],
  'Advanced Scatter': [
    { type: 'effectScatter', name: 'Effect Scatter', icon: '✨', description: 'Animated scatter points' },
    { type: 'bubbleScatter', name: 'Bubble Chart', icon: '🫧', description: '3-variable scatter' },
  ],
  'Specialized': [
    { type: 'funnel', name: 'Funnel Chart', icon: '🔻', description: 'Conversion stages' },
    { type: 'gauge', name: 'Gauge Chart', icon: '⏱️', description: 'Progress indicator' },
    { type: 'liquidFill', name: 'Liquid Fill', icon: '💧', description: 'Percentage fill' },
    { type: 'wordCloud', name: 'Word Cloud', icon: '☁️', description: 'Word frequency' },
    { type: 'polarBar', name: 'Polar Bar/Rose', icon: '🌹', description: 'Circular bar chart' },
  ],
  'Flow & Hierarchy': [
    { type: 'sankey', name: 'Sankey Diagram', icon: '🔄', description: 'Flow visualization' },
    { type: 'networkGraph', name: 'Network Graph', icon: '🕸️', description: 'Node relationships' },
    { type: 'treemap', name: 'Treemap', icon: '📦', description: 'Hierarchical rectangles' },
    { type: 'themeRiver', name: 'ThemeRiver', icon: '🌊', description: 'Flowing time series' },
  ],
  'Time-based': [
    { type: 'calendarHeatmap', name: 'Calendar Heatmap', icon: '📅', description: 'GitHub-style calendar' },
    { type: 'gantt', name: 'Gantt Chart', icon: '📅', description: 'Project timeline' },
  ],
  'Geographic': [
    { type: 'geopoints', name: 'Geo Points', icon: '📍', description: 'Plot locations with coordinates' },
    { type: 'regionalMap', name: 'Regional Map', icon: '🗺️', description: 'Color regions by value' },
  ],
  '3D Charts': [
    { type: 'line3D', name: '3D Line', icon: '🎲', description: '3D line trajectory' },
    { type: 'bar3D', name: '3D Bar', icon: '📊', description: '3D bar chart' },
    { type: 'scatter3D', name: '3D Scatter', icon: '🎯', description: '3D scatter plot' },
  ],
};

export function ChartLibrary({ onChartSelect, onAddTextBlock }: ChartLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(CHART_CATEGORIES))
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = Object.entries(CHART_CATEGORIES).map(([category, charts]) => ({
    category,
    charts: charts.filter(chart =>
      chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chart.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(({ charts }) => charts.length > 0);

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Chart Library</h2>
        
        {/* Add Text Block Button */}
        <button
          onClick={onAddTextBlock}
          className="w-full mb-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">
                Add Text Block
              </h4>
              <p className="text-sm text-purple-600">
                Add titles, descriptions, or notes
              </p>
            </div>
          </div>
        </button>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search charts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chart Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredCategories.map(({ category, charts }) => (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
              <span className="font-medium text-gray-900">{category}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedCategories.has(category) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Chart Cards */}
            {expandedCategories.has(category) && (
              <div className="p-3 space-y-2">
                {charts.map((chart) => (
                  <button
                    key={chart.type}
                    onClick={() => onChartSelect(chart.type)}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{chart.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {chart.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{chart.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No charts found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          32 Professional Charts Available
        </p>
      </div>
    </div>
  );
}
