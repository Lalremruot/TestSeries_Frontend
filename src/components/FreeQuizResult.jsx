import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Clock, Check, X, HelpCircle, Download, Play } from 'lucide-react';
import { toast } from 'react-toastify';

const FreeQuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
      setQuizData(location.state.quizData);
      setLoading(false);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleDownloadPDF = () => {
    toast.info('PDF download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result || !quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500 mb-6">No quiz results available.</p>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const performanceGrade = getPerformanceGrade(result.percentage);

  const pieChartData = [
    { name: 'Correct', value: result.correctAnswers, color: '#059669' },
    { name: 'Incorrect', value: result.incorrectAnswers, color: '#dc2626' },
    { name: 'Unanswered', value: result.unansweredQuestions, color: '#6b7280' }
  ];

  const timeChartData = result.responses?.map((response, i) => ({
    question: `Q${i + 1}`,
    time: response.timeSpent || 0
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Quiz Results</h1>
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
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {quizData.title}
              </h2>
              {quizData.description && (
                <p className="text-sm text-gray-600 mb-2">{quizData.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Quiz completed successfully
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(result.timeTaken)}
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Correct Answers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatIndianNumber(result.correctAnswers)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Incorrect Answers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatIndianNumber(result.incorrectAnswers)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Questions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatIndianNumber(result.totalQuestions)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatIndianNumber(result.score)}/{formatIndianNumber(result.totalQuestions)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Percentage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Percentage</h3>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.percentage / 100)}`}
                  className="text-blue-600"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{result.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Question Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Time per Question</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeChartData}>
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(`/free-quiz/${quizData.topicId}`)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeQuizResult; 