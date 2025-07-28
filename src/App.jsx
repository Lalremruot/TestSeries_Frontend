import { Route, Routes, useLocation, matchPath } from "react-router-dom";
import NavBar from "./layouts/NavBar";
import MainLayout from "./pages/MainLayout";
import UpscTabs from "./tabs/UpscTabs";
import SscTabs from "./tabs/SscTabs";
import CoursePage from "./pages/CoursePage";
import CurrentAffairs from "./pages/CurrentAffairs";
import Contact from "./pages/Contact";
import ProfilePage from "./features/profile/ProfilePage";
import QuestionPage from "./pages/QuestionPage";
import TestInterface from "./pages/TestInterface";
import Topics from "./pages/TestType";
import TestCreationForm from "./pages/TestCreationForm";
import SignupPage from "./features/auth/SignupPage";
import LoginPage from "./features/auth/LoginPage";
import UserPerformance from "./pages/UserPerformance";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import TestType from "./pages/TestType";
import TestResultPage from "./pages/TestResultPage";
import TestInstructions from "./pages/TestInstructions";
import TestInstructionsDetail from "./pages/TestInstructionsDetail";
import FreeQuizList from "./components/FreeQuizList";
import FreeQuizInterface from "./components/FreeQuizInterface";
import FreeQuizResult from "./components/FreeQuizResult";
import FreeQuizInstructions from "./components/FreeQuizInstructions";
import CreateFreeQuiz from "./components/CreateFreeQuiz";
import AdminFreeQuizManager from "./components/AdminFreeQuizManager";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const App = () => {
  const location = useLocation();
  const hiddenPaths = [
    "/start-test/:id",
    "/test/:id",
    "/test-instructions/:id",
    "/test-instructions-detail/:id",
    "/free-quiz-interface/:quizId",
    "/free-quiz-instructions/:quizId",
  ];

  const shouldShowNavBar = !hiddenPaths.some((path) =>
    matchPath(path, location.pathname)
  );

  return (
    <>
      {shouldShowNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/upsc-page" element={<UpscTabs />} />
        <Route path="/ssc-page" element={<SscTabs />} />
        <Route path="/course-page" element={<CoursePage />} />
        <Route path="/current-affairs" element={<CurrentAffairs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/test-type/:topicId" element={<TestType />} />
        <Route path="/results/:testId" element={<TestResultPage />} />
        <Route
          path="/questions/section/:sectionId"
          element={<QuestionPage />}
        />
        {/* <Route path="/test/:sectionId" element={<TestTakingPage />} /> */}
        <Route path="/test-instructions/:id" element={<TestInstructions />} />
        <Route path="/test-instructions-detail/:id" element={<TestInstructionsDetail />} />
        <Route path="/test/:id" element={<TestInterface />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/user-performance/:testId"
          element={<UserPerformance />}
        />
        <Route
          path="/performance-dashboard"
          element={<PerformanceDashboard />}
        />
        
        {/* Free Quiz Routes */}
        <Route path="/free-quiz/:topicId" element={<FreeQuizList />} />
        <Route path="/free-quiz-instructions/:quizId" element={<FreeQuizInstructions />} />
        <Route path="/free-quiz-interface/:quizId" element={<FreeQuizInterface />} />
        <Route path="/free-quiz-result" element={<FreeQuizResult />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/create-free-quiz" element={
          <AdminProtectedRoute>
            <CreateFreeQuiz />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/free-quizzes" element={
          <AdminProtectedRoute>
            <AdminFreeQuizManager />
          </AdminProtectedRoute>
        } />
      </Routes>
    </>
  );
};

export default App;
