import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TestInstructions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [language, setLanguage] = useState('English');

  const handleStartTest = () => {
    navigate(`/test-instructions-detail/${id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-8 py-4">
        <div className="text-xl font-bold">INSTRUCTION</div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-6">
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

        {/* General Instructions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
            General Instructions:
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="flex gap-3">
              <span className="font-semibold text-gray-900">1.</span>
              <span>Total duration of the examination is 30 Min</span>
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
                The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
              </span>
            </div>
          </div>
        </div>

        {/* Question Palette Symbols */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Question Palette Symbols:
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-300 border-2 border-green-500 rounded flex items-center justify-center">
                <span className="text-green-900 font-bold text-xs">1</span>
              </div>
              <span className="text-gray-700">You have answered the question.</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-200 border-2 border-red-400 rounded flex items-center justify-center">
                <span className="text-red-900 font-bold text-xs">2</span>
              </div>
              <span className="text-gray-700">You have visited but not answered the question yet.</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-200 border-2 border-purple-400 rounded flex items-center justify-center">
                <span className="text-purple-900 font-bold text-xs">3</span>
              </div>
              <span className="text-gray-700">You have not answered the question but have marked for review.</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-400 border-2 border-purple-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">4</span>
              </div>
              <span className="text-gray-700">You have answered the question but have marked for review.</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded flex items-center justify-center">
                <span className="text-gray-700 font-bold text-xs">5</span>
              </div>
              <span className="text-gray-700">You have not visited the question yet.</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            <span>←</span> Go back
          </button>
          
          <button
            onClick={handleStartTest}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Detailed Instructions
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions; 