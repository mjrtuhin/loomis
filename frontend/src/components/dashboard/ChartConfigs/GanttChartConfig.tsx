import { useState, useEffect } from 'react';
import { validateColumnExists } from '../../../utils/chartValidation';

interface GanttChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function GanttChartConfig({ sheetData, onPreviewChange }: GanttChartConfigProps) {
  const [taskColumn, setTaskColumn] = useState('');
  const [startColumn, setStartColumn] = useState('');
  const [endColumn, setEndColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !taskColumn || !startColumn || !endColumn) {
      onPreviewChange(null);
      return;
    }

    const taskValidation = validateColumnExists(sheetData.headers, taskColumn);
    if (!taskValidation.isValid) {
      onPreviewChange({ error: taskValidation.error });
      return;
    }

    const startValidation = validateColumnExists(sheetData.headers, startColumn);
    if (!startValidation.isValid) {
      onPreviewChange({ error: startValidation.error });
      return;
    }

    const endValidation = validateColumnExists(sheetData.headers, endColumn);
    if (!endValidation.isValid) {
      onPreviewChange({ error: endValidation.error });
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    const tasks = formattedRows.map((row, idx) => ({
      name: String(row[taskColumn]),
      value: [
        idx,
        new Date(row[startColumn]).getTime(),
        new Date(row[endColumn]).getTime()
      ]
    }));

    const taskNames = formattedRows.map(row => String(row[taskColumn]));

    const config = {
      title: { text: title || 'Gantt Chart', left: 'center' },
      tooltip: { formatter: (params: any) => params.name },
      xAxis: { type: 'time' },
      yAxis: { type: 'category', data: taskNames },
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
            style: api.style()
          };
        },
        encode: { x: [1, 2], y: 0 },
        data: tasks
      }],
      _columnMetadata: {
        task: taskColumn,
        start: startColumn,
        end: endColumn,
        chartType: 'gantt'
      }
    };

    onPreviewChange(config);
  }, [sheetData, taskColumn, startColumn, endColumn, title]);

  if (!sheetData) {
    return <div className="text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Gantt Chart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task Name Column</label>
        <select
          value={taskColumn}
          onChange={(e) => setTaskColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date Column</label>
        <select
          value={startColumn}
          onChange={(e) => setStartColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date Column</label>
        <select
          value={endColumn}
          onChange={(e) => setEndColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 Project timeline visualization with task start and end dates
        </p>
      </div>
    </div>
  );
}
