import type { QualityReport } from '../../types/data';

interface DataQualityReportProps {
  quality: QualityReport;
  onReload: () => void;
  onBuildDashboard: () => void;
}

export function DataQualityReport({ quality, onReload, onBuildDashboard }: DataQualityReportProps) {
  const getBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const hasErrors = quality.issues.some(issue => issue.severity === 'ERROR');
  const canBuildDashboard = quality.score >= 90 && !hasErrors;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Data Quality Report</h2>

        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${getBadgeColor(quality.score)}`}>
            <span className="text-3xl font-bold mr-2">{quality.score}%</span>
            <span className="text-lg font-semibold">{getScoreLabel(quality.score)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Rows</p>
            <p className="text-2xl font-bold text-gray-900">{quality.totalRows}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Columns</p>
            <p className="text-2xl font-bold text-gray-900">{quality.totalColumns}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Clean Rows</p>
            <p className="text-2xl font-bold text-green-700">{quality.cleanRows}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 mb-1">Rows with Issues</p>
            <p className="text-2xl font-bold text-red-700">{quality.issueRows}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">{quality.issues.length}</span> total issues detected
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onReload}
            className="px-6 py-3 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            🔄 Reload
          </button>
        </div>
      </div>

      {canBuildDashboard ? (
        <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-2">✅ Data is Clean!</h3>
              <p className="text-green-700">Your data quality is excellent. Ready to build your dashboard.</p>
            </div>
            <button
              onClick={onBuildDashboard}
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg"
            >
              Build Dashboard →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-2 border-yellow-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-900 mb-2">⚠️ Data Needs Attention</h3>
          <p className="text-yellow-700 mb-4">
            {hasErrors
              ? 'Please fix the ERROR issues below before building your dashboard.'
              : 'Your data quality score is below 90%. Consider fixing the issues below for best results.'}
          </p>
          <button
            disabled
            className="px-8 py-4 bg-gray-300 text-gray-500 text-lg font-semibold rounded-lg cursor-not-allowed"
          >
            Build Dashboard (Locked)
          </button>
        </div>
      )}
    </div>
  );
}
