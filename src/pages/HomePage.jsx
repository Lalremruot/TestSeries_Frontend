// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { Link } from "react-router-dom";
// import { getToken } from "@clerk/clerk-js";
// import { useAuth } from "@clerk/clerk-react";

const HomePage = () => {
// const { getToken } = useAuth();

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const token = await getToken();
  //     console.log("Clerk token:", token); // Use this token in Postman
  //   };

  //   fetchToken();
  // }, [getToken]);

  return (
    <div
      // style={{
      //     backgroundImage: 'radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0)',
      //     backgroundSize: '1.5rem 1.5rem',
      //   }}
      className="relative w-full bg-white flex flex-col justify-center items-center lg:min-h-[450px] lg:px-8 "
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-14 lg:py-20 lg:pt-18 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#080546]  to-[#080546] sm:text-5xl lg:max-w-5xl lg:text-5xl">
            Ace Your Exams With Our Comprehensive Test Series
          </h1>
          <p className=" text-sm lg:text-lg  text-gray-500 lg:pt-5 lg:max-w-2xl mx-auto">
            Prepare effectively for your exams with our wide range of test
            series, meticulously designed by experts to help you succeed.
          </p>
          <div className="mt-8 lg:mt-5 flex flex-col gap-2 lg:flex lg:flex-row lg:gap-0 items-center justify-center">
            {/* <div className="relative w-[480px]">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for exams (e.g., UPSC, SSC, etc)"
                className="w-full focus:ring focus:ring-blue-400 border bg-white border-gray-300 shadow-xl pl-12 pr-4 py-3.5 rounded-full text-gray-600 placeholder:text-gray-400 outline-none"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 px-5 py-2.5 rounded-full text-white text-sm">Search</button>
            </div> */}
            <Link to="/login" className="rounded-sm flex items-center gap-3 bg-[#080546] px-8 py-3 text-sm font-semibold text-white shadow-md hover:scale-105 transition-all duration-200 hover:bg-[#080546d8] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Explore Courses <ArrowRightIcon className="w-4 h-4" />
          </Link>
            <Link to="/signup" className="rounded-sm flex items-center gap-3  px-8 py-3 text-sm font-semibold text-[#080546] transition-all duration-200 hover:text-[#080546d8] hover:scale-105 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Signup for free <ArrowRightIcon className="w-4 h-4" />
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
