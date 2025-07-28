import { useState, useEffect } from "react";
import axiosInstance from "../../api";
import { toast } from 'react-toastify';

const CreateTest = () => {
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [formData, setFormData] = useState({
    // Topic data
    topicName: "",
    topicDescription: "",
    
    // Test type data
    typeName: "",
    typeDescription: "",
    
    // Test data
    title: "",
    duration: 60,
    totalQuestions: 0,
    instructions: "",
    isPaid: false,
    price: 0,
    maxAttempts: 1,
    subjects: [
      {
        name: "",
        questions: [
          {
            questionText: "",
            options: { A: "", B: "", C: "", D: "" },
            correctOption: "A",
            marks: 1,
            negativeMarks: 0,
            timeLimitSeconds: 30,
            explanation: ""
          }
        ]
      }
    ]
  });
  const [loading, setLoading] = useState(false);

  // Fetch existing topics and test types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, typesRes] = await Promise.all([
          axiosInstance.get("/api/topics"),
          axiosInstance.get("/api/types")
        ]);
        setTopics(topicsRes.data);
        setTestTypes(typesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (step === 1) {
        // Create topic
        const topicRes = await axiosInstance.post("/api/topics", {
          name: formData.topicName,
          description: formData.topicDescription
        });
        toast.success('Topic created successfully!');
        setTopics([...topics, topicRes.data]);
        setStep(2);
      } else if (step === 2) {
        // Create test type
        const typeRes = await axiosInstance.post("/api/types", {
          typeName: formData.typeName,
          description: formData.typeDescription,
          topicId: topics[topics.length - 1]._id // Use the newly created topic
        });
        toast.success('Test type created successfully!');
        setTestTypes([...testTypes, typeRes.data]);
        setStep(3);
      } else if (step === 3) {
        // Create test
        const testRes = await axiosInstance.post("/api/tests", {
          testTypeId: testTypes[testTypes.length - 1]._id, // Use the newly created type
          title: formData.title,
          duration: formData.duration,
          totalQuestions: formData.totalQuestions,
          instructions: formData.instructions,
          isPaid: formData.isPaid,
          price: formData.price,
          maxAttempts: formData.maxAttempts,
          subjects: formData.subjects
        });
        toast.success('Test created successfully!');
        setStep(1);
        setFormData({
          topicName: "",
          topicDescription: "",
          typeName: "",
          typeDescription: "",
          title: "",
          duration: 60,
          totalQuestions: 0,
          instructions: "",
          isPaid: false,
          price: 0,
          maxAttempts: 1,
          subjects: [
            {
              name: "",
              questions: [
                {
                  questionText: "",
                  options: { A: "", B: "", C: "", D: "" },
                  correctOption: "A",
                  marks: 1,
                  negativeMarks: 0,
                  timeLimitSeconds: 30,
                  explanation: ""
                }
              ]
            }
          ]
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, {
        name: "",
        questions: [
          {
            questionText: "",
            options: { A: "", B: "", C: "", D: "" },
            correctOption: "A",
            marks: 1,
            negativeMarks: 0,
            timeLimitSeconds: 30,
            explanation: ""
          }
        ]
      }]
    }));
  };

  const addQuestion = (subjectIndex) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, idx) => 
        idx === subjectIndex 
          ? {
              ...subject,
              questions: [...subject.questions, {
                questionText: "",
                options: { A: "", B: "", C: "", D: "" },
                correctOption: "A",
                marks: 1,
                negativeMarks: 0,
                timeLimitSeconds: 30,
                explanation: ""
              }]
            }
          : subject
      )
    }));
  };

  const updateSubject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, idx) => 
        idx === index ? { ...subject, [field]: value } : subject
      )
    }));
  };

  const updateQuestion = (subjectIndex, questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, sIdx) => 
        sIdx === subjectIndex 
          ? {
              ...subject,
              questions: subject.questions.map((question, qIdx) => 
                qIdx === questionIndex 
                  ? { ...question, [field]: value }
                  : question
              )
            }
          : subject
      )
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Step 1: Create Topic</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Topic Name</label>
          <input
            type="text"
            value={formData.topicName}
            onChange={(e) => setFormData({...formData, topicName: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., SSC CGL, IBPS PO"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.topicDescription}
            onChange={(e) => setFormData({...formData, topicDescription: e.target.value})}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the topic..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Step 2: Create Test Type</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Test Type Name</label>
          <input
            type="text"
            value={formData.typeName}
            onChange={(e) => setFormData({...formData, typeName: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Mock Test, Practice Test"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.typeDescription}
            onChange={(e) => setFormData({...formData, typeDescription: e.target.value})}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the test type..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Step 3: Create Test</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Test Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., SSC CGL Mock Test 2024"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Questions</label>
          <input
            type="number"
            value={formData.totalQuestions}
            onChange={(e) => setFormData({...formData, totalQuestions: parseInt(e.target.value)})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
          <input
            type="number"
            value={formData.maxAttempts}
            onChange={(e) => setFormData({...formData, maxAttempts: parseInt(e.target.value)})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Test instructions..."
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPaid}
            onChange={(e) => setFormData({...formData, isPaid: e.target.checked})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Paid Test</span>
        </label>
        
        {formData.isPaid && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
              className="mt-1 block w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        )}
      </div>
      
      {/* Subjects and Questions */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-900">Subjects & Questions</h4>
          <button
            type="button"
            onClick={addSubject}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Subject
          </button>
        </div>
        
        {formData.subjects.map((subject, subjectIndex) => (
          <div key={subjectIndex} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={subject.name}
                onChange={(e) => updateSubject(subjectIndex, 'name', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject name"
                required
              />
              <button
                type="button"
                onClick={() => addQuestion(subjectIndex)}
                className="ml-4 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add Question
              </button>
            </div>
            
            {subject.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question {questionIndex + 1}</label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'questionText', e.target.value)}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter question text..."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option}>
                        <label className="block text-sm font-medium text-gray-700">Option {option}</label>
                        <input
                          type="text"
                          value={question.options[option]}
                          onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'options', {
                            ...question.options,
                            [option]: e.target.value
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${option}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Correct Option</label>
                      <select
                        value={question.correctOption}
                        onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'correctOption', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marks</label>
                      <input
                        type="number"
                        value={question.marks}
                        onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'marks', parseInt(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.5"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Negative Marks</label>
                      <input
                        type="number"
                        value={question.negativeMarks}
                        onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'negativeMarks', parseFloat(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time Limit (sec)</label>
                      <input
                        type="number"
                        value={question.timeLimitSeconds}
                        onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'timeLimitSeconds', parseInt(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Explanation</label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => updateQuestion(subjectIndex, questionIndex, 'explanation', e.target.value)}
                      rows="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Explanation for the correct answer..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Test</h2>
          <p className="text-gray-600">Create a complete test with topics, types, and questions</p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : step === 3 ? 'Create Test' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTest; 