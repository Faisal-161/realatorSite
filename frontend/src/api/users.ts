// frontend/src/api/users.ts
import axiosInstance from "./axios";

export const fetchUsers = async () => {
  const response = await axiosInstance.get("/users/");
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axiosInstance.post("/users/", userData);
  return response.data;
};
