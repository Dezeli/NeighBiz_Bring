import axios from 'axios';

const api = axios.create({
  baseURL: 'http://15.164.211.115/api/v1',
  // baseURL: 'http://localhost:8000/api/v1',
});

export default api;
