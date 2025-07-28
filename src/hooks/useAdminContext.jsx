import { createContext, useContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load admin from localStorage on first render
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    const adminToken = localStorage.getItem("adminToken");
    
    if (storedAdmin && adminToken) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error("Error parsing admin data:", error);
        localStorage.removeItem("adminData");
        localStorage.removeItem("adminToken");
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = (adminData, token) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminData", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
    console.log("Admin logged out, localStorage cleared");
  };

  const isAdminLoggedIn = () => {
    return admin !== null && localStorage.getItem("adminToken") !== null;
  };

  return (
    <AdminContext.Provider value={{ 
      admin, 
      adminLogin, 
      adminLogout, 
      isAdminLoggedIn,
      loading 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}; 