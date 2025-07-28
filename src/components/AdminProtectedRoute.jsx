import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "../hooks/useAdminContext";

const AdminProtectedRoute = ({ children }) => {
  const { isAdminLoggedIn, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn()) {
    // Redirect to admin login with the current location as the intended destination
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AdminProtectedRoute; 