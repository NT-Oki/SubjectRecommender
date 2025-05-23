// src/config/apiConfig.js
const BASE_URL = "http://localhost:8080";
const API_URL = `${BASE_URL}/api`;
const AUTH_URL = `${BASE_URL}/auth`;
const HANDLE_URL = `${BASE_URL}/handle`;

const API_ENDPOINTS = {
  USER_INFO: `${API_URL}/user-info`,
  LOGIN: `${AUTH_URL}/login`,
  LOGOUT: `${AUTH_URL}/logout`,
  SCORE: `${API_URL}/listScore`,
  INFO: `${API_URL}/info`,
  RECOMMEND: `${HANDLE_URL}/recommend`,
};

export default API_ENDPOINTS;
