import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Apne backend port/URL ke mutabiq change karein
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agar Auth Tokens/JWT use kar rahe hain:
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;