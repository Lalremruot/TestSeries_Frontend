import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminProvider } from './context/AdminContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateTest from './pages/CreateTest';
import CreateTopic from './pages/CreateTopic';
import CreateTestType from './pages/CreateTestType';
import ManageTests from './pages/ManageTests';
import ManageTopics from './pages/ManageTopics';
import ManageTestTypes from './pages/ManageTestTypes';
import CreateFreeQuiz from './pages/CreateFreeQuiz';
import ManageFreeQuizzes from './pages/ManageFreeQuizzes';
import AdminLayout from './components/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';

const AdminApp = () => {
  return (
    <AdminProvider>
      <Router>
        <div className="admin-app">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Test Management */}
              <Route path="create-test" element={<CreateTest />} />
              <Route path="manage-tests" element={<ManageTests />} />
              
              {/* Topic Management */}
              <Route path="create-topic" element={<CreateTopic />} />
              <Route path="manage-topics" element={<ManageTopics />} />
              
              {/* Test Type Management */}
              <Route path="create-test-type" element={<CreateTestType />} />
              <Route path="manage-test-types" element={<ManageTestTypes />} />
              
              {/* Free Quiz Management */}
              <Route path="create-free-quiz" element={<CreateFreeQuiz />} />
              <Route path="manage-free-quizzes" element={<ManageFreeQuizzes />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
        
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AdminProvider>
  );
};

export default AdminApp; 