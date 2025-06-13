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
    EXPORT_ERRO: `${ADMIN_URL}/export-erros`,
    GET_IMPORT_ERRO: `${ADMIN_URL}/import/errors`,
    SCORE: {
      LISTSCORE:`${ADMIN_URL}/scores`,
      EXPORT:`${ADMIN_URL}/scores/export`,
      SCORE:`${ADMIN_URL}/score`,
      IMPORT:`${ADMIN_URL}/scores/import`,
  
    },
    STUDENT: {
      LISTUSER:`${ADMIN_URL}/users`,
      EXPORT:`${ADMIN_URL}/users/export`,
      USER:`${ADMIN_URL}/user`,
      CHECKEXIST: `${ADMIN_URL}/users/exist`,
      IMPORT: `${ADMIN_URL}/users/import`,
      
    },
    CURRICULUM:{
      LIST: `${ADMIN_URL}/curriculum`,
      EXPORT : `${ADMIN_URL}/curriculum/export`,
    }
  }
};

export default API_ENDPOINTS;
