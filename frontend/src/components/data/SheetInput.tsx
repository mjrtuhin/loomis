import { useState, FormEvent } from 'react';

interface SheetInputProps {
  onLoadSheet: (url: string) => void;
  loading: boolean;
  error: string | null;
}

export function SheetInput({ onLoadSheet, loading, error }: SheetInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onLoadSheet(url.trim());
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Load Data from Google Sheets
      </h2>
      <p className="text-gray-600 mb-6">
        Paste your Google Sheets URL below. Make sure the sheet is public (Anyone with the link can view).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Google Sheets URL
          </label>
          <input
            id="sheetUrl"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            disabled={loading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Example: https://docs.google.com/spreadsheets/d/1ABC.../edit
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading data from Google Sheets...
            </span>
          ) : (
            'Load Data'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How to make your sheet public:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open your Google Sheet</li>
          <li>Click "Share" button (top right)</li>
          <li>Click "Change to anyone with the link"</li>
          <li>Set permission to "Viewer"</li>
          <li>Click "Done" and copy the URL</li>
        </ol>
      </div>
    </div>
  );
}
