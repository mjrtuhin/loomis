import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/firestore';
import type { Dashboard } from '../services/firestore';

export function DashboardListPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboards();
  }, [user]);

  const loadDashboards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userDashboards = await dashboardService.getUserDashboards(user.uid);
      setDashboards(userDashboards);
    } catch (error) {
      console.error('Failed to load dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/dashboard');
  };

  const handleOpenDashboard = (dashboard: Dashboard) => {
    const items = [
      ...dashboard.layout.charts,
      ...dashboard.layout.textBlocks
    ];

    navigate('/dashboard/builder', {
      state: {
        dashboardId: dashboard.id,
        googleSheetUrl: dashboard.googleSheetUrl,
        items: items,
        refreshInterval: dashboard.refreshInterval,
        sheetData: null
      }
    });
  };

  const handleDeleteDashboard = async (dashboardId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this dashboard?');
    if (!confirm) return;

    try {
      await dashboardService.delete(dashboardId);
      alert('✅ Dashboard deleted!');
      loadDashboards();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('❌ Failed to delete dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LOOMIS ENGINE</h1>
            <p className="text-sm text-gray-500">Made by Md Julfikar Rahman Tuhin</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Dashboards</h2>
            <p className="text-gray-600 mt-1">
              {dashboards.length} {dashboards.length === 1 ? 'dashboard' : 'dashboards'}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md"
          >
            ➕ Create New Dashboard
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboards...</p>
          </div>
        )}

        {!loading && dashboards.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No dashboards yet</h3>
            <p className="text-gray-600 mb-6">Create your first data visualization dashboard!</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Create Your First Dashboard
            </button>
          </div>
        )}

        {!loading && dashboards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm opacity-90">
                      {dashboard.layout.charts.length} charts • {dashboard.layout.textBlocks.length} text blocks
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    Dashboard #{dashboard.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    📄 Sheet ID: {dashboard.googleSheetUrl.split('/')[5]?.slice(0, 10) || 'Unknown'}...
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Updated: {formatDate(dashboard.updatedAt)}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenDashboard(dashboard)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm font-medium"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p className="font-medium">LOOMIS ENGINE</p>
          <p className="text-sm mt-1">Made with ❤️ by Md Julfikar Rahman Tuhin</p>
          <p className="text-xs mt-2 text-gray-500">Free & Open Source Data Visualization Platform</p>
        </div>
      </footer>
    </div>
  );
}
