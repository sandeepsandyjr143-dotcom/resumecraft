import { useState } from 'react';
import { Target, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import api from "../../utils/api";

export default function ATSScore({ resumeData, jobRole, resumeId }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateScore = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/ai/ats-score', { resumeData, jobRole, resumeId });
      setScore(res.data);
    } catch (err) {
      setError('Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  const getColor = (total) => {
    if (total >= 80) return 'text-green-600';
    if (total >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getBgColor = (total) => {
    if (total >= 80) return 'bg-green-50 border-green-200';
    if (total >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">ATS Score</h3>
        </div>
        <button
          onClick={calculateScore}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : score ? 'Refresh' : 'Check Score'}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {!score && !loading && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">Click "Check Score" to analyze your resume</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-xs">AI analyzing your resume...</p>
        </div>
      )}

      {score && (
        <div>
          {/* Score circle */}
          <div className={`border rounded-xl p-4 mb-3 text-center ${getBgColor(score.total)}`}>
            <div className={`text-4xl font-bold ${getColor(score.total)}`}>{score.total}</div>
            <div className="text-gray-500 text-xs mt-1">out of 100</div>
            <div className={`text-sm font-medium mt-1 ${getColor(score.total)}`}>
              {score.total >= 80 ? '🎉 Excellent' : score.total >= 60 ? '⚡ Good' : '⚠️ Needs Work'}
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 mb-3">
            {Object.entries(score.breakdown || {}).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{val.score}/{val.max}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${val.score / val.max >= 0.7 ? 'bg-green-500' : val.score / val.max >= 0.5 ? 'bg-yellow-500' : 'bg-red-400'}`}
                    style={{ width: `${(val.score / val.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Top Issues */}
          {score.topIssues?.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" /> Issues to Fix
              </p>
              {score.topIssues.slice(0, 3).map((issue, i) => (
                <p key={i} className="text-xs text-red-600 mb-1">• {issue}</p>
              ))}
            </div>
          )}

          {/* Quick Wins */}
          {score.quickWins?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" /> Quick Wins
              </p>
              {score.quickWins.slice(0, 3).map((win, i) => (
                <p key={i} className="text-xs text-green-600 mb-1">• {win}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
