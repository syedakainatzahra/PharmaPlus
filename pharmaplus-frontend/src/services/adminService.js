import axios from "axios";

const API_URL = "https://pharmaplus-production-7fa8.up.railway.app/api/v1/admin";


// Get all users
export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, {
    withCredentials: true,
  });

  return response.data;
};


// Get dashboard statistics
export const getSystemStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    withCredentials: true,
  });

  return response.data;
};


// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await axios.put(
    `${API_URL}/users/${userId}/role`,
    {
      role,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};