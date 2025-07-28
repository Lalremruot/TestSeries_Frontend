// import axiosInstance from "./axiosInstance";

import axiosInstance from "../../api";

// Get all categories (from Category collection)
export const fetchAllCategories = async () => {
  const response = await axiosInstance.get("/api/categories");
  return response.data;
};

// Get unique categories from Test model
export const fetchCategoriesFromTests = async () => {
  const response = await axiosInstance.get("/api/categories/from-test");
  return response.data;
};

// Create a new category
export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data;
};
