// src/config/apiConfig.js
const BASE_URL = "http://localhost:8080";
const API_URL = '${BASE_URL}/api';

const API_ENDPOINTS = {
  USER_INFO: `${API_URL}/user-info`,
  LOGIN: `${BASE_URL}/login`,
  LOGOUT: `${BASE_URL}/logout`,
  SCORE: `${API_URL}/score`,
};

export default API_ENDPOINTS;
