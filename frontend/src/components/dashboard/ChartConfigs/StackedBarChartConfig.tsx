import { useState, useEffect } from 'react';

interface StackedBarChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function StackedBarChartConfig({ sheetData, onPreviewChange }: StackedBarChartConfigProps) {
  const [categoryColumn, setCategoryColumn] = useState('');
  const [selectedValueColumns, setSelectedValueColumns] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const toggleColumn = (column: string) => {
    setSelectedValueColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (!sheetData || !categoryColumn || selectedValueColumns.length === 0) return;

    const categoryIndex = sheetData.headers.indexOf(categoryColumn);
    if (categoryIndex === -1) return;

    const categories = sheetData.rows.map(row => row[categoryIndex]);

    const series = selectedValueColumns.map((col, idx) => {
      const colIndex = sheetData.headers.indexOf(col);
      if (colIndex === -1) return null;

      const data = sheetData.rows.map(row => parseFloat(row[colIndex]) || 0);

      return {
        name: col,
        type: 'bar',
        stack: 'total',
        data: data,
        emphasis: {
          focus: 'series'
        },
        label: {
          show: false
        }
      };
    }).filter(Boolean);

    const config = {
      title: { 
        text: title || 'Stacked Bar Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          let total = 0;
          params.forEach((item: any) => {
            total += item.value;
            result += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
          });
          result += `<strong>Total: ${total}</strong>`;
          return result;
        }
      },
      legend: {
        data: selectedValueColumns,
        bottom: 0,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: series,
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [categoryColumn, selectedValueColumns, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Configure Stacked Bar Chart</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Stacked Bar Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Column (X-Axis) *
          </label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Columns (Stack Segments) *
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
            {sheetData?.headers.map((header) => (
              <label key={header} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={selectedValueColumns.includes(header)}
                  onChange={() => toggleColumn(header)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{header}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {selectedValueColumns.length} columns selected
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Perfect for part-to-whole comparison! Each bar shows total with color-coded segments. Hover shows breakdown + total!
          </p>
        </div>
      </div>
    </div>
  );
}
