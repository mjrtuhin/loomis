import { useState, useEffect } from 'react';

interface CandlestickChartConfigProps {
  sheetData: { headers: string[]; rows: string[][] } | null;
  onPreviewChange: (config: any) => void;
}

export function CandlestickChartConfig({ sheetData, onPreviewChange }: CandlestickChartConfigProps) {
  const [dateColumn, setDateColumn] = useState('');
  const [openColumn, setOpenColumn] = useState('');
  const [highColumn, setHighColumn] = useState('');
  const [lowColumn, setLowColumn] = useState('');
  const [closeColumn, setCloseColumn] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!sheetData || !dateColumn || !openColumn || !highColumn || !lowColumn || !closeColumn) return;

    const dateIndex = sheetData.headers.indexOf(dateColumn);
    const openIndex = sheetData.headers.indexOf(openColumn);
    const highIndex = sheetData.headers.indexOf(highColumn);
    const lowIndex = sheetData.headers.indexOf(lowColumn);
    const closeIndex = sheetData.headers.indexOf(closeColumn);

    if (dateIndex === -1 || openIndex === -1 || highIndex === -1 || lowIndex === -1 || closeIndex === -1) return;

    const dates = sheetData.rows.map(row => row[dateIndex]);
    const candlestickData = sheetData.rows.map(row => [
      parseFloat(row[openIndex]) || 0,
      parseFloat(row[closeIndex]) || 0,
      parseFloat(row[lowIndex]) || 0,
      parseFloat(row[highIndex]) || 0
    ]);

    const config = {
      title: { 
        text: title || 'Candlestick Chart (Kline)', 
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: (params: any) => {
          const data = params[0].data;
          return `${params[0].name}<br/>
                  Open: ${data[1]}<br/>
                  Close: ${data[2]}<br/>
                  Low: ${data[3]}<br/>
                  High: ${data[4]}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          bottom: 10,
          start: 0,
          end: 100
        }
      ],
      series: [{
        name: 'Candlestick',
        type: 'candlestick',
        data: candlestickData,
        itemStyle: {
          color: '#ef5350',
          color0: '#26a69a',
          borderColor: '#ef5350',
          borderColor0: '#26a69a'
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };

    onPreviewChange(config);
  }, [dateColumn, openColumn, highColumn, lowColumn, closeColumn, title, sheetData, onPreviewChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Configure Candlestick Chart (Kline)</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Stock Price Chart"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date/Time Column *
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Price *
            </label>
            <select
              value={openColumn}
              onChange={(e) => setOpenColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Close Price *
            </label>
            <select
              value={closeColumn}
              onChange={(e) => setCloseColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              High Price *
            </label>
            <select
              value={highColumn}
              onChange={(e) => setHighColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Price *
            </label>
            <select
              value={lowColumn}
              onChange={(e) => setLowColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {sheetData?.headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 Candlestick requires 5 columns: Date, Open, High, Low, Close (OHLC data). Green = price up, Red = price down. Includes zoom slider!
          </p>
        </div>
      </div>
    </div>
  );
}
