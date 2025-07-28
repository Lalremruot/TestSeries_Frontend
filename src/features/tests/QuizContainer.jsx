import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const QuizContainer = () => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    topics: [],
    questions: [],
    durationMinutes: 30
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: '',
    marks: 1,
    negativeMarks: 0.25
  });

  const [newTopic, setNewTopic] = useState('');

  const handleAddTopic = () => {
    const trimmed = newTopic.trim();
    if (trimmed && !quiz.topics.includes(trimmed)) {
      setQuiz(prev => ({
        ...prev,
        topics: [...prev.topics, trimmed]
      }));
      setNewTopic('');
    }
  };

  const handleAddQuestion = () => {
    const hasText = currentQuestion.questionText.trim().length > 0;
    const hasValidOption = currentQuestion.options.some(opt => opt.text.trim() !== '');
    const hasCorrect = currentQuestion.options.some(opt => opt.isCorrect);

    if (hasText && hasValidOption && hasCorrect) {
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion]
      }));
      setCurrentQuestion({
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        explanation: '',
        marks: 1,
        negativeMarks: 0.25
      });
    } else {
      alert("Please complete the question, ensure at least one option is marked correct.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/free-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
      });

      if (response.ok) {
        alert('Quiz created successfully!');
        setQuiz({
          title: '',
          description: '',
          topics: [],
          questions: [],
          durationMinutes: 30
        });
      } else {
        const error = await response.json();
        alert(`Failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create quiz');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Metadata */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>

          <div className="space-y-4">
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Quiz Title"
              required
              className="w-full p-2 border rounded"
            />

            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Quiz Description"
              className="w-full p-2 border rounded"
            />

            <input
              type="number"
              value={quiz.durationMinutes}
              onChange={(e) =>
                setQuiz(prev => ({
                  ...prev,
                  durationMinutes: Math.max(1, parseInt(e.target.value) || 1)
                }))
              }
              min="1"
              className="w-full p-2 border rounded"
              placeholder="Duration in Minutes"
              required
            />

            {/* Topic Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add a topic"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Show topics */}
            <div className="flex flex-wrap gap-2">
              {quiz.topics.map((topic, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {topic}
                  <button
                    onClick={() =>
                      setQuiz(prev => ({
                        ...prev,
                        topics: prev.topics.filter((_, i) => i !== index)
                      }))
                    }
                    type="button"
                    className="ml-2 text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Add Question */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Add Question</h3>

          <textarea
            value={currentQuestion.questionText}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
            className="w-full p-2 border rounded mb-4"
            rows="2"
            placeholder="Enter question"
          />

          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={option.isCorrect}
                onChange={() => {
                  const updatedOptions = currentQuestion.options.map((opt, i) => ({
                    ...opt,
                    isCorrect: i === index
                  }));
                  setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
                }}
              />
              <input
                type="text"
                value={option.text}
                onChange={(e) => {
                  const updated = [...currentQuestion.options];
                  updated[index].text = e.target.value;
                  setCurrentQuestion(prev => ({ ...prev, options: updated }));
                }}
                className="flex-1 p-2 border rounded"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={currentQuestion.marks}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseFloat(e.target.value) || 1 }))}
              className="p-2 border rounded"
              placeholder="Marks"
              min="0"
            />
            <input
              type="number"
              value={currentQuestion.negativeMarks}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, negativeMarks: parseFloat(e.target.value) || 0 }))}
              className="p-2 border rounded"
              placeholder="Negative Marks"
              min="0"
            />
          </div>

          <textarea
            value={currentQuestion.explanation}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
            className="w-full p-2 border rounded mt-4"
            rows="2"
            placeholder="Explanation"
          />

          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Question
          </button>
        </div>

        {/* Questions Preview */}
        {quiz.questions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Questions Added ({quiz.questions.length})
            </h3>

            {quiz.questions.map((q, i) => (
              <div key={i} className="border p-4 rounded mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Q{i + 1}: {q.questionText}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Correct: {q.options.find(opt => opt.isCorrect)?.text || 'Not set'}
                    </p>
                    <p className="text-sm text-gray-500">Marks: {q.marks} | Negative: {q.negativeMarks}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setQuiz(prev => ({
                        ...prev,
                        questions: prev.questions.filter((_, idx) => idx !== i)
                      }))
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={quiz.questions.length === 0}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizContainer;
