import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';
import { toast } from 'react-toastify';

import { Play, Clock, HelpCircle, Users } from 'lucide-react';

const FreeQuizList = () => {
  const { topicId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchQuizzes();
    fetchTopicName();
  }, [topicId]);

  const fetchQuizzes = async () => {
    try {
      const response = await axiosInstance.get(`/api/free-quiz/topic/${topicId}`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicName = async () => {
    try {
      const response = await axiosInstance.get(`/api/topics/${topicId}`);
      setTopicName(response.data.name);
    } catch (error) {
      console.error('Error fetching topic name:', error);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/free-quiz-instructions/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Free Quizzes - {topicName}
              </h1>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">
                Practice and improve your skills
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Free Quizzes Available</h3>
            <p className="text-gray-500 mb-6">
              There are no free quizzes available for this topic yet. Check back later!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Other Topics
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Free
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{quiz.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                                          <HelpCircle className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{quiz.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Unlimited attempts</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz._id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeQuizList; 