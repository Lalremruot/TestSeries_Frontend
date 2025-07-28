// PerformancePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '../../api';
import { useAuth } from '../hooks/useContext';
import { toast } from 'react-toastify';

export default function UserPerformance() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.warn("Please login to view your performance.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we have test result data passed from TestInterface, use it
        if (location.state?.testResult) {
          setPerformance(location.state.testResult);
          setLoading(false);
          return;
        }

        // Otherwise fetch from backend
        const res = await axiosInstance.get(`/api/performance/details/${testId}`);
        setPerformance(res.data);
      } catch (err) {
        console.error('Error fetching performance:', err);
        toast.error('Failed to load performance data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [testId, user, location.state]);

  // Function to format numbers in Indian numbering system
  const formatIndianNumber = (num) => {
    if (num === null || num === undefined) return '0';
    const numStr = num.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
  };

  // Get performance grade and color
  const getPerformanceGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#059669', bgColor: '#f0fdf4' };
    if (percentage >= 80) return { grade: 'A', color: '#059669', bgColor: '#f0fdf4' };
    if (percentage >= 70) return { grade: 'B+', color: '#2563eb', bgColor: '#f8fafc' };
    if (percentage >= 60) return { grade: 'B', color: '#2563eb', bgColor: '#f8fafc' };
    if (percentage >= 50) return { grade: 'C+', color: '#d97706', bgColor: '#fffbeb' };
    if (percentage >= 40) return { grade: 'C', color: '#d97706', bgColor: '#fffbeb' };
    return { grade: 'D', color: '#dc2626', bgColor: '#fef2f2' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading performance report...</p>
        </div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Data</h3>
          <p className="text-gray-500 mb-6 text-sm">No performance data available for this test.</p>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const timeChartData = performance.timePerQuestion?.map((time, i) => ({
    question: `Q${i + 1}`,
    time
  })) || [];

  const pieChartData = [
    { name: 'Correct', value: performance.correct, color: '#059669' },
    { name: 'Incorrect', value: performance.incorrect, color: '#dc2626' },
    { name: 'Unanswered', value: (performance.totalQuestions || performance.attempted + (performance.totalMarks - performance.score)) - performance.attempted, color: '#6b7280' }
  ];

  const performanceGrade = getPerformanceGrade(performance.percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Performance Report</h1>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Info Card */}
        {location.state?.testData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {location.state.testData.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    Test completed successfully
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date().toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Performance Grade</div>
                <div 
                  className="text-2xl font-bold px-3 py-1 rounded-md"
                  style={{ 
                    color: performanceGrade.color, 
                    backgroundColor: performanceGrade.bgColor 
                  }}
                >
                  {performanceGrade.grade}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Score</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatIndianNumber(performance.score)} / {formatIndianNumber(performance.totalMarks)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Percentage</p>
                <p className="text-xl font-semibold text-gray-900">
                  {performance.percentage?.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Accuracy</p>
                <p className="text-xl font-semibold text-gray-900">
                  {performance.accuracy?.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Time Taken</p>
                <p className="text-lg font-semibold text-gray-900">
                  {performance.readableTimeTaken || `${Math.floor(performance.totalTimeTaken / 60)}m ${performance.totalTimeTaken % 60}s`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Distribution Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Question Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Analysis Chart */}
          {timeChartData.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Time Per Question</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeChartData}>
                    <XAxis dataKey="question" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="time" fill="#6b7280" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Question Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Total Questions</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatIndianNumber(performance.totalQuestions || performance.attempted + (performance.totalMarks - performance.score))}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Attempted</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatIndianNumber(performance.attempted)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Correct Answers</span>
                <span className="text-sm font-medium text-green-600">
                  {formatIndianNumber(performance.correct)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Incorrect Answers</span>
                <span className="text-sm font-medium text-red-600">
                  {formatIndianNumber(performance.incorrect)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Unanswered</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatIndianNumber((performance.totalQuestions || performance.attempted + (performance.totalMarks - performance.score)) - performance.attempted)}
                </span>
              </div>
            </div>
          </div>

          {/* Time Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Time Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Total Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {performance.readableTimeTaken || `${Math.floor(performance.totalTimeTaken / 60)}m ${performance.totalTimeTaken % 60}s`}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Average Time/Question</span>
                <span className="text-sm font-medium text-gray-900">
                  {performance.averageTimePerQuestion?.toFixed(1)}s
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Questions per Minute</span>
                <span className="text-sm font-medium text-gray-900">
                  {performance.attempted > 0 ? (performance.attempted / (performance.totalTimeTaken / 60)).toFixed(1) : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">Efficiency Score</span>
                <span className="text-sm font-medium text-gray-900">
                  {performance.attempted > 0 ? Math.round((performance.correct / performance.attempted) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/performance-dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View All Results
          </button>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Take Another Test
          </button>
        </div>
      </div>
    </div>
  );
}
