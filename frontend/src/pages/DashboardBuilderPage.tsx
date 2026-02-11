import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { ChartLibrary } from '../components/dashboard/ChartLibrary';
import { DashboardCanvas } from '../components/dashboard/DashboardCanvas';
import { TextBlockModal } from '../components/dashboard/TextBlockModal';
import { ChartConfigModal } from '../components/dashboard/ChartConfigModal';
import { dashboardService } from '../services/firestore';

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

const REFRESH_INTERVALS = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 360, label: '6 hours' },
  { value: 720, label: '12 hours' },
  { value: 1440, label: '24 hours' },
];

export function DashboardBuilderPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const sheetData = location.state?.sheetData || null;
  const googleSheetUrl = location.state?.googleSheetUrl || '';
  const initialDashboardId = location.state?.dashboardId || null;
  const initialItems = location.state?.items || [];
  const initialRefreshInterval = location.state?.refreshInterval || 60;
  
  const [items, setItems] = useState<CanvasItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [dashboardId, setDashboardId] = useState<string | null>(initialDashboardId);
  const [refreshInterval, setRefreshInterval] = useState(initialRefreshInterval);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!hasUnsavedChanges || !dashboardId) return;
    const autoSaveTimer = setTimeout(() => {
      saveDashboard(true);
    }, 30000);
    return () => clearTimeout(autoSaveTimer);
  }, [items, hasUnsavedChanges, dashboardId]);

  useEffect(() => {
    if (items.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [items]);

  const handleRefreshData = useCallback(async () => {
    console.log('🔄 Refreshing data from Google Sheets...');
  }, [googleSheetUrl]);

  const { 
    isRefreshing, 
    refresh: manualRefresh, 
    formatCountdown 
  } = useAutoRefresh({
    intervalMinutes: refreshInterval,
    onRefresh: handleRefreshData,
    enabled: !!dashboardId
  });

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Do you want to save before logging out?');
      if (confirm) {
        await saveDashboard();
      }
    }
    await logout();
    navigate('/');
  };

  const handleBackToData = async () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Do you want to save before leaving?');
      if (confirm) {
        await saveDashboard();
      }
    }
    navigate('/dashboards');
  };

  const handleSelectChart = (chartType: string) => {
    const newItem: CanvasItem = {
      id: `chart_${Date.now()}`,
      type: 'chart',
      chartType: chartType,
      position: {
        x: (items.length * 50) % 500,
        y: items.length * 20,
        w: 400,
        h: 300,
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
        w: 400,
        h: 80,
      },
    };
    setItems([...items, newItem]);
  };

  const handleItemClick = (item: CanvasItem) => {
    setSelectedItem(item);
    if (item.type === 'text') {
      setIsTextModalOpen(true);
    } else if (item.type === 'chart') {
      setIsChartModalOpen(true);
    }
  };

  const handleSaveTextBlock = (content: string) => {
    if (selectedItem) {
      setItems(items.map(i => 
        i.id === selectedItem.id ? { ...i, content } : i
      ));
    }
  };

  const handleSaveChart = (config: any) => {
    if (selectedItem) {
      setItems(items.map(i =>
        i.id === selectedItem.id ? { ...i, chartConfig: config } : i
      ));
    }
  };

  const saveDashboard = async (isAutoSave = false) => {
    if (!user) {
      alert('⚠️ You must be logged in to save dashboards.');
      return;
    }

    setIsSaving(true);
    try {
      if (dashboardId) {
        await dashboardService.update(dashboardId, items, refreshInterval);
        if (!isAutoSave) {
          alert('✅ Dashboard updated successfully!');
        }
      } else {
        const newDashboardId = await dashboardService.create(
          user.uid,
          googleSheetUrl,
          items,
          refreshInterval
        );
        setDashboardId(newDashboardId);
        alert('✅ Dashboard saved successfully!');
      }
      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error('❌ Save failed:', error);
      alert(`❌ Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDashboard = () => {
    saveDashboard(false);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Not Logged In</h2>
          <p className="text-gray-700 mb-6">You must be logged in to use the dashboard builder.</p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={handleBackToData} className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Dashboards
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900">LOOMIS ENGINE</h1>
            <span className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-600 font-medium">● Unsaved changes</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Refresh:</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md"
              >
                {REFRESH_INTERVALS.map(interval => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>

            {dashboardId && (
              <div className="text-sm text-gray-600">
                Next refresh: <span className="font-mono">{formatCountdown()}</span>
              </div>
            )}

            <button
              onClick={manualRefresh}
              disabled={isRefreshing}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50"
            >
              {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Now'}
            </button>

            <button
              onClick={handleSaveDashboard}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? '💾 Saving...' : '💾 Save Dashboard'}
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
          <ChartLibrary onChartSelect={handleSelectChart} onAddTextBlock={handleAddTextBlock} />
        </div>
      </div>

      <TextBlockModal
        isOpen={isTextModalOpen}
        initialContent={selectedItem?.content || ''}
        onSave={handleSaveTextBlock}
        onClose={() => setIsTextModalOpen(false)}
      />

      <ChartConfigModal
        isOpen={isChartModalOpen}
        chartType={selectedItem?.chartType || 'bar'}
        sheetData={sheetData}
        onSave={handleSaveChart}
        onClose={() => setIsChartModalOpen(false)}
      />
    </div>
  );
}
