import { useState, useEffect } from 'react';
import { validateNumericColumn, validateColumnExists } from '../../../utils/chartValidation';
import { aggregateData } from '../../../utils/dataAggregation';

interface WordCloudChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function WordCloudChartConfig({ sheetData, onPreviewChange }: WordCloudChartConfigProps) {
  const [wordColumn, setWordColumn] = useState('');
  const [weightColumn, setWeightColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !wordColumn || !weightColumn) {
      onPreviewChange(null);
      return;
    }

    const wordValidation = validateColumnExists(sheetData.headers, wordColumn);
    if (!wordValidation.isValid) {
      onPreviewChange({ error: wordValidation.error });
      return;
    }

    const formattedRows = sheetData.rows.map(row => {
      const obj: any = {};
      sheetData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });

    const weightValidation = validateNumericColumn(sheetData.headers, formattedRows, weightColumn);
    if (!weightValidation.isValid) {
      onPreviewChange({ error: weightValidation.error });
      return;
    }

    const { categories, values } = aggregateData(formattedRows, wordColumn, weightColumn);

    const wordCloudData = categories.map((name, idx) => ({
      name,
      value: values[idx]
    }));

    const config = {
      title: { text: title || 'Word Cloud', left: 'center' },
      tooltip: {},
      series: [{
        type: 'wordCloud',
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: { fontFamily: 'sans-serif' },
        data: wordCloudData
      }],
      _columnMetadata: {
        word: wordColumn,
        weight: weightColumn,
        chartType: 'wordCloud'
      }
    };

    onPreviewChange(config);
  }, [sheetData, wordColumn, weightColumn, title]);

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
          placeholder="Word Cloud"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Word/Text Column</label>
        <select
          value={wordColumn}
          onChange={(e) => setWordColumn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select column</option>
          {sheetData.headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight/Frequency Column</label>
        <select
          value={weightColumn}
          onChange={(e) => setWeightColumn(e.target.value)}
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
          💡 <strong>Auto-aggregation:</strong> Duplicate words are automatically summed
        </p>
      </div>
    </div>
  );
}
