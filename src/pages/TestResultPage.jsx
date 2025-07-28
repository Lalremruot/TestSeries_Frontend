import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api";

const TestResultPage = () => {
  const { testId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axiosInstance.get(`/api/submission/${testId}`);
        setSubmission(res.data.submission);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch submission.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId]);

  if (loading) return <div className="p-6 text-center">Loading result...</div>;

  if (!submission)
    return <div className="p-6 text-center text-red-600">Submission not found.</div>;

  const questions = submission.questions || [];
  const responses = submission.responses || {};
  const totalQuestions = questions.length;
  const score = submission.score || 0;
  const scorePercentage =
    totalQuestions > 0 ? ((score / (totalQuestions * 4)) * 100).toFixed(2) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {submission.test?.title || "Test"} - Result
      </h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6 border">
        <p className="text-gray-800 mb-1">
          <strong>Total Score:</strong> {score}
        </p>
        <p className="text-gray-800 mb-1">
          <strong>Total Questions:</strong> {totalQuestions}
        </p>
        <p className="text-gray-800">
          <strong>Accuracy:</strong> {scorePercentage}%
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const userAnswer = responses[q._id] || null;
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div key={q._id} className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {index + 1}. {q.title}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let style = "border-gray-200";

                  if (opt === q.correctAnswer) {
                    style = "border-green-500 bg-green-100";
                  } else if (opt === userAnswer && userAnswer !== q.correctAnswer) {
                    style = "border-red-500 bg-red-100";
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-2 border rounded ${style}`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-sm">
                <span
                  className={`font-medium ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Your Answer: {userAnswer || "Not Answered"} —{" "}
                  {isCorrect ? "Correct" : "Wrong"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestResultPage;
