import { useEffect, useState } from "react";
import axiosInstance from "../../api";

const QuestionCard = ({ question, index }) => {
  if (!question) return null;

  return (
    <div className="border p-4 rounded shadow mb-4">
      <p className="font-semibold mb-2">
        Q{index + 1}. {question.questionText}
      </p>

      <div className="space-y-2">
        {question.options.map((opt) => (
          <label key={opt._id} className="block cursor-pointer">
            <input
              type="radio"
              name={`question-${question._id}`}
              value={opt.option}
              className="mr-2"
            />
            {opt.option}. {opt.text}
          </label>
        ))}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Marks: {question.marks} | Negative: {question.negativeMarks}
      </div>
    </div>
  );
};

export default QuestionCard;
