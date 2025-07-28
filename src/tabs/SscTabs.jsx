import { useState } from "react";
import SscCGL from "../pages/SscCGL";
// import SscCHSL from "../pages/SscCHSL";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// Add other imports here as needed for other tabs

const ssc = [
  { id: 1, shortform: "SSC CGL", component: <SscCGL /> },
  { id: 2, shortform: "SSC CHSL", component: <SscCGL /> },
  { id: 3, shortform: "SSC GD", component: <SscCGL /> },
  { id: 4, shortform: "SSC MTS", component: <SscCGL /> },
  { id: 5, shortform: "SSC JE", component: <SscCGL /> },
  { id: 6, shortform: "SSC STENOGRAPHER", component: <SscCGL /> },
  { id: 7, shortform: "SSC CPO", component: <SscCGL /> },
  { id: 8, shortform: "SSC SELECTION POST", component: <SscCGL /> },
  { id: 9, shortform: "SSC JHT", component: <SscCGL /> }
];

const SscTabs = () => {
  const [activeTab, setActiveTab] = useState(ssc[0].shortform);

  const currentTab = ssc.find((tab) => tab.shortform === activeTab);

  return (
    <div className="w-full px-5 lg:px-5">
        <div className="relative mt-6">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for exams..."
              className="w-full focus:ring inset-3.5 focus:ring-blue-400 border bg-white border-gray-300 px-10 py-1.5 rounded-sm text-gray-600 placeholder:text-gray-400 outline-none"
            />
          </div>
      <div className="mt-8 ">
        <div className="flex gap-5 pb-2 overflow-x-auto whitespace-nowrap md:grid md:grid-cols-6 lg:overflow-hidden lg:grid lg:grid-cols-7 lg:gap-2">
          {ssc.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.shortform)}
              className={`text-sm px-3 py-2 rounded-sm font-medium capitalize lg:px-0 border border-gray-300 text-[#080546] text-center flex items-center justify-center transition-colors duration-200 focus:outline-none ${
                activeTab === tab.shortform
                  ? "text-[#080546] bg-gray-200"
                  : "text-[#080546] hover:bg-gray-200"
              }`}
            >
              {tab.shortform}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {currentTab?.component || <p>No content available.</p>}
      </div>
    </div>
  );
};

export default SscTabs;
