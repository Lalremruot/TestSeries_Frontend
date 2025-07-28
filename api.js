import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ulimate-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: "true"
});

// Automatically add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Check for admin token first, then user token
    const adminToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("user");
    const userToken = storedUser ? JSON.parse(storedUser)?.token : null;
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log("API Request - Admin Authorization header set:", config.headers.Authorization);
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
      // console.log("API Request - User Authorization header set:", config.headers.Authorization);
    } else {
      console.log("API Request - No token found");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
