import { Rnd } from 'react-rnd';
import { ChartRenderer } from './ChartRenderer';

interface CanvasItem {
  id: string;
  type: 'chart' | 'text';
  chartType?: string;
  content?: string;
  chartConfig?: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface DashboardCanvasProps {
  items: CanvasItem[];
  onItemsChange: (items: CanvasItem[]) => void;
  onItemClick: (item: CanvasItem) => void;
}

export function DashboardCanvas({ items, onItemsChange, onItemClick }: DashboardCanvasProps) {
  const handleDragStop = (id: string, d: { x: number; y: number }) => {
    onItemsChange(
      items.map(item =>
        item.id === id
          ? { ...item, position: { ...item.position, x: d.x, y: d.y } }
          : item
      )
    );
  };

  const handleResizeStop = (
    id: string,
    ref: HTMLElement,
    position: { x: number; y: number }
  ) => {
    onItemsChange(
      items.map(item =>
        item.id === id
          ? {
              ...item,
              position: {
                x: position.x,
                y: position.y,
                w: parseInt(ref.style.width),
                h: parseInt(ref.style.height),
              },
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto relative">
      {items.length === 0 ? (
        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Start Building Your Dashboard
            </h3>
            <p className="text-gray-500">
              Click on charts from the library on the right to add them here
            </p>
          </div>
        </div>
      ) : (
        <>
          {items.map(item => (
            <Rnd
              key={item.id}
              position={{ x: item.position.x, y: item.position.y }}
              size={{ width: item.position.w, height: item.position.h }}
              onDragStop={(e, d) => handleDragStop(item.id, d)}
              onResizeStop={(e, direction, ref, delta, position) =>
                handleResizeStop(item.id, ref, position)
              }
              minWidth={100}
              minHeight={30}
              bounds={undefined}
              dragHandleClassName="drag-handle"
              className="group"
            >
              <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all overflow-hidden">
                <div className="drag-handle flex items-center justify-between px-2 bg-gray-50 border-b border-gray-100 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ height: '28px' }}>
                  <span className="text-gray-300 text-xs select-none">⠿⠿⠿</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:bg-blue-50 text-blue-600 border border-blue-200 text-xs"
                      title="Configure"
                    >
                      ⚙️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:bg-red-50 text-red-600 border border-red-200 text-xs"
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-auto min-h-0">
                  {item.type === 'chart' ? (
                    item.chartConfig ? (
                      <ChartRenderer config={item.chartConfig} />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl mb-2">📊</div>
                          <p className="text-sm text-gray-500">Click ⚙️ to configure</p>
                          <p className="text-xs text-gray-400 mt-1">{item.chartType}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="h-full w-full">
                      {item.content ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: item.content }}
                          className="prose prose-sm max-w-none"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📝</div>
                            <p className="text-sm">Click ⚙️ to add text</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Rnd>
          ))}
        </>
      )}
    </div>
  );
}
