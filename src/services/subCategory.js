import axiosInstance from "../../api";


export const fetchAllSubCategories = async () => {
  const response = await axiosInstance.get("/api/sub-categories");
  return response.data;
};