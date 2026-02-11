import { useState, useEffect } from 'react';
import 'echarts-wordcloud'; // Import wordcloud extension

interface WordCloudChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function WordCloudChartConfig({ sheetData, onPreviewChange }: WordCloudChartConfigProps) {
  const [wordColumn, setWordColumn] = useState('');
  const [weightColumn, setWeightColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !wordColumn) return;

    const wordIndex = sheetData.headers.indexOf(wordColumn);
    if (wordIndex === -1) return;

    let cloudData;

    if (weightColumn) {
      const weightIndex = sheetData.headers.indexOf(weightColumn);
      if (weightIndex === -1) return;
      
      // Aggregate weights by word
      const wordMap = new Map<string, number>();
      sheetData.rows.forEach(row => {
        const word = row[wordIndex];
        const weight = parseFloat(row[weightIndex]) || 1;
        wordMap.set(word, (wordMap.get(word) || 0) + weight);
      });
      
      cloudData = Array.from(wordMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
    } else {
      // Count frequency of each word
      const wordMap = new Map<string, number>();
      sheetData.rows.forEach(row => {
        const word = row[wordIndex];
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
      
      cloudData = Array.from(wordMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
    }

    const config = {
      title: { 
        text: title || 'Word Cloud', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          return `${params.name}: ${params.value}`;
        }
      },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        keepAspect: false,
        left: 'center',
        top: 'center',
        width: '90%',
        height: '80%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            const colors = [
              '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
              '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333'
          }
        },
        data: cloudData
      }],
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [wordColumn, weightColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">☁️ Configure Word Cloud</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Word Cloud"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Word Column *
          </label>
          <select
            value={wordColumn}
            onChange={(e) => setWordColumn(e.target.value)}
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
            Weight/Frequency Column (Optional)
          </label>
          <select
            value={weightColumn}
            onChange={(e) => setWeightColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Auto (count frequency)</option>
            {sheetData?.headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Words are sized by frequency or weight. Larger values = bigger words. Auto-aggregates duplicate words!
          </p>
        </div>
      </div>
    </div>
  );
}
