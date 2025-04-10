// // src/api/axiosInstance.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://portal.meraksecurity.com',
//   timeout: 10000,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to add auth headers
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Get auth tokens from localStorage
//     const authTokensStr = localStorage.getItem('auth_tokens');
//     if (authTokensStr) {
//       try {
//         const authTokens = JSON.parse(authTokensStr);
        
//         // Add authentication headers
//         if (authTokens.apiKey && authTokens.apiSecret) {
//           config.headers['Authorization'] = `token ${authTokens.apiKey}:${authTokens.apiSecret}`;
//         }
        
//         // You can also include the session ID if needed
//         if (authTokens.sessionId) {
//           config.headers['X-Frappe-Session-Id'] = authTokens.sessionId;
//         }
//       } catch (error) {
//         console.error('Error parsing auth tokens:', error);
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://portal.meraksecurity.com',
  timeout: 10000,
  withCredentials: true, // ✅ sends session cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authTokensStr = localStorage.getItem('auth_tokens');
    if (authTokensStr) {
      try {
        const authTokens = JSON.parse(authTokensStr);
        if (authTokens.apiKey && authTokens.apiSecret) {
          config.headers['Authorization'] = `token ${authTokens.apiKey}:${authTokens.apiSecret}`;
        }
      } catch (error) {
        console.error('Error parsing auth tokens:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
