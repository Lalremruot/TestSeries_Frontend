import { useState } from 'react';
import { FaStar, FaRegStar, FaClock, FaUserGraduate, FaBookOpen, FaChartLine } from 'react-icons/fa';

const CoursePage = () => {
  const [activeCategory, setActiveCategory] = useState('ssc');

  // Mock data for courses
  const coursesData = {
    ssc: [
      {
        id: 'ssc1',
        title: 'SSC CGL Complete Test Series',
        description: 'Comprehensive test series for SSC CGL Tier 1 & Tier 2 with 50+ mock tests',
        price: 2999,
        discountedPrice: 1999,
        rating: 4.7,
        students: 12500,
        tests: 50,
        validity: '365 days',
        bestSeller: true
      },
      {
        id: 'ssc2',
        title: 'SSC CHSL Crash Course',
        description: 'Quick preparation course for SSC CHSL with 20 mock tests',
        price: 1999,
        discountedPrice: 1499,
        rating: 4.5,
        students: 8500,
        tests: 20,
        validity: '180 days',
        bestSeller: false
      },
      {
        id: 'ssc3',
        title: 'SSC CHSL Crash Course',
        description: 'Quick preparation course for SSC CHSL with 20 mock tests',
        price: 1999,
        discountedPrice: 1499,
        rating: 4.5,
        students: 8500,
        tests: 20,
        validity: '180 days',
        bestSeller: false
      }
    ],
    banking: [
      {
        id: 'bank1',
        title: 'IBPS PO Complete Package',
        description: 'Complete test series for IBPS PO Prelims and Mains',
        price: 3499,
        discountedPrice: 2499,
        rating: 4.8,
        students: 18700,
        tests: 60,
        validity: '365 days',
        bestSeller: true
      }
    ],
    railways: [
      {
        id: 'rrb1',
        title: 'RRB NTPC Gold Package',
        description: 'Complete preparation for RRB NTPC with sectional tests',
        price: 2299,
        discountedPrice: 1599,
        rating: 4.4,
        students: 9800,
        tests: 35,
        validity: '300 days',
        bestSeller: true
      }
    ],
    upsc: [
      {
        id: 'upsc1',
        title: 'UPSC Prelims Comprehensive',
        description: 'Complete test series for UPSC Civil Services Prelims',
        price: 4999,
        discountedPrice: 3999,
        rating: 4.9,
        students: 21500,
        tests: 50,
        validity: '365 days',
        bestSeller: true
      }
    ],
    cat: [
      {
        id: 'cat1',
        title: 'CAT Complete Test Series',
        description: '50+ mock tests for CAT with detailed analysis',
        price: 3999,
        discountedPrice: 2999,
        rating: 4.8,
        students: 18200,
        tests: 50,
        validity: '365 days',
        bestSeller: true
      }
    ]
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-6 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">TestSeriesPro</h1>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 space-x-6">
            <button
              onClick={() => setActiveCategory('ssc')}
              className={`whitespace-nowrap px-4 py-2 font-medium ${activeCategory === 'ssc' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              SSC
            </button>
            <button
              onClick={() => setActiveCategory('banking')}
              className={`whitespace-nowrap px-4 py-2 font-medium ${activeCategory === 'banking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Banking
            </button>
            <button
              onClick={() => setActiveCategory('railways')}
              className={`whitespace-nowrap px-4 py-2 font-medium ${activeCategory === 'railways' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Railways
            </button>
            <button
              onClick={() => setActiveCategory('upsc')}
              className={`whitespace-nowrap px-4 py-2 font-medium ${activeCategory === 'upsc' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              UPSC
            </button>
            <button
              onClick={() => setActiveCategory('cat')}
              className={`whitespace-nowrap px-4 py-2 font-medium ${activeCategory === 'cat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              CAT
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Category Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 capitalize mb-2">
            {activeCategory === 'ssc' && 'SSC Courses'}
            {activeCategory === 'banking' && 'Banking Courses'}
            {activeCategory === 'railways' && 'Railways Courses'}
            {activeCategory === 'upsc' && 'UPSC Courses'}
            {activeCategory === 'cat' && 'CAT Courses'}
          </h2>
          <p className="text-gray-600">
            High quality test series and preparation materials for your exam preparation
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData[activeCategory]?.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              {course.bestSeller && (
                <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 absolute top-2 left-2 rounded-full">
                  BESTSELLER
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(course.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">({course.rating})</span>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaUserGraduate className="mr-1" />
                    <span>{course.students.toLocaleString()}+ students</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaBookOpen className="mr-1" />
                    <span>{course.tests} tests</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <FaClock className="mr-1" />
                  <span>Valid for {course.validity}</span>
                </div>
                
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">₹{course.discountedPrice.toLocaleString()}</span>
                    {course.discountedPrice < course.price && (
                      <span className="ml-2 text-gray-500 line-through">₹{course.price.toLocaleString()}</span>
                    )}
                  </div>
                  {course.discountedPrice < course.price && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {Math.round((1 - course.discountedPrice / course.price) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!coursesData[activeCategory] && (
            <div className="col-span-3 py-12 text-center">
              <div className="mx-auto max-w-md">
                <FaChartLine className="mx-auto text-5xl text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon!</h3>
                <p className="text-gray-600">
                  We're currently preparing amazing test series for this category. Please check back later.
                </p>
                <button 
                  onClick={() => setActiveCategory('ssc')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Explore SSC Courses
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Choose Our Test Series?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Get in-depth performance analysis with section-wise breakdown and comparison with toppers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBookOpen className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Content</h3>
              <p className="text-gray-600">
                Prepared by subject matter experts with real exam pattern and difficulty level.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Learning</h3>
              <p className="text-gray-600">
                Access anytime, anywhere with mobile-friendly interface and downloadable content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-12 px-4 mt-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TestSeriesPro</h3>
              <p className="text-gray-400">
                India's leading test series platform for competitive exam preparation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Exams</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">SSC</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Banking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Railways</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">UPSC</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 TestSeriesPro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;