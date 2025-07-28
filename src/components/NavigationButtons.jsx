import { useEffect, useState } from "react";
import axiosInstance from "../../api";

const NavigationButtons = ({ index, setIndex, sectionId }) => {
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (!sectionId) return;
      const { data } = await axiosInstance.get(`/api/question/section/${sectionId}`);
      setTotalQuestions(data.length);
    };
    fetchCount();
  }, [sectionId]);

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        disabled={index <= 0}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        ← Previous
      </button>

      <span className="text-sm text-gray-600">
        Question {index + 1} of {totalQuestions}
      </span>

      <button
        onClick={() => setIndex((i) => Math.min(i + 1, totalQuestions - 1))}
        disabled={index >= totalQuestions - 1}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next →
      </button>
    </div>
  );
};

export default NavigationButtons;
