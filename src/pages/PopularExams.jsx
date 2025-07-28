import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../../api";

const PopularExams = () => {
  const [exams, setExams] = useState([]);


  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await axiosInstance.get("/api/topics");
        setExams(response.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    loadExams();
  }, []);


  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h2 className="font-semibold text-xl md:text-2xl tracking-tight text-[#080546] text-left">
          Exams
        </h2>
      </div>
      {/* Exams Scrollable Row on Mobile, Grid on Desktop */}
      <div
        className="
        flex gap-4 overflow-x-auto pb-2
        sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0
        md:grid md:grid-cols-3
        lg:grid lg:grid-cols-5
      "
      >
        {exams.map((exam, index) => (
          <div
            key={index}
            className="shadow-sm border hover:scale-105 border-[#0805462a] rounded-xl w-52 text-center flex flex-col items-center justify-center"
          >
            <Link
             to={`/test-type/${exam._id}`}
              className="flex items-center justify-between w-full p-5"
            >
              <h3 className="font-semibold text-[#08054691] text-md truncate uppercase">
                {exam.name}
              </h3>
              <ArrowRightIcon className="w-5 h-5 text-[#080546]" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularExams;
