import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateFreeQuiz = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    title: '',
    description: '',
    duration: 30,
    totalQuestions: 10,
    maxAttempts: 3,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: { A: '', B: '', C: '', D: '' },
    correctOption: 'A',
    explanation: '',
    difficulty: 'Medium'
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axiosInstance.get('/api/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (option, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      toast.error('Please enter question text');
      return;
    }

    if (!currentQuestion.options.A || !currentQuestion.options.B || 
        !currentQuestion.options.C || !currentQuestion.options.D) {
      toast.error('Please fill all options');
      return;
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      questionText: '',
      options: { A: '', B: '', C: '', D: '' },
      correctOption: 'A',
      explanation: '',
      difficulty: 'Medium'
    });

    setQuestionIndex(prev => prev + 1);
    toast.success(`Question ${questionIndex + 1} added successfully`);
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    setQuestionIndex(prev => prev - 1);
    toast.success('Question removed successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    if (formData.questions.length !== parseInt(formData.totalQuestions)) {
      toast.error(`Number of questions (${formData.questions.length}) doesn't match total questions (${formData.totalQuestions})`);
      return;
    }

    setLoading(true);
    try {
      const quizData = {
        topicId: formData.topicId,
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        totalQuestions: formData.totalQuestions,
        maxAttempts: formData.maxAttempts,
        questions: formData.questions
      };

      await axiosInstance.post('/api/free-quiz', quizData);

      toast.success('Free quiz created successfully!');
      navigate('/admin/free-quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error(error.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Create Free Quiz</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new free quiz for students to practice
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Quiz Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <select
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a topic</option>
                  {topics.map(topic => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Questions *
                </label>
                <input
                  type="number"
                  name="totalQuestions"
                  value={formData.totalQuestions}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attempts
                </label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={formData.maxAttempts}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quiz description"
              />
            </div>



            {/* Questions Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Questions</h2>
              
              {/* Current Question Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-4">
                  Question {questionIndex + 1}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      name="questionText"
                      value={currentQuestion.questionText}
                      onChange={handleQuestionChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map(option => (
                      <div key={option}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Option {option} *
                        </label>
                        <input
                          type="text"
                          value={currentQuestion.options[option]}
                          onChange={(e) => handleOptionChange(option, e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter option ${option}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Option *
                      </label>
                      <select
                        name="correctOption"
                        value={currentQuestion.correctOption}
                        onChange={handleQuestionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={currentQuestion.difficulty}
                        onChange={handleQuestionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation
                    </label>
                    <textarea
                      name="explanation"
                      value={currentQuestion.explanation}
                      onChange={handleQuestionChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter explanation for the correct answer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Question
                  </button>
                </div>
              </div>

              {/* Added Questions List */}
              {formData.questions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Added Questions ({formData.questions.length})
                  </h4>
                  {formData.questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Q{index + 1}: {question.questionText.substring(0, 50)}...
                        </p>
                        <p className="text-xs text-gray-500">
                          Correct: {question.correctOption} | Difficulty: {question.difficulty}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/free-quizzes')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFreeQuiz; 