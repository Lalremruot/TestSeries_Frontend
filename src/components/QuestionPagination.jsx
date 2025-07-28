const QuestionPagination = ({
  totalQuestions,
  currentQuestion,
  answeredStatus, // e.g. ['unvisited', 'answered', 'unanswered', ...]
  onNavigate,
}) => {
  const getStatusClass = (status, index) => {
    const base = "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer";
    if (index === currentQuestion) return `${base} bg-red-600 text-white`; // Current
    if (status === 'answered') return `${base} bg-green-500 text-white`;
    if (status === 'unanswered') return `${base} bg-yellow-400 text-black`;
    if (status === 'marked') return `${base} bg-purple-500 text-white`;
    return `${base} bg-gray-300`;
  };

  return (
    <div className="grid grid-cols-5 gap-2 p-3">
      {Array.from({ length: totalQuestions }, (_, i) => (
        <div
          key={i}
          className={getStatusClass(answeredStatus[i], i)}
          onClick={() => onNavigate(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default QuestionPagination;
