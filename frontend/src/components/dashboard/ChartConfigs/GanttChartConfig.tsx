import { useState, useEffect } from 'react';
import { validateDateColumn, validateColumnExists } from '../../../utils/chartValidation';

interface GanttChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GanttChartConfig({ sheetData, onPreviewChange }: GanttChartConfigProps) {
  const [taskColumn, setTaskColumn] = useState('');
  const [startDateColumn, setStartDateColumn] = useState('');
  const [endDateColumn, setEndDateColumn] = useState('');
  const [categoryColumn, setCategoryColumn] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    if (!sheetData || !taskColumn || !startDateColumn || !endDateColumn) return;

    // Validation
    const taskValidation = validateColumnExists(sheetData.headers, taskColumn);
    if (!taskValidation.isValid) {
      setError(taskValidation.error!);
      return;
    }

    const startIndex = sheetData.headers.indexOf(startDateColumn);
    const startValidation = validateDateColumn(sheetData.rows, startIndex, startDateColumn);
    if (!startValidation.isValid) {
      setError(startValidation.error!);
      return;
    }

    const endIndex = sheetData.headers.indexOf(endDateColumn);
    const endValidation = validateDateColumn(sheetData.rows, endIndex, endDateColumn);
    if (!endValidation.isValid) {
      setError(endValidation.error!);
      return;
    }

    const taskIndex = sheetData.headers.indexOf(taskColumn);
    let categoryIndex = -1;
    if (categoryColumn) {
      categoryIndex = sheetData.headers.indexOf(categoryColumn);
    }

    // Validate date ranges
    const invalidRanges: number[] = [];
    sheetData.rows.forEach((row, idx) => {
      const start = new Date(row[startIndex]);
      const end = new Date(row[endIndex]);
      if (end < start) {
        invalidRanges.push(idx + 1);
      }
    });

    if (invalidRanges.length > 0) {
      setError(`End date before start date at rows: ${invalidRanges.slice(0, 5).join(', ')}${invalidRanges.length > 5 ? '...' : ''}`);
      return;
    }

    const tasks = sheetData.rows.map((row) => ({
      name: row[taskIndex],
      startDate: new Date(row[startIndex]),
      endDate: new Date(row[endIndex]),
      category: categoryIndex !== -1 ? row[categoryIndex] : 'Task'
    }));

    const categories = categoryIndex !== -1 
      ? [...new Set(sheetData.rows.map(row => row[categoryIndex]))]
      : ['Task'];

    const seriesData = tasks.map((task, idx) => ({
      name: task.name,
      value: [
        categories.indexOf(task.category),
        task.startDate.getTime(),
        task.endDate.getTime(),
        task.endDate.getTime() - task.startDate.getTime()
      ],
      itemStyle: {
        normal: {
          color: `hsl(${(idx * 40) % 360}, 70%, 60%)`
        }
      }
    }));

    const config = {
      title: { 
        text: title || 'Gantt Chart', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          const start = new Date(params.value[1]);
          const end = new Date(params.value[2]);
          const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          return `${params.name}<br/>Start: ${start.toLocaleDateString()}<br/>End: ${end.toLocaleDateString()}<br/>Duration: ${duration} days`;
        }
      },
      grid: {
        left: '15%',
        right: '10%',
        top: '15%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: (value: number) => new Date(value).toLocaleDateString()
        }
      },
      yAxis: {
        type: 'category',
        data: categories,
        inverse: true
      },
      series: [{
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;

          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
            },
            style: api.style({
              fill: params.itemStyle.normal.color
            })
          };
        },
        encode: {
          x: [1, 2],
          y: 0
        },
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        }
      }],
      animation: true,
      animationDuration: 1000
    };

    onPreviewChange(config);
  }, [taskColumn, startDateColumn, endDateColumn, categoryColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📅 Configure Gantt Chart</h3>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Timeline"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Name Column *</label>
          <select
            value={taskColumn}
            onChange={(e) => setTaskColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select column...</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date Column *</label>
            <select
              value={startDateColumn}
              onChange={(e) => setStartDateColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date Column *</label>
            <select
              value={endDateColumn}
              onChange={(e) => setEndDateColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category/Phase Column (Optional)</label>
          <select
            value={categoryColumn}
            onChange={(e) => setCategoryColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None (single row)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">💡 Dates must be valid (YYYY-MM-DD). End date must be after start date!</p>
        </div>
      </div>
    </div>
  );
}
