import { useEffect, useState } from "react";
import axiosInstance from "../../api";

const SectionsTabs = ({ testTypeId, currentSectionId, onSwitch }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const { data } = await axiosInstance.get(`/api/sections/test-type/${testTypeId}`);
      setSections(data);
      if (data.length && !currentSectionId) {
        onSwitch(data[0]._id);
      }
    };
    fetchSections();
  }, [testTypeId]);

  return (
    <div className="flex gap-2 mb-4 border-b border-gray-300 pb-2">
      {sections.map((section) => (
        <button
          key={section._id}
          onClick={() => onSwitch(section._id)}
          className={`px-2 text-xs py-2 rounded ${
            currentSectionId === section._id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {section.name}
        </button>
      ))}
    </div>
  );
};

export default SectionsTabs;
