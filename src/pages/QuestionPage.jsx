import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api";

const QuestionPage = () => {
  const { sectionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // questionId: selectedOption

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get(`/api/questions/section/${sectionId}`);
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions", error.message);
      }
    };

    fetchQuestions();
  }, [sectionId]);

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4">
      {questions.length === 0 ? (
        <p className="text-gray-500 text-center">No questions available.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <h2 className="text-lg font-semibold mb-4">{currentQuestion.questionText}</h2>

          <ul className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <li key={idx}>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    checked={selectedOptions[currentQuestion._id] === option}
                    onChange={() => handleOptionSelect(currentQuestion._id, option)}
                    className="form-radio text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
