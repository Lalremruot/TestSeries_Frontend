// import QuizContainer from "../features/tests/QuizContainer"
import AboutUs from "./AboutUs"
// import CurrentAffairs from "./CurrentAffairs"
import Footer from "./Footer"
import HomePage from "./HomePage"
import PopularExams from "./PopularExams"
import TopCourse from "./TopCourse"

const MainLayout = () => {
  return (
    <div
     
    className=" lg:min-h-screen lg:px-2">
      <HomePage />
      <PopularExams />
      <TopCourse />
      {/* <QuizContainer /> */}
      <AboutUs />
      <Footer />
    </div>
  )
}
export default MainLayout