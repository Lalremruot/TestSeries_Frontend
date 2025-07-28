import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useContext";

const TestInterface = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [testData, setTestData] = useState(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // per-question timer
  const [testTimeLeft, setTestTimeLeft] = useState(0); // overall test timer
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For image modal
  const submittedRef = useRef(false);
  const { id: testId } = useParams(); // ✅ fix naming mismatch
  const navigate = useNavigate();
  const testContainerRef = useRef(null);

  const STATUS = {
    NOT_VISITED: "not_visited",
    VISITED: "visited",
    NOT_ANSWERED: "not_answered",
    MARK_AND_REVIEW: "mark_and_review",
    MARK_AND_ANSWERED: "mark_and_answered",
    ANSWERED: "answered",
  };

  // Get API base URL for images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Normalize path separators (convert Windows backslashes to forward slashes)
    const normalizedPath = imagePath.replace(/\\/g, '/');
    
    // If the path already starts with http/https, return as is
    if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
      return normalizedPath;
    }
    
    // If the path starts with uploads/, use the base API URL
    if (normalizedPath.startsWith('uploads/')) {
      const baseUrl = import.meta.env.VITE_BASE_API || 'http://localhost:5000';
      return `${baseUrl}/${normalizedPath}`;
    }
    
    // If it's a relative path, prepend the base URL
    const baseUrl = import.meta.env.VITE_BASE_API || 'http://localhost:5000';
    return `${baseUrl}/${normalizedPath}`;
  };

  // Fetch test data from API
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axiosInstance.get(`/api/tests/${id}`);
        // Fix: handle array response
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setTestData(data);
        // Initialize question status
        const initialStatus = {};
        data.subjects.forEach((subject, sIdx) => {
          subject.questions.forEach((_, qIdx) => {
            const questionId = `${sIdx}-${qIdx}`;
            initialStatus[questionId] = STATUS.NOT_VISITED;
          });
        });
        setQuestionStatus(initialStatus);
        // Set timer for first question
        if (data.subjects[0]?.questions[0]?.timeLimitSeconds) {
          setTimeLeft(data.subjects[0].questions[0].timeLimitSeconds);
        }
        // Set overall test timer
        if (data.duration) {
          setTestTimeLeft(data.duration * 60); // duration is in minutes
        }
      } catch (err) {
        setTestData(null);
      }
    };
    fetchTest();
  }, [id]);

  // Per-question timer effect
  useEffect(() => {
    if (!testData || testSubmitted) return;
    if (timeLeft <= 0) {
      handleAutoNext();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [timeLeft, testData, testSubmitted]);

  // Overall test timer effect
  useEffect(() => {
    if (!testData || testSubmitted) return;
    if (testTimeLeft <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setTestTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [testTimeLeft, testData, testSubmitted]);

  // When question changes, reset timer
  useEffect(() => {
    if (!testData) return;
    const q =
      testData.subjects[currentSubjectIndex]?.questions[currentQuestionIndex];
    if (q?.timeLimitSeconds) {
      setTimeLeft(q.timeLimitSeconds);
    }
  }, [currentSubjectIndex, currentQuestionIndex, testData]);

  useEffect(() => {
    if (!testData) return;
    const questionId = `${currentSubjectIndex}-${currentQuestionIndex}`;
    const currentStatus = questionStatus[questionId];
    if (currentStatus === STATUS.NOT_VISITED) {
      setQuestionStatus((prev) => ({ ...prev, [questionId]: STATUS.VISITED }));
    }
  }, [currentSubjectIndex, currentQuestionIndex, testData, questionStatus]);

  // Security and Full-screen functionality
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.warning("Right-click is disabled during the test.");
    };

    // Disable copy-paste
    const handleCopyPaste = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a') {
          e.preventDefault();
          toast.warning("Copy-paste is disabled during the test.");
        }
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleDevTools = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        toast.warning("Developer tools are disabled during the test.");
      }
    };

    // Disable print screen
    const handlePrintScreen = (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        toast.warning("Print screen is disabled during the test.");
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleCopyPaste);
    document.addEventListener('keydown', handleDevTools);
    document.addEventListener('keydown', handlePrintScreen);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleCopyPaste);
      document.removeEventListener('keydown', handleDevTools);
      document.removeEventListener('keydown', handlePrintScreen);
    };
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Prevent page leave during test
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!testSubmitted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !testSubmitted) {
        toast.warning("Please do not switch tabs or minimize the browser during the test.");
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testSubmitted]);

  if (!testData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading test...
      </div>
    );
  }

  const currentSubject = testData.subjects[currentSubjectIndex];
  const currentQuestion = currentSubject.questions[currentQuestionIndex];

  const currentQuestionId = `${currentSubjectIndex}-${currentQuestionIndex}`;

  // --- Status/Palette helpers ---
  const getQuestionStatusColor = (status) => {
    switch (status) {
      case STATUS.NOT_VISITED:
        return "bg-gray-300 text-gray-700";
      case STATUS.VISITED:
        return "bg-yellow-200 text-yellow-900 border border-yellow-400";
      case STATUS.NOT_ANSWERED:
        return "bg-red-200 text-red-900 border border-red-400";
      case STATUS.MARK_AND_REVIEW:
        return "bg-purple-200 text-purple-900 border border-purple-400";
      case STATUS.MARK_AND_ANSWERED:
        return "bg-purple-400 text-white border border-purple-700";
      case STATUS.ANSWERED:
        return "bg-green-300 text-green-900 border border-green-500";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  // --- Actions ---
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers((prev) => ({ ...prev, [currentQuestionId]: option }));
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQuestionId]: STATUS.ANSWERED,
    }));
  };

  const handleSaveAndNext = () => {
    if (selectedOption) {
      setAnswers((prev) => ({ ...prev, [currentQuestionId]: selectedOption }));
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestionId]: STATUS.ANSWERED,
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestionId]: STATUS.NOT_ANSWERED,
      }));
    }
    handleNextQuestion();
  };

  const handleMarkForReview = () => {
    if (selectedOption) {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestionId]: STATUS.MARK_AND_ANSWERED,
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestionId]: STATUS.MARK_AND_REVIEW,
      }));
    }
    handleNextQuestion();
  };

  const handleClearResponse = () => {
    setSelectedOption(null);
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestionId];
      return newAnswers;
    });
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQuestionId]: STATUS.VISITED,
    }));
  };

  // Next question logic: go to next subject if at end
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSubjectIndex < testData.subjects.length - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setSelectedOption(answers[`${currentSubjectIndex + 1}-0`] || null);
    } else {
      // Auto-submit when no more questions available
      handleSubmitTest();
      return;
    }
    if (
      !(
        currentQuestionIndex === currentSubject.questions.length - 1 &&
        currentSubjectIndex < testData.subjects.length - 1
      )
    ) {
      setSelectedOption(null);
    }
  };

  // Auto-advance on timer expiry
  const handleAutoNext = () => {
    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSubjectIndex < testData.subjects.length - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setSelectedOption(answers[`${currentSubjectIndex + 1}-0`] || null);
    } else {
      // Auto-submit when no more questions available
      handleSubmitTest();
      return;
    }
    setSelectedOption(null);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentQuestionIndex(currentSubject.questions.length - 1);
    }
    setSelectedOption(
      answers[`${currentSubjectIndex}-${currentQuestionIndex}`] || null
    );
  };

  const handleSubjectTabClick = (idx) => {
    setCurrentSubjectIndex(idx);
    setCurrentQuestionIndex(0);
    setSelectedOption(answers[`${idx}-0`] || null);
  };

  const refreshUserToken = async () => {
    try {
      const response = await axiosInstance.post("/api/user/auth/refresh-token", {
        phone: user.phone
      });
      
      const userData = {
        _id: response.data._id,
        phone: response.data.phone,
        isVerified: response.data.isVerified,
        token: response.data.token
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      window.location.reload(); // Reload to update the context
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  };

  // Full-screen functions
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

  const handleSubmitTest = async () => {
    if (!user) {
      toast.warn("Please login to submit the test.");
      navigate("/login", { state: { from: `/test/${id}` } });
      return;
    }

    // Debug: Log user data and token
    console.log("User data:", user);
    console.log("Token:", user.token);

    // Check if user has a token
    if (!user.token) {
      toast.info("Attempting to refresh authentication token...");
      const refreshed = await refreshUserToken();
      if (!refreshed) {
        toast.error("Authentication failed. Please login again.");
        logout();
        navigate("/login", { state: { from: `/test/${id}` } });
        return;
      }
      return; // Page will reload and retry
    }

    if (submittedRef.current || submitting) return;
    submittedRef.current = true;
    setSubmitting(true);

    if (!testData || !Array.isArray(testData.subjects)) {
      console.error("Invalid test data", testData);
      toast.error("Test data is not loaded correctly.");
      submittedRef.current = false;
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      const responses = [];
      let totalMarks = 0;
      let score = 0;
      let attempted = 0;
      let correct = 0;

      testData.subjects.forEach((subject, subjectIndex) => {
        subject.questions.forEach((q, questionIndex) => {
          const questionId = `${subjectIndex}-${questionIndex}`;
          const selectedOption = answers[questionId] ?? null;
          const isCorrect = selectedOption === q.correctOption;

          totalMarks += q.marks;

          if (selectedOption !== null) {
            attempted++;
            if (isCorrect) {
              score += q.marks;
              correct++;
            }
          }

          responses.push({
            subjectIndex,
            questionIndex,
            selectedOption,
            timeTaken: 0,
          });
        });
      });

      const incorrect = attempted - correct;
      const percentage = (score / totalMarks) * 100;
      const accuracy = (correct / attempted) * 100;
      const totalTimeTaken = testData.duration * 60 - testTimeLeft;

      const readableTimeTaken = `${Math.floor(totalTimeTaken / 60)} min ${totalTimeTaken % 60} sec`;
      const averageTimePerQuestion = attempted > 0 ? totalTimeTaken / attempted : 0;

      const resultData = {
        score,
        totalMarks,
        percentage,
        accuracy,
        attempted,
        correct,
        incorrect,
        totalTimeTaken,
        readableTimeTaken,
        averageTimePerQuestion,
        responses,
      };

      console.log("Test data structure:", testData);
      console.log("Answers object:", answers);
      console.log("Sending result data:", resultData);
      const response = await axiosInstance.post(`/api/performance/submit/${testId}`, resultData);

      setTestSubmitted(true);
      toast.success("Test submitted successfully");
      
      // Navigate to user performance page with the result data
      navigate(`/user-performance/${testId}`, { 
        state: { 
          testResult: resultData,
          testData: testData 
        } 
      });
    } catch (err) {
      console.error("Submit failed", err);
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to submit test.");
      submittedRef.current = false;
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // --- Status summary ---
  const paletteStats = () => {
    let attempted = 0,
      marked = 0,
      notVisited = 0,
      notAnswered = 0,
      markedAnswered = 0;
    testData.subjects.forEach((subject, sIdx) => {
      subject.questions.forEach((_, qIdx) => {
        const st = questionStatus[`${sIdx}-${qIdx}`];
        if (st === STATUS.ANSWERED) attempted++;
        else if (st === STATUS.MARK_AND_REVIEW) marked++;
        else if (st === STATUS.NOT_VISITED) notVisited++;
        else if (st === STATUS.NOT_ANSWERED) notAnswered++;
        else if (st === STATUS.MARK_AND_ANSWERED) markedAnswered++;
      });
    });
    return { attempted, marked, notVisited, notAnswered, markedAnswered };
  };
  const stats = paletteStats();

  // --- UI ---
  return (
    <div 
      ref={testContainerRef} 
      className="min-h-screen bg-gray-100 select-none"
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-3 border-b bg-white">
        <div className="text-2xl font-bold text-blue-900 tracking-tight">
          LOGO
        </div>
        <div className="text-lg font-semibold">{testData.title}</div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-3 py-1 rounded text-lg font-mono font-bold border border-gray-300">
            Time Left: {formatTime(testTimeLeft)}
          </div>
          <div className="flex items-center gap-2">
            {isFullScreen && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Full Screen Active
              </div>
            )}
            <button 
              onClick={toggleFullScreen}
              className="text-blue-700 underline text-sm hover:text-blue-900 transition-colors"
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Section Tabs */}
      <div className="flex items-center gap-2 px-8 py-2 bg-gray-50 border-b">
        <span className="font-semibold text-gray-700 mr-2">Sections |</span>
        {testData.subjects.map((subject, idx) => (
          <button
            key={subject.name}
            onClick={() => handleSubjectTabClick(idx)}
            className={`px-4 py-1 rounded font-semibold border text-sm mr-2 ${
              idx === currentSubjectIndex
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
            }`}
          >
            {subject.name}
          </button>
        ))}
      </div>
      
      {/* Main Layout */}
      <div className="flex w-full min-h-[calc(100vh-100px)]">
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col items-stretch px-8 py-6">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">
                Question {currentQuestionIndex + 1}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>Time: {formatTime(timeLeft)}</span>
                <span>
                  Marks:{" "}
                  <span className="text-green-600 font-bold">
                    +{currentQuestion.marks}
                  </span>{" "}
                  <span className="text-red-600 font-bold">
                    -{currentQuestion.negativeMarks}
                  </span>
                </span>
                <button className="text-gray-500 flex items-center gap-1 hover:text-red-600 text-xs">
                  <span>⚠️</span> Report
                </button>
              </div>
            </div>
            
            {/* Question Text */}
            <div className="mb-4 text-base font-medium">
              {currentQuestion.questionText}
            </div>
            
            {/* Display Diagram Images - Independent Section */}
            {currentQuestion.diagramImages && currentQuestion.diagramImages.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Question Diagrams:</div>
                <div className="flex flex-wrap gap-3">
                  {currentQuestion.diagramImages.map((imagePath, index) => {
                    const imageUrl = getImageUrl(imagePath);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                        <img
                          src={imageUrl}
                          alt={`Diagram ${index + 1}`}
                          className="max-w-full h-auto max-h-64 object-contain"
                          onClick={() => setSelectedImage(imageUrl)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Failed to load diagram image:', imagePath, 'URL:', imageUrl);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Options Section - Always Vertical */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">Select the correct option:</div>
              <div className="flex flex-col gap-4">
                {Object.entries(currentQuestion.options).map(([option, text]) => (
                  <div
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors text-base font-medium min-w-[120px] ${
                      selectedOption === option
                        ? "bg-gray-100 border-gray-400"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full border text-lg font-bold mr-4 ${
                        selectedOption === option
                          ? "bg-gray-700 text-white border-gray-700"
                          : "bg-white border-gray-400"
                      }`}
                    >
                      {option}
                    </span>
                    <div className="flex-1 text-left text-base font-medium">
                      {text}
                    </div>
                    {/* Option image, if any */}
                    {currentQuestion.optionImages && currentQuestion.optionImages[option] && (
                      <div className="ml-4">
                        <img
                          src={getImageUrl(currentQuestion.optionImages[option])}
                          alt={`Option ${option} Image`}
                          className="w-16 h-16 object-contain border border-gray-200 rounded"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedImage(getImageUrl(currentQuestion.optionImages[option]));
                          }}
                          onError={e => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-auto bg-white rounded-b-lg p-4 border-t">
            <div className="flex gap-3">
              <button
                onClick={handlePreviousQuestion}
                className="px-4 py-2 rounded bg-gray-100 text-gray-800 border border-gray-300 font-semibold hover:bg-purple-100"
              >
                ← Previous
              </button>
              <button
                onClick={handleMarkForReview}
                className="px-4 py-2 rounded bg-gray-100 text-gray-800 border border-gray-300 font-semibold hover:bg-purple-100"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClearResponse}
                className="px-4 py-2 rounded bg-gray-100 text-gray-800 border border-gray-300 font-semibold hover:bg-red-100"
              >
                Clear Response
              </button>
            </div>
            <button
              onClick={handleSaveAndNext}
              className="px-6 py-2 rounded bg-green-500 text-white font-bold text-lg hover:bg-green-600"
            >
              Save & Next
            </button>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-[340px] bg-[#1a2332] text-white flex flex-col p-4 min-h-full">
          {/* Status Summary */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-green-500 inline-block"></span>{" "}
              {stats.attempted} Attempted
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-yellow-400 inline-block"></span>{" "}
              {stats.marked} Marked
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gray-400 inline-block"></span>{" "}
              {stats.notVisited} Not Visited
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>{" "}
              {stats.notAnswered} Not Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-yellow-200 border border-yellow-400 inline-block"></span>{" "}
              {stats.markedAnswered} Marked & Answered
            </div>
          </div>
          
          {/* Palette */}
          <div className="bg-[#22304a] rounded-lg p-4 mb-4 flex-1">
            <div className="font-semibold mb-2">
              Section: {currentSubject.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSubject.questions.map((_, qIdx) => {
                const questionId = `${currentSubjectIndex}-${qIdx}`;
                const status = questionStatus[questionId] || STATUS.NOT_VISITED;
                const isCurrent = qIdx === currentQuestionIndex;
                const paletteColor = getQuestionStatusColor(status);

                return (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentQuestionIndex(qIdx)}
                    className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm border ${paletteColor} ${
                      isCurrent ? "ring-2 ring-white" : ""
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Instructions & Submit */}
          <button className="w-full py-2 mb-2 rounded bg-gray-200 text-gray-900 font-semibold">
            Instructions
          </button>
          <button
            onClick={handleSubmitTest}
            disabled={!user || submitting}
            className={`w-full py-2 mb-2 rounded ${
              !user || submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold`}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestInterface; 