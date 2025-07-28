import { useEffect, useState } from "react";
import axiosInstance from "../../api";
import { Lock, Play } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useContext";

const TestType = () => {
  const { topicId } = useParams();
  const [testTypes, setTestTypes] = useState([]);
  const [tests, setTests] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        const res = await axiosInstance.get(`/api/type/topic/${topicId}`);
        setTestTypes(res.data);
        if (res.data.length > 0) {
          setActiveTab(res.data[0]._id); // Default active tab
        }
      } catch (error) {
        console.error("Failed to load test types:", error.message);
      }
    };
    fetchTestTypes();
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      if (!activeTab) return;

      try {
        const res = await axiosInstance.get(`/api/tests/type/${activeTab}`);
        setTests(res.data || []);
      } catch (error) {
        console.log(error, "Error fetching tests");
      }
    };

    fetchTests();
  }, [activeTab]);

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  // Filter tests by active tab's test type
  const filteredTests = tests.filter(
    (t) => t.testTypeId && t.testTypeId._id === activeTab
  );

  return (
    <div className="w-full mx-auto p-4 lg:px-22">
      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-4 border-b border-gray-300 mb-6">
        {testTypes.map((testType) => (
          <button
            key={testType._id}
            onClick={() => handleTabClick(testType._id)}
            className={`px-4 py-2 whitespace-nowrap text-sm font-medium border-b-2 ${
              activeTab === testType._id
                ? "border-[#080546] text-[#080546] cursor-pointer"
                : "border-transparent text-[#080546] hover:text-[#080546d5] cursor-pointer"
            } transition-colors`}
          >
            {testType.typeName}
          </button>
        ))}
      </div>

      {/* Free Quiz Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Free Practice Quizzes</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Free
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Practice with free quizzes to improve your skills before taking the main tests.
        </p>
        <button
          onClick={() => navigate(`/free-quiz/${topicId}`)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          View Free Quizzes
        </button>
      </div>

      {/* Paid Tests Section */}
      <div className="min-h-[200px] bg-white rounded-xl shadow p-6 space-y-4 text-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Paid Tests</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Premium
          </span>
        </div>
        {filteredTests.map((test) => (
          <li
            key={test._id}
            className="p-4 border border-gray-300 rounded hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <strong className="text-lg text-gray-800">{test.title}</strong>
              <p className="text-sm text-gray-600">
                Duration: {test.duration} min.
              </p>
              <p className="text-sm text-gray-600">
                Total questions: {test.totalQuestions}
              </p>
            </div>
            <button
                className="mt-3 flex items-center justify-center gap-2 md:mt-0 text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium"
                onClick={() => navigate(`/test-instructions/${test._id}`)}
              >
                Start Test
              </button>
          </li>
        ))}
      </div>
    </div>
  );
};

export default TestType;
