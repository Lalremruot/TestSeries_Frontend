import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SectionTabs from './SectionTabs';
import QuestionCard from './QuestionCard';
import TestFooterControls from './TestFooterControls';

const TestScreen = ({ testSlug }) => {
  const [testData, setTestData] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    axios.get(`/api/tests/${testSlug}`).then(res => {
      setTestData(res.data);
      setActiveSection(res.data.sections[0]?.subject);
      setTimeLeft(res.data.totalDuration);
    });
  }, [testSlug]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit(); // auto-submit on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testData]);

  const handleOptionSelect = (section, qIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [`${section}-${qIndex}`]: { selected: selectedOption, status: 'answered' }
    }));
  };

  const handleMarkForReview = () => {
    const key = `${activeSection}-${currentQuestion}`;
    setAnswers(prev => ({
      ...prev,
      [key]: { ...(prev[key] || {}), status: 'marked' }
    }));
    handleNext();
  };

  const handleClearResponse = () => {
    const key = `${activeSection}-${currentQuestion}`;
    setAnswers(prev => ({
      ...prev,
      [key]: { selected: null, status: 'not answered' }
    }));
  };

  const handleNext = () => {
    const currentSection = testData.sections.find(s => s.subject === activeSection);
    if (currentQuestion + 1 < currentSection.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    await axios.post('/api/tests/submit', {
      testId: testData._id,
      answers,
      timeTaken: testData.totalDuration - timeLeft
    });
    alert('Test submitted!');
    // Redirect to result page if needed
  };

  if (!testData) return <div>Loading...</div>;

  const currentSection = testData.sections.find(s => s.subject === activeSection);
  const currentQ = currentSection.questions[currentQuestion];
  const qKey = `${activeSection}-${currentQuestion}`;
  const currentAnswer = answers[qKey]?.selected;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{testData.title}</h2>
        <span className="text-red-500 font-bold">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>

      <SectionTabs
        sections={testData.sections}
        activeSection={activeSection}
        onTabClick={(subj) => {
          setActiveSection(subj);
          setCurrentQuestion(0);
        }}
        answers={answers}
      />

      <QuestionCard
        section={activeSection}
        questionIndex={currentQuestion}
        question={currentQ}
        selectedOption={currentAnswer}
        onSelect={handleOptionSelect}
      />

      <TestFooterControls
        onNext={handleNext}
        onClear={handleClearResponse}
        onMark={handleMarkForReview}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TestScreen;
