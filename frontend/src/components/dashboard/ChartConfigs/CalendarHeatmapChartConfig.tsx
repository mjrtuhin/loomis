import { useState, useEffect } from 'react';

interface CalendarHeatmapChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function CalendarHeatmapChartConfig({ sheetData, onPreviewChange }: CalendarHeatmapChartConfigProps) {
  const [dateColumn, setDateColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (!sheetData || !dateColumn || !valueColumn) return;

    const dateIndex = sheetData.headers.indexOf(dateColumn);
    const valueIndex = sheetData.headers.indexOf(valueColumn);
    if (dateIndex === -1 || valueIndex === -1) return;

    const calendarData = sheetData.rows.map(row => [
      row[dateIndex],
      parseFloat(row[valueIndex]) || 0
    ]);

    const config = {
      title: { 
        text: title || `Activity Calendar ${year}`, 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          return `${params.value[0]}<br/>Value: ${params.value[1]}`;
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...calendarData.map(d => d[1] as number)),
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        bottom: 20,
        inRange: {
          color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
        },
        pieces: [
          { min: 0, max: 0, color: '#ebedf0' },
          { min: 1, max: 25, color: '#9be9a8' },
          { min: 26, max: 50, color: '#40c463' },
          { min: 51, max: 75, color: '#30a14e' },
          { min: 76, color: '#216e39' }
        ]
      },
      calendar: {
        top: 80,
        left: 50,
        right: 30,
        cellSize: ['auto', 13],
        range: year,
        itemStyle: {
          borderWidth: 3,
          borderColor: '#fff'
        },
        yearLabel: { show: false },
        dayLabel: {
          nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          fontSize: 10
        },
        monthLabel: {
          nameMap: 'en',
          fontSize: 12
        }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: calendarData
      }],
      animation: true,
      animationDuration: 1000
    };

    onPreviewChange(config);
  }, [dateColumn, valueColumn, title, year, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📅 Configure Calendar Heatmap</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Activity Calendar"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Column * (Format: YYYY-MM-DD)
          </label>
          <select
            value={dateColumn}
            onChange={(e) => setDateColumn(e.target.value)}
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
            Value Column *
          </label>
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 GitHub-style contribution calendar! Shows daily activity patterns. Green intensity = value magnitude. Perfect for tracking habits!
          </p>
        </div>
      </div>
    </div>
  );
}
