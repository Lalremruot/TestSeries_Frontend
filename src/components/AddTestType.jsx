import { useEffect, useState } from "react";
import axiosInstance from "../../api";
import { toast } from "react-toastify";

const AddTestType = ({ onNext }) => {
  const [formData, setFormData] = useState({
    type: "",
    marks: "",
    negativeMarks: "",
    examTopics: ""
  });
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/test-type/${formData.examTopics}`,
        formData
      );
      if (response) {
        toast.success("Exam type created successfully!");
        setFormData({
          type: "",
          marks: "",
          negativeMarks: "",
          examTopics: "",
        });

        if (onNext) onNext();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create exam type. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get("/api/topics/all");
        if (response) {
          setTopics(response.data);
        }
      } catch (error) {
        toast.error(
          "Failed to fetch categories. Please refresh the page.",
          error
        );
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="shadow-xl h-[400px] border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
        <h2 className="font-bold text-2xl pb-5">Add Test Type</h2>
        <div className="flex flex-col">
          <label htmlFor="">Test Type</label>
          <input
            type="text"
            name="type"
            placeholder="e.g. Mock Test, Topic-Wise Test, Sectional Test"
            className="border rounded-md placeholder:text-sm border-gray-300 shadow-md px-4 py-1"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
        </div>
        {/* <div className="flex flex-col">
          <label htmlFor="">Duration (in minute)</label>
          <input
            type="number"
            name="duration"
            placeholder="e.g. 1200, 1800"
            className="border rounded-md placeholder:text-sm border-gray-300 shadow-md px-4 py-1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
        </div> */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
          >
            Select Exam Topic
          </label>
          <div className="relative">
            <select
              name="examTopics"
              value={formData.examTopics}
              onChange={(e) =>
                setFormData({ ...formData, examTopics: e.target.value })
              }
              className=" w-full p-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            >
              <option value="">Select Topics</option>
              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button
            className="bg-blue-600 px-3 py-1.5 text-white text-sm rounded-sm"
            type="submit"
          >
            Create Test Type
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddTestType;
