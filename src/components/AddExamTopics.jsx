import { useEffect, useState } from "react";
import axiosInstance from "../../api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const AddExamTopics = ({ onNext }) => {
  // const { mainExamId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    examName: ""
  });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/topics/${formData.examName}`, formData);
      if (response) {
        toast.success("Exam topics created successfully!");
        setFormData({ name: "", examName: "" });

        // ✅ Move to next step
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
    const fetchExams = async () => {
      try {
        const response = await axiosInstance.get("/api/main-exams");
        if (response) {
          setExams(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch exams. Please refresh the page.", error);
      }
    };
    fetchExams();
  }, []);
  

  return (
    <div className="md:min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto lg:px-8">
        <div className="bg-white rounded-sm shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-100">
            <h2 className="text-2xl font-bold text-gray-700">
              Add New Exam Topics
            </h2>
            {/* <p className="mt-1 text-sm text-gray-600">Create a new exam topics under an existing category</p> */}
          </div>

          {/* Form */}
          <div className="p-6 h-[348px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Exam Type Input */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Exam Topics
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    type="text"
                    placeholder="e.g. SSC CGL, IBPS PO, SBI PO, etc..."
                    className="block w-full px-8 placeholder:text-xs py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Two columns for category and level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Select */}
                <div className="space-y-2">
                  <label
                    
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Exam
                  </label>
                  <div className="relative">
                    <select
                    name="examName"
                      value={formData.examName}
                      onChange={(e) =>
                        setFormData({ ...formData, examName: e.target.value })
                      }
                      required
                    >
                      <option value="">Select category</option>
                      {exams.map((exam) => (
                        <option key={exam._id} value={exam._id}>
                          {exam.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Level Select */}
                {/* <div className="space-y-2">
                  <label htmlFor="levels" className="block text-sm font-medium text-gray-700">
                    Select Level
                  </label>
                  <div className="relative">
                    <select
                      id="levels"
                      value={formData.levels}
                      onChange={(e) => setFormData({ ...formData, levels: e.target.value })}
                      className="w-full p-1 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      required
                    >
                      <option value="">Select level</option>
                      <option value="Tier 1">Tier 1</option>
                      <option value="Tier 2">Tier 2</option>
                      <option value="Prelims">Prelims</option>
                      <option value="Mains">Mains</option>
                    </select>
                  </div>
                </div> */}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    "Creating"
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExamTopics;
