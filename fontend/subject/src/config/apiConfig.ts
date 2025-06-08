// src/config/apiConfig.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api`;
const AUTH_URL = `${BASE_URL}/auth`;
const HANDLE_URL = `${BASE_URL}/handle`;
const ADMIN_URL = `${BASE_URL}/admin`;

const API_ENDPOINTS = {
  USER_INFO: `${API_URL}/user-info`,
  LOGIN: `${AUTH_URL}/login`,
  LOGOUT: `${AUTH_URL}/logout`,
  SCORE: `${API_URL}/listScore`,
  INFO: `${API_URL}/info`,
  RECOMMEND: `${HANDLE_URL}/recommend`,
  CHANGEPASSWORD: `${AUTH_URL}/change-password`,
  FORGOTPASSWORD: `${AUTH_URL}/forgot-password`,
  CHECKTOKEN: `${AUTH_URL}/check-token`,
  
  ADMIN:{
    UPLOADFILE:`${ADMIN_URL}/upload-temp`,
    PROGRESS: `${ADMIN_URL}/progress`,
    SCORE: {
      LISTSCORE:`${ADMIN_URL}/scores`,
      EXPORT:`${ADMIN_URL}/scores/export`,
      SCORE:`${ADMIN_URL}/score`,
      IMPORT:`${ADMIN_URL}/scores/import`,
      IMPORT_ASYNC:`${ADMIN_URL}/scores/import-async`,
      
    },
    STUDENT: {
      LISTUSER:`${ADMIN_URL}/users`,
      EXPORT:`${ADMIN_URL}/users/export`,
      USER:`${ADMIN_URL}/user`,
      CHECKEXIST: `${ADMIN_URL}/users/exist`,
    },
    CURRICULUM:{
      LIST: `${ADMIN_URL}/curriculum`,
      EXPORT : `${ADMIN_URL}/curriculum/export`,
    }
  }
};

export default API_ENDPOINTS;
