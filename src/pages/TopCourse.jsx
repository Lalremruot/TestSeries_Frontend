import { FaStar, FaRegStar, FaFire, FaUsers, FaArrowRight } from 'react-icons/fa';

const TopCourse = () => {
  // Sample course data
  const courses = [
    {
      id: 1,
      title: "SSC CGL Complete Test Series",
      description: "Comprehensive test series covering all sections of SSC CGL with 50+ mock tests.",
      price: 2999,
      discountedPrice: 1999,
      rating: 4.8,
      students: 1250,
      isTrending: true,
      topics: ["Quantitative Aptitude", "English", "Reasoning", "General Awareness"]
    },
    {
      id: 2,
      title: "SSC GD Constable Crash Course",
      description: "Specialized course for SSC GD with physical efficiency test guidance.",
      price: 2499,
      discountedPrice: 1499,
      rating: 4.5,
      students: 980,
      isTrending: false,
      topics: ["General Intelligence", "General Knowledge", "Elementary Mathematics"]
    },
    {
      id: 3,
      title: "SBI Clerk Premium Pack",
      description: "Complete preparation package for SBI Clerk with sectional and full-length tests.",
      price: 3499,
      discountedPrice: 2499,
      rating: 4.7,
      students: 2100,
      isTrending: true,
      topics: ["Numerical Ability", "Reasoning", "English", "Computer Knowledge"]
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Top Courses
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Prepare for your dream government job with our expertly crafted test series
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* {course.isTrending && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <FaFire className="text-sm" /> Trending
                  </div>
                </div>
              )} */}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic, index) => (
                      <span 
                        key={index} 
                        className="bg-[#08054618] text-[#080546] text-xs px-2.5 py-1 rounded-full font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(course.rating) ? 
                          <FaStar key={i} className="w-4 h-4" /> : 
                          <FaRegStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="w-4 h-4 mr-1" />
                    <span className="text-sm">{course.students}+ students</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-400 text-sm line-through">₹{course.price}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">₹{course.discountedPrice}</span>
                      <span className="text-sm text-green-600 font-medium">
                        ({Math.round((course.price - course.discountedPrice) / course.price * 100)}% off)
                      </span>
                    </div>
                  </div>
                  <button className="bg-[#080546] hover:bg-[#080546d0] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-300">
                    Buy Now <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#080546] hover:bg-[#080546d0] transition-colors duration-300">
            View All Courses <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopCourse;