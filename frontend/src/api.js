import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const saveResume = (data) => API.post('/resume/save', data);
export const getResumeData = () => API.get('/resume/data');
export const rewriteDescription = (input) => API.post('/ai/rewrite-description', { input });
export const getATSScore = (data) => API.post('/ai/ats-score', data);

export default API;
