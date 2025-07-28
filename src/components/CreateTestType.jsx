import { useState, useEffect } from "react";
import axiosInstance from "../../api";
import { toast } from 'react-toastify';

const CreateTestType = () => {
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    topicId: ""
  });
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get("/api/topics");
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axiosInstance.post("/api/types", formData);
      if (response.data) {
        toast.success('Test type created successfully!');
        setFormData({ typeName: "", description: "", topicId: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create test type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Test Type</h2>
          <p className="text-gray-600">Create a new test type under a topic</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Topic</label>
            <select
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Test Type Name</label>
            <input
              type="text"
              value={formData.typeName}
              onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mock Test, Practice Test, Previous Year"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the test type and its features..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Test Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestType; 