import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CurrentAffairs = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Politics', 'Economy', 'Technology', 'Sports', 'Science'];

  const tabContent = {
    daily: {
      title: 'Daily Current Affairs',
      content: [
        { id: 1, title: 'Global Summit Addresses Climate Change', summary: 'World leaders convened to discuss urgent climate action plans...', category: 'Politics' },
        { id: 2, title: 'New AI Model Unveiled', summary: 'Researchers introduced an advanced AI model with enhanced capabilities...', category: 'Technology' },
        { id: 3, title: 'Sports League Finals Conclude', summary: 'The national team clinched victory in a thrilling match...', category: 'Sports' },
        { id: 4, title: 'Stock Market Hits Record High', summary: 'Major indices soared due to positive economic data...', category: 'Economy' },
        { id: 5, title: 'Breakthrough in Cancer Research', summary: 'Scientists discovered a new treatment approach...', category: 'Science' },
      ],
    },
    weekly: {
      title: 'Weekly Current Affairs',
      content: [
        { id: 1, title: 'Economic Policy Reforms Announced', summary: 'Government introduced policies to boost economic growth...', category: 'Economy' },
        { id: 2, title: 'Quantum Computing Milestone', summary: 'Scientists achieved a breakthrough in quantum technology...', category: 'Technology' },
        { id: 3, title: 'International Trade Summit', summary: 'Global trade agreements were discussed in a week-long summit...', category: 'Economy' },
        { id: 4, title: 'New Environmental Regulations', summary: 'Policies to reduce carbon emissions were enacted...', category: 'Politics' },
        { id: 5, title: 'Athlete Breaks World Record', summary: 'A new record was set in the 100-meter sprint...', category: 'Sports' },
      ],
    },
    monthly: {
      title: 'Monthly Current Affairs',
      content: [
        { id: 1, title: 'Political Shifts Across Regions', summary: 'Significant political changes occurred globally...', category: 'Politics' },
        { id: 2, title: 'Space Exploration Milestones', summary: 'New discoveries in space research were reported...', category: 'Science' },
        { id: 3, title: 'Global Economic Outlook', summary: 'Analysts predict steady growth for the next quarter...', category: 'Economy' },
        { id: 4, title: 'Tech Giants Face Regulations', summary: 'New laws aim to regulate major tech companies...', category: 'Technology' },
        { id: 5, title: 'Olympic Preparations Underway', summary: 'Host city ramps up efforts for upcoming games...', category: 'Sports' },
      ],
    },
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const filteredContent = tabContent[activeTab].content.filter(
    (item) =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight"
        >
          Current Affairs Test Series
        </motion.h1>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search current affairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-full shadow-lg p-1.5">
            {['daily', 'weekly', 'monthly'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {tabContent[activeTab].title}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-2">{item.summary}</p>
                      <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                        Take Quiz →
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center">
                    No results found for the current search or category.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrentAffairs;