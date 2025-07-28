import { useState } from 'react';
import { FaBook, FaClock, FaTrophy, FaChartLine, FaQuestionCircle, FaFileAlt, FaLayerGroup } from 'react-icons/fa';

const SscCGL = () => {
  const [activeTab, setActiveTab] = useState('testSeries');
  const [selectedTier, setSelectedTier] = useState('tier1');

  // Mock data for demonstration
  const testSeries = [
    { id: 1, title: 'Full Mock Test - Tier 1', questions: 100, time: 120, attempts: 2450, rating: 4.5 },
    { id: 2, title: 'Quantitative Aptitude Special', questions: 50, time: 60, attempts: 1800, rating: 4.2 },
    { id: 3, title: 'English Comprehensive Test', questions: 50, time: 60, attempts: 1650, rating: 4.3 },
    { id: 4, title: 'Reasoning Mega Test', questions: 50, time: 60, attempts: 2100, rating: 4.7 },
  ];

  const quizzes = [
    { id: 1, title: 'General Awareness - Current Affairs', questions: 20, time: 15, category: 'General Studies' },
    { id: 2, title: 'Algebra Basics', questions: 15, time: 10, category: 'Quantitative Aptitude' },
    { id: 3, title: 'Error Spotting', questions: 10, time: 7, category: 'English Language' },
    { id: 4, title: 'Coding-Decoding', questions: 12, time: 8, category: 'Logical Reasoning' },
  ];

  const previousPapers = {
    tier1: [
      { year: 2023, month: 'April', downloadLink: '#', solutionLink: '#' },
      { year: 2022, month: 'December', downloadLink: '#', solutionLink: '#' },
      { year: 2022, month: 'June', downloadLink: '#', solutionLink: '#' },
      { year: 2021, month: 'November', downloadLink: '#', solutionLink: '#' },
    ],
    tier2: [
      { year: 2023, month: 'March', downloadLink: '#', solutionLink: '#' },
      { year: 2022, month: 'September', downloadLink: '#', solutionLink: '#' },
      { year: 2021, month: 'August', downloadLink: '#', solutionLink: '#' },
    ]
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#080546] text-white py-6 px-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">SSC CGL Preparation</h1>
        <p className="text-center mt-2 text-blue-100">Comprehensive resources for your SSC CGL exam preparation</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => setActiveTab('testSeries')}
          className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'testSeries' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
        >
          <FaFileAlt className="inline mr-2" />
          Test Series
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'quizzes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
        >
          <FaQuestionCircle className="inline mr-2" />
          Quizzes
        </button>
        <button
          onClick={() => setActiveTab('previousPapers')}
          className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'previousPapers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
        >
          <FaLayerGroup className="inline mr-2" />
          Previous Papers
        </button>
        <button
          onClick={() => setActiveTab('studyMaterial')}
          className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'studyMaterial' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
        >
          <FaBook className="inline mr-2" />
          Study Material
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Tier Selection (for relevant tabs) */}
        {(activeTab === 'testSeries' || activeTab === 'previousPapers') && (
          <div className="flex mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mr-4">Select Tier:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTier('tier1')}
                className={`px-4 py-2 rounded ${selectedTier === 'tier1' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Tier 1
              </button>
              <button
                onClick={() => setSelectedTier('tier2')}
                className={`px-4 py-2 rounded ${selectedTier === 'tier2' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Tier 2
              </button>
            </div>
          </div>
        )}

        {/* Test Series Content */}
        {activeTab === 'testSeries' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">SSC CGL {selectedTier === 'tier1' ? 'Tier 1' : 'Tier 2'} Test Series</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testSeries.map((test) => (
                <div key={test.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{test.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaQuestionCircle className="mr-2" />
                      <span>{test.questions} Questions</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaClock className="mr-2" />
                      <span>{test.time} Minutes</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaChartLine className="mr-2" />
                      <span>{test.attempts.toLocaleString()} Attempts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(test.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-gray-600">{test.rating}</span>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                        Start Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Content */}
        {activeTab === 'quizzes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Practice Quizzes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{quiz.category}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaQuestionCircle className="mr-2" />
                      <span>{quiz.questions} Questions</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaClock className="mr-2" />
                      <span>{quiz.time} Minutes</span>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Papers Content */}
        {activeTab === 'previousPapers' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">SSC CGL {selectedTier === 'tier1' ? 'Tier 1' : 'Tier 2'} Previous Year Papers</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Paper</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previousPapers[selectedTier].map((paper, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paper.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paper.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                        <a href={paper.downloadLink} className="hover:underline">Download PDF</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                        <a href={paper.solutionLink} className="hover:underline">View Solution</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Study Material Content */}
        {activeTab === 'studyMaterial' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Study Material</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Quantitative Aptitude */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-blue-600 p-4 text-white">
                  <h3 className="text-xl font-semibold">Quantitative Aptitude</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <FaBook className="text-blue-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Number System</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-blue-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Algebra</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-blue-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Geometry</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-blue-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Trigonometry</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-blue-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Data Interpretation</a>
                    </li>
                  </ul>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    View All Topics
                  </button>
                </div>
              </div>

              {/* English Language */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-green-600 p-4 text-white">
                  <h3 className="text-xl font-semibold">English Language</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <FaBook className="text-green-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Grammar Rules</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-green-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Vocabulary</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-green-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Reading Comprehension</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-green-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Error Detection</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-green-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Sentence Improvement</a>
                    </li>
                  </ul>
                  <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                    View All Topics
                  </button>
                </div>
              </div>

              {/* General Awareness */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-purple-600 p-4 text-white">
                  <h3 className="text-xl font-semibold">General Awareness</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <FaBook className="text-purple-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Current Affairs</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-purple-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Indian History</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-purple-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Geography</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-purple-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Polity</a>
                    </li>
                    <li className="flex items-center">
                      <FaBook className="text-purple-500 mr-2" />
                      <a href="#" className="text-blue-600 hover:underline">Science & Technology</a>
                    </li>
                  </ul>
                  <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                    View All Topics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FaTrophy className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Tests Taken</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FaChartLine className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">72.5%</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold">24h 35m</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaBook className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Topics Covered</p>
                  <p className="text-2xl font-bold">18/35</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">SSC CGL Preparation</h3>
              <p className="text-gray-400">Comprehensive resources for your SSC Combined Graduate Level exam preparation.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Test Series</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Previous Papers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Study Material</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Practice Quizzes</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Tiers</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Tier 1</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Tier 2</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Tier 3</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Tier 4</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Feedback</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© 2023 SSC CGL Preparation. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SscCGL;