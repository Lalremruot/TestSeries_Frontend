import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api';

const TestInstructionsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [testData, setTestData] = useState(null);
  const [language, setLanguage] = useState('English');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axiosInstance.get(`/api/tests/${id}`);
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        setTestData(data);
      } catch (error) {
        console.error('Error fetching test data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [id]);

  const handleStartTest = () => {
    if (!declarationAccepted) {
      alert('Please accept the declaration before starting the test.');
      return;
    }
    navigate(`/test/${id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading test instructions...</div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-red-600">Test not found</div>
      </div>
    );
  }

  // Calculate total questions and marks
  const totalQuestions = testData.subjects?.reduce((total, subject) => 
    total + (subject.questions?.length || 0), 0) || 0;
  
  const totalMarks = testData.subjects?.reduce((total, subject) => 
    total + (subject.questions?.reduce((subTotal, question) => 
      subTotal + (question.marks || 0), 0) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            General Instructions:
          </h1>
          <p className="text-gray-600">Read the following instructions carefully.</p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View in:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Test Details Table */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">SI No.</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Section Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">No. of Question</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Maximum Marks</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Negative Marks</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Positive Marks</th>
                </tr>
              </thead>
              <tbody>
                {testData.subjects?.map((subject, index) => {
                  const sectionQuestions = subject.questions?.length || 0;
                  const sectionMarks = subject.questions?.reduce((total, question) => 
                    total + (question.marks || 0), 0) || 0;
                  const avgNegativeMarks = subject.questions?.length > 0 ? 
                    (subject.questions.reduce((total, question) => 
                      total + (question.negativeMarks || 0), 0) / subject.questions.length).toFixed(1) : 0;
                  const avgPositiveMarks = subject.questions?.length > 0 ? 
                    (subject.questions.reduce((total, question) => 
                      total + (question.marks || 0), 0) / subject.questions.length).toFixed(1) : 0;

                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{sectionQuestions}</td>
                      <td className="border border-gray-300 px-4 py-2">{sectionMarks}</td>
                      <td className="border border-gray-300 px-4 py-2">{avgNegativeMarks}</td>
                      <td className="border border-gray-300 px-4 py-2">{avgPositiveMarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Examination Instructions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Examination Instructions:</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex gap-3">
              <span className="font-semibold text-gray-900">1.</span>
              <span>Total duration of the examination is {testData.duration || 30} Min</span>
            </div>
            
            <div className="flex gap-3">
              <span className="font-semibold text-gray-900">2.</span>
              <span>
                Your clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.
              </span>
            </div>
            
            <div className="flex gap-3">
              <span className="font-semibold text-gray-900">3.</span>
              <span>
                However, this exam will be conducted with sectional timing. You need to complete a given section in the mentioned time. You will not be able to proceed to the next section unless you finish the current section in its allotted time frame.
              </span>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Choose your default language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Important Note */}
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              <strong>Please note:</strong> All questions will appear in your default language. This language can be changed for a particular question later on.
            </p>
          </div>
        </div>

        {/* Declaration */}
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="declaration"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="declaration" className="text-sm text-gray-700 leading-relaxed">
              I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of /not wearing /not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to a disciplinary action, which may include ban from future Tests/Examinations.
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            <span>←</span> Go back
          </button>
          
          <button
            onClick={handleStartTest}
            disabled={!declarationAccepted}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
              declarationAccepted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            I am ready to begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructionsDetail; 