import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';
import { toast } from 'react-toastify';

import { Clock, HelpCircle, Check, X, Flag } from 'lucide-react';

const FreeQuizInstructions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const response = await axiosInstance.get(`/api/free-quiz/${quizId}`);
      setQuizData(response.data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      toast.error('Failed to load quiz data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (!accepted) {
      toast.warn('Please accept the terms and conditions to continue');
      return;
    }
    navigate(`/free-quiz-interface/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading quiz instructions...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz Not Found</h3>
          <p className="text-gray-500 mb-6">The quiz you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Quiz Instructions</h1>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">
                {quizData.title}
              </span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Quiz Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{quizData.title}</h2>
            {quizData.description && (
              <p className="text-gray-600 mb-4">{quizData.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-500">{quizData.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Questions</p>
                  <p className="text-sm text-gray-500">{quizData.totalQuestions} questions</p>
                </div>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Max Attempts</p>
                  <p className="text-sm text-gray-500">{quizData.maxAttempts} attempts</p>
                </div>
              </div>
            </div>
          </div>



          {/* Question Palette Legend */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Palette</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-100 border border-red-300 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Not Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-100 border border-purple-300 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Marked for Review</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Not Visited</span>
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="p-6">
            <div className="flex items-start mb-6">
              <input
                id="declaration"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="declaration" className="ml-3 text-sm text-gray-700">
                I have read and understood all the instructions. I agree to take this quiz fairly and will not use any unfair means during the examination.
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartQuiz}
                disabled={!accepted}
                className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeQuizInstructions; 