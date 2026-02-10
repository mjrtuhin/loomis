import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetchSheet } from '../hooks/useFetchSheet';
import { useNavigate } from 'react-router-dom';
import { SheetInput } from '../components/data/SheetInput';
import { DataQualityReport } from '../components/data/DataQualityReport';
import { IssuesList } from '../components/data/IssuesList';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data, quality, loading, error, fetchSheet, reset } = useFetchSheet();
  const [sheetUrl, setSheetUrl] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLoadSheet = (url: string) => {
    setSheetUrl(url);
    fetchSheet(url);
  };

  const handleReload = () => {
    if (sheetUrl) {
      fetchSheet(sheetUrl);
    }
  };

  const handleBuildDashboard = () => {
    // TODO: Navigate to dashboard builder
    alert('Dashboard builder coming in next phase! 🚀');
  };

  const handleReset = () => {
    reset();
    setSheetUrl('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">LOOMIS ENGINE</h1>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!data && !loading && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Create Your Data Visualization
              </h2>
              <p className="text-gray-600">
                Start by loading data from your Google Sheets
              </p>
            </div>
            <SheetInput onLoadSheet={handleLoadSheet} loading={loading} error={error} />
          </>
        )}

        {data && quality && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleReset}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Load Different Sheet
            </button>

            {/* Data Quality Report */}
            <DataQualityReport
              quality={quality}
              onReload={handleReload}
              onBuildDashboard={handleBuildDashboard}
            />

            {/* Issues List */}
            <IssuesList issues={quality.issues} />

            {/* Data Preview */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {data.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.rows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {cell || <span className="text-gray-400 italic">empty</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.rows.length > 5 && (
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Showing first 5 of {data.rows.length} rows
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
