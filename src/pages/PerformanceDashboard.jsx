import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';

const PerformanceDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    if (user?._id) {
      fetchAnalytics();
      fetchPerformances();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get(`/api/performance/analytics/${user._id}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchPerformances = async () => {
    try {
      const response = await axiosInstance.get(`/api/performance/user/${user._id}`);
      setPerformances(response.data);
    } catch (error) {
      console.error('Error fetching performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (performance) => {
    // Navigate to the detailed performance page with the test result data
    navigate(`/user-performance/${performance.test?._id || performance.testId}`, {
      state: {
        testResult: {
          score: performance.obtainedMarks,
          totalMarks: performance.totalMarks,
          percentage: performance.percentage,
          accuracy: performance.accuracy,
          attempted: performance.attempted || 0,
          correct: performance.correct || 0,
          incorrect: performance.incorrect || 0,
          totalTimeTaken: performance.timeTaken,
          readableTimeTaken: formatDuration(performance.timeTaken),
          averageTimePerQuestion: performance.averageTimePerQuestion || 0,
          totalQuestions: performance.totalQuestions || 0,
          timePerQuestion: performance.timePerQuestion || []
        },
        testData: {
          title: performance.test?.title || 'Test'
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your performance data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Dashboard</h1>
          <p className="text-gray-600">Track your progress and analyze your performance across all tests</p>
        </div>

        {/* Overall Stats Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-sm text-gray-500 mb-1">Total Tests</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalTests}</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm text-gray-500 mb-1">Overall Accuracy</div>
              <div className={`text-2xl font-bold ${getPerformanceColor(analytics.overallAccuracy).split(' ')[0]}`}>
                {analytics.overallAccuracy}%
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-sm text-gray-500 mb-1">Total Questions</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalQuestions}</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-sm text-gray-500 mb-1">Avg Time/Question</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(analytics.averageTimePerQuestion)}s
              </div>
            </div>
          </div>
        )}

        {/* Subject-wise Performance */}
        {analytics?.subjectAnalytics && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(analytics.subjectAnalytics).map(([subject, stats]) => (
                <div key={subject} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{subject}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className={`font-medium ${getPerformanceColor(stats.accuracy).split(' ')[0]}`}>
                        {stats.accuracy}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Questions:</span>
                      <span>{stats.totalQuestions}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Correct:</span>
                      <span className="text-green-600">{stats.correctAnswers}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Avg Time:</span>
                      <span>{Math.round(stats.averageTime)}s</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{stats.correctAnswers}/{stats.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getPerformanceColor(stats.accuracy).split(' ')[1]}`}
                          style={{ width: `${stats.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Performances */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Test Performances</h2>
          
          {performances.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No test performances yet. Start taking tests to see your results!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performances.slice(0, 10).map((performance) => (
                    <tr key={performance._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {performance.test?.title || 'Test'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(performance.completedAt || performance.startedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <span className="font-medium text-green-600">
                            {performance.obtainedMarks}
                          </span>
                          <span className="text-gray-500">/{performance.totalMarks}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {performance.percentage}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(performance.accuracy)}`}>
                          {performance.accuracy}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDuration(performance.timeTaken)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          performance.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : performance.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {performance.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(performance)}
                          className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Performance Insights */}
        {analytics?.recentPerformances?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weak Areas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Areas for Improvement</h3>
              
              {analytics.recentPerformances[0]?.weakSubjects?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentPerformances[0].weakSubjects.slice(0, 5).map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-800">{subject}</span>
                      <span className="text-xs text-red-600">Needs attention</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No weak areas identified. Keep up the good work!</p>
              )}
            </div>

            {/* Strong Areas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Strong Areas</h3>
              
              {analytics.recentPerformances[0]?.strongSubjects?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentPerformances[0].strongSubjects.slice(0, 5).map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">{subject}</span>
                      <span className="text-xs text-green-600">Excellent</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Keep practicing to identify your strong areas!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;