import { useState } from 'react';
import { CHART_TYPES, CHART_CATEGORIES } from '../../types/chartTypes';
import type { ChartTypeDefinition } from '../../types/chartTypes';

interface ChartLibraryProps {
  onSelectChart: (chartType: ChartTypeDefinition) => void;
  onAddTextBlock: () => void;
}

export function ChartLibrary({ onSelectChart, onAddTextBlock }: ChartLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCharts = CHART_TYPES.filter(chart => {
    const matchesSearch = chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chart.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedCharts = filteredCharts.reduce((acc, chart) => {
    if (!acc[chart.category]) {
      acc[chart.category] = [];
    }
    acc[chart.category].push(chart);
    return acc;
  }, {} as Record<string, ChartTypeDefinition[]>);

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
        <input
          type="text"
          placeholder="Search charts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(CHART_CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Charts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedCharts).map(([category, charts]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              {CHART_CATEGORIES[category as keyof typeof CHART_CATEGORIES]}
            </h3>
            <div className="space-y-2">
              {charts.map(chart => (
                <button
                  key={chart.id}
                  onClick={() => onSelectChart(chart)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{chart.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {chart.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {chart.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredCharts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No charts found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
