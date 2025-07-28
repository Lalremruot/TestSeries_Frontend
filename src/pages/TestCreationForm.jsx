import { useEffect, useState } from "react";
import axiosInstance from "../../api";
import { toast } from "react-toastify";

const TestCreationForm = () => {
  const [testTypes, setTestTypes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    testTypeId: "",
    title: "",
    topics: "",
    totalDuration: "",
    sections: [], // Start with empty sections array
  });

  // Fetch Test Types
  useEffect(() => {
    const fetchTestTypesByTopic = async () => {
      if (!formData.topics) return;

      try {
        const res = await axiosInstance.get(
          `/api/test-type/topic/${formData.topics}`
        );
        setTestTypes(res.data);
      } catch (err) {
        console.error("Failed to load test types for topic", err);
        toast.error("Failed to load test types");
      }
    };
    fetchTestTypesByTopic();
  }, [formData.topics]);
  

  // Fetch Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get("/api/topics/all");
        if (response?.data) {
          setTopics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch topics", error);
      }
    };
    fetchTopics();
  }, []);

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add New Section
  const addSection = () => {
    const newSection = {
      name: "",
      questions: [],
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  };

  // Remove Section
  const removeSection = (sectionIndex) => {
    const updatedSections = formData.sections.filter(
      (_, idx) => idx !== sectionIndex
    );
    setFormData({ ...formData, sections: updatedSections });
  };

  // Update Section Name
  const updateSectionName = (sectionIndex, name) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].name = name;
    setFormData({ ...formData, sections: updatedSections });
  };

  // Add New Question to Section
  const addQuestion = (sectionIndex) => {
    const newQuestion = {
      questionText: "",
      options: [
        { option: "A", text: "" },
        { option: "B", text: "" },
        { option: "C", text: "" },
        { option: "D", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
      timeLimit: "",
      marks: "",
      negativeMarks: "",
    };

    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].questions = [
      ...updatedSections[sectionIndex].questions,
      newQuestion,
    ];
    setFormData({ ...formData, sections: updatedSections });
  };

  // Remove Question from Section
  const removeQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].questions = updatedSections[
      sectionIndex
    ].questions.filter((_, idx) => idx !== questionIndex);
    setFormData({ ...formData, sections: updatedSections });
  };

  // Handle Question Change
  const handleQuestionChange = (sectionIndex, questionIndex, key, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].questions[questionIndex][key] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  // Handle Option Change
  const handleOptionChange = (sectionIndex, questionIndex, optionIndex, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].questions[questionIndex].options[
      optionIndex
    ].text = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        `/api/test-title/test-type/${formData.testTypeId}`,
        formData
      );
      toast.success("Test created successfully!");
      resetForm();
    } catch (err) {
      toast.error("Failed to create test");
      console.error("Error creating test:", err);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      testTypeId: "",
      title: "",
      totalDuration: "",
      topics: "",
      sections: [],
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Create New Test
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Test Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Title*</label>
              <input
                value={formData.title}
                onChange={handleInputChange}
                name="title"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Topic*
              </label>
              <select
                name="topics"
                value={formData.topics}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Type*
              </label>
              <select
                value={formData.testTypeId}
                onChange={(e) =>
                  setFormData({ ...formData, testTypeId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.topics}
              >
                <option value="">
                  {formData.topics ? "Select Test Type" : "Select Topic First"}
                </option>
                {testTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Duration (minutes)*
              </label>
              <input
                type="number"
                value={formData.totalDuration}
                onChange={handleInputChange}
                name="totalDuration"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 120"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <input
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                name="price"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 199"
               
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Sections Management */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Test Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Section
            </button>
          </div>

          {formData.sections.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-md border-2 border-dashed border-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h4 className="mt-2 text-sm font-medium text-gray-700">No sections added yet</h4>
              <p className="mt-1 text-sm text-gray-500">Click "Add Section" to create your first section</p>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                      <input
                        value={section.name}
                        onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
                        className="w-full text-lg font-medium border-b border-gray-300 px-1 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Section Name (e.g. 'Quantitative Aptitude')"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="ml-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      title="Remove section"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Questions in this section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-700">Questions</h4>
                      <button
                        type="button"
                        onClick={() => addQuestion(sectionIndex)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-1 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Question
                      </button>
                    </div>

                    {section.questions.length === 0 ? (
                      <div className="text-center py-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">No questions in this section yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {section.questions.map((question, questionIndex) => (
                          <div
                            key={questionIndex}
                            className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50 relative"
                          >
                            <div className="absolute top-2 right-2">
                              <button
                                type="button"
                                onClick={() => removeQuestion(sectionIndex, questionIndex)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                title="Remove question"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question {questionIndex + 1}
                              </label>
                              <textarea
                                placeholder="Enter question text..."
                                value={question.questionText}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    sectionIndex,
                                    questionIndex,
                                    "questionText",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {question.options.map((option, optionIndex) => (
                                  <div key={option.option} className="flex items-center gap-2">
                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium">
                                      {option.option}
                                    </span>
                                    <input
                                      placeholder={`Option ${option.option}`}
                                      value={option.text}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          sectionIndex,
                                          questionIndex,
                                          optionIndex,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      required
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Correct Answer
                                </label>
                                <select
                                  value={question.correctAnswer}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      sectionIndex,
                                      questionIndex,
                                      "correctAnswer",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  required
                                >
                                  <option value="">Choose the correct option</option>
                                  {question.options.map((opt) => (
                                    <option key={opt.option} value={opt.option}>
                                      {opt.option}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Explanation
                                </label>
                                <input
                                  placeholder="Explanation (optional)"
                                  value={question.explanation}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      sectionIndex,
                                      questionIndex,
                                      "explanation",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Marks
                                </label>
                                <input
                                  type="number"
                                  placeholder="Marks"
                                  value={question.marks}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      sectionIndex,
                                      questionIndex,
                                      "marks",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="0"
                                  step="0.5"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Negative Marks
                                </label>
                                <input
                                  type="number"
                                  placeholder="Negative Marks"
                                  value={question.negativeMarks}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      sectionIndex,
                                      questionIndex,
                                      "negativeMarks",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="0"
                                  step="0.5"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Time Limit (seconds)
                                </label>
                                <input
                                  type="number"
                                  placeholder="Time Limit"
                                  value={question.timeLimit}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      sectionIndex,
                                      questionIndex,
                                      "timeLimit",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="0"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        {formData.sections.length > 0 && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={formData.sections.some(section => section.questions.length === 0) || formData.sections.some(section => !section.name)}
            >
              Create Test
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TestCreationForm;