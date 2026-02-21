import type { QualityIssue } from '../../types/data';

interface IssuesListProps {
  issues: QualityIssue[];
}

export function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Issues Found!</h3>
        <p className="text-gray-600">Your data is clean and ready to use.</p>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'INFO':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return '🔴';
      case 'WARNING':
        return '🟡';
      case 'INFO':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const errorIssues = issues.filter(i => i.severity === 'ERROR');
  const warningIssues = issues.filter(i => i.severity === 'WARNING');
  const infoIssues = issues.filter(i => i.severity === 'INFO');

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        ⚠️ Issues Found ({issues.length})
      </h3>

      <div className="flex gap-4 mb-6">
        {errorIssues.length > 0 && (
          <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {errorIssues.length} Errors
          </div>
        )}
        {warningIssues.length > 0 && (
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {warningIssues.length} Warnings
          </div>
        )}
        {infoIssues.length > 0 && (
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {infoIssues.length} Info
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {issues.map((issue, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg ${getSeverityBadge(issue.severity)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{getSeverityIcon(issue.severity)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{issue.severity}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-700">
                    Row {issue.row}, Column "{issue.column}"
                  </span>
                </div>
                <p className="text-sm font-medium">{issue.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {issues.length > 10 && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          Showing all {issues.length} issues
        </p>
      )}
    </div>
  );
}
