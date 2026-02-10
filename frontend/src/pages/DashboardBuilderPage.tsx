import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChartLibrary } from '../components/dashboard/ChartLibrary';
import { DashboardCanvas } from '../components/dashboard/DashboardCanvas';
import { TextBlockModal } from '../components/dashboard/TextBlockModal';
import type { ChartTypeDefinition } from '../types/chartTypes';

interface CanvasItem {
  id: string;
  type: 'chart' | 'text';
  chartType?: string;
  content?: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export function DashboardBuilderPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBackToData = () => {
    navigate('/dashboard');
  };

  const handleSelectChart = (chartType: ChartTypeDefinition) => {
    const newItem: CanvasItem = {
      id: `chart_${Date.now()}`,
      type: 'chart',
      chartType: chartType.name,
      position: {
        x: (items.length * 50) % 500,  // Stagger horizontally
        y: items.length * 20,            // Stagger vertically
        w: 400,                          // 400px width
        h: 300,                          // 300px height
      },
    };
    setItems([...items, newItem]);
  };

  const handleAddTextBlock = () => {
    const newItem: CanvasItem = {
      id: `text_${Date.now()}`,
      type: 'text',
      content: '',
      position: {
        x: (items.length * 50) % 500,
        y: items.length * 20,
        w: 400,                          // 400px width
        h: 80,                           // 80px height (small)
      },
    };
    setItems([...items, newItem]);
  };

  const handleItemClick = (item: CanvasItem) => {
    setSelectedItem(item);
    if (item.type === 'text') {
      setIsTextModalOpen(true);
    } else {
      alert(`Configure ${item.chartType}\n\nChart configuration coming next!`);
    }
  };

  const handleSaveTextBlock = (content: string) => {
    if (selectedItem) {
      setItems(items.map(i => 
        i.id === selectedItem.id ? { ...i, content } : i
      ));
    }
  };

  const handleSaveDashboard = () => {
    alert('Save dashboard functionality coming soon! 🚀');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={handleBackToData} className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Data
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard Builder</h1>
            <span className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSaveDashboard} className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">
              💾 Save Dashboard
            </button>
            <span className="text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <DashboardCanvas items={items} onItemsChange={setItems} onItemClick={handleItemClick} />
        </div>
        <div className="w-96">
          <ChartLibrary onSelectChart={handleSelectChart} onAddTextBlock={handleAddTextBlock} />
        </div>
      </div>

      <TextBlockModal
        isOpen={isTextModalOpen}
        initialContent={selectedItem?.content || ''}
        onSave={handleSaveTextBlock}
        onClose={() => setIsTextModalOpen(false)}
      />
    </div>
  );
}
