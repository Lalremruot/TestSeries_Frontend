import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api';
import { toast } from 'react-toastify';

import { Clock, Check, X, Flag, Eye, EyeOff } from 'lucide-react';

const FreeQuizInterface = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(true);
  
  const testContainerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0 && quizData) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  useEffect(() => {
    // Security features
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.warning("Right-click is disabled during the quiz.");
    };

    const handleCopyPaste = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        toast.warning("Copy-paste is disabled during the quiz.");
      }
    };

    const handleDevTools = (e) => {
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        toast.warning("Developer tools are disabled during the quiz.");
      }
    };

    const handlePrintScreen = (e) => {
      if (e.key === 'PrintScreen' || ((e.ctrlKey || e.metaKey) && e.key === 'p')) {
        e.preventDefault();
        toast.warning("Print screen is disabled during the quiz.");
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.warning("Please stay on this tab during the quiz.");
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleCopyPaste);
    document.addEventListener('keydown', handleDevTools);
    document.addEventListener('keydown', handlePrintScreen);
    document.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleCopyPaste);
      document.removeEventListener('keydown', handleDevTools);
      document.removeEventListener('keydown', handlePrintScreen);
      document.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const startQuiz = async () => {
    try {
      const response = await axiosInstance.post(`/api/free-quiz/${quizId}/start`);
      setQuizData(response.data.quiz);
      setTimeLeft(response.data.quiz.duration * 60); // Convert to seconds
      startTimeRef.current = Date.now();
      setLoading(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
      navigate('/');
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleMarkQuestion = () => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      const responses = Object.keys(answers).map(index => ({
        questionIndex: parseInt(index),
        selectedOption: answers[index],
        timeSpent: 0 // You can implement individual question timing if needed
      }));

      const response = await axiosInstance.post(`/api/free-quiz/${quizId}/submit`, {
        responses,
        timeTaken
      });

      toast.success('Quiz submitted successfully!');
      navigate('/free-quiz-result', { 
        state: { 
          result: response.data,
          quizData: quizData
        } 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const enterFullScreen = async () => {
    try {
      if (testContainerRef.current) {
        await testContainerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast.error("Failed to enter full-screen mode");
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      toast.error("Failed to exit full-screen mode");
    }
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (markedQuestions.has(index) && answers[index]) return 'marked-answered';
    if (markedQuestions.has(index)) return 'marked';
    if (answers[index]) return 'answered';
    return 'unvisited';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading quiz...</p>
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

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div 
      ref={testContainerRef}
      className="min-h-screen bg-gray-50 select-none"
      style={{ userSelect: 'none' }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {quizData.title}
              </h1>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Full Screen Toggle */}
              <button
                onClick={toggleFullScreen}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                {isFullScreen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="ml-2">{isFullScreen ? 'Exit' : 'Full Screen'}</span>
              </button>

              {/* Timer */}
              <div className="flex items-center px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <Clock className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <button
                    onClick={handleMarkQuestion}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      markedQuestions.has(currentQuestionIndex)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {markedQuestions.has(currentQuestionIndex) ? 'Marked' : 'Mark'}
                  </button>
                </div>
                
                <p className="text-gray-700 mb-4">{currentQuestion.questionText}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestionIndex] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                        answers[currentQuestionIndex] === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestionIndex] === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-700 mr-3">{option}.</span>
                      <span className="text-gray-700 flex-1">{currentQuestion.options[option]}</span>
                      {answers[currentQuestionIndex] === option && (
                        <Check className="w-4 h-4 text-blue-500 ml-2" />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(quizData.questions.length - 1, prev + 1))}
                  disabled={currentQuestionIndex === quizData.questions.length - 1}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette */}
          {showQuestionPalette && (
            <div className="w-80 bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Question Palette</h3>
                <button
                  onClick={() => setShowQuestionPalette(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quizData.questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isCurrent = index === currentQuestionIndex;
                  
                  let bgColor = 'bg-gray-100 text-gray-700';
                  let borderColor = 'border-gray-200';
                  
                  if (isCurrent) {
                    bgColor = 'bg-blue-100 text-blue-700';
                    borderColor = 'border-blue-300';
                  } else if (status === 'answered') {
                    bgColor = 'bg-green-100 text-green-700';
                    borderColor = 'border-green-300';
                  } else if (status === 'marked') {
                    bgColor = 'bg-purple-100 text-purple-700';
                    borderColor = 'border-purple-300';
                  } else if (status === 'marked-answered') {
                    bgColor = 'bg-purple-100 text-purple-700';
                    borderColor = 'border-purple-300';
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`w-8 h-8 rounded border-2 text-xs font-medium transition-colors ${bgColor} ${borderColor} hover:opacity-80`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded mr-2"></div>
                  <span className="text-gray-600">Marked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
                  <span className="text-gray-600">Not Visited</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeQuizInterface; 