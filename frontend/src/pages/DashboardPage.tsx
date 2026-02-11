import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SheetInput } from '../components/data/SheetInput';
import { DataQualityReport } from '../components/data/DataQualityReport';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sheetUrl, setSheetUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [quality, setQuality] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLoadSheet = async (url: string) => {
    // CLEAR OLD DATA FIRST - THIS IS THE FIX
    setData(null);
    setQuality(null);
    setError(null);
    
    setLoading(true);
    setSheetUrl(url);

    try {
      const token = localStorage.getItem('firebaseToken');
      
      // Add timestamp to prevent caching
      const response = await fetch(`http://localhost:8080/api/sheets/analyze?t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load sheet');
      }

      const result = await response.json();
      console.log('✅ Loaded NEW sheet data:', result);
      setData(result.data);
      setQuality(result.quality);
    } catch (err: any) {
      console.error('❌ Error loading sheet:', err);
      setError(err.message || 'Failed to load sheet');
    } finally {
      setLoading(false);
    }
  };

  const handleBuildDashboard = () => {
    console.log('🚀 Building dashboard with data:', data);
    navigate('/dashboard/builder', { state: { sheetData: data, googleSheetUrl: sheetUrl } });
  };

  const handleReload = () => {
    if (sheetUrl) {
      handleLoadSheet(sheetUrl);
    }
  };

  const handleLoadDifferent = () => {
    setData(null);
    setQuality(null);
    setSheetUrl('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Your Data Visualization
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!data ? (
          <div>
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600">
                Start by loading data from your Google Sheets
              </p>
            </div>
            <SheetInput
              onLoadSheet={handleLoadSheet}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <DataQualityReport
            data={data}
            quality={quality}
            onReload={handleReload}
            onLoadDifferent={handleLoadDifferent}
            onBuildDashboard={handleBuildDashboard}
          />
        )}
      </main>
    </div>
  );
}
