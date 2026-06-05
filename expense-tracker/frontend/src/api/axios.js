import axios from 'axios';

const BACKEND_URL = 'https://task-expense-tracker-fbrk.onrender.com';
// const BACKEND_URL = 'http://localhost:5000/api';

// const BACKEND_URL = process.env.NODE_ENV === 'production'
//   ? 'https://tasks-kyrr.onrender.com' 
//   : 'http://localhost:5000/api';

const API = axios.create({ baseURL: BACKEND_URL });

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
