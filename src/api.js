import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use((response) => {
//   if(response.status === 401) {
//        alert("You are not authorized");
//   }
//   return response;
// }, (error) => {
//   if (error.response && error.response.data) {
//       return Promise.reject(error.response.data);
//   }
//   return Promise.reject(error.message);
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       const originalRequest = error.config;
//       const refreshToken = localStorage.getItem("refresh_token");

//       if (refreshToken && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           const ax = axios.create({
//             baseURL: process.env.REACT_APP_BASE_URL,
//             headers: {
//               "Content-Type": "application/json",
//               "refresh-token": refreshToken,
//             }
//           });
//           const { data } = await ax.post(process.env.REACT_APP_BASE_URL + "/api/v1/auth/refresh-token");

//           localStorage.setItem("access_token", data.data.access_token);
//           localStorage.setItem("refresh_token", data.data.refresh_token);

//           originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           console.error("Error refreshing token:", refreshError);
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//           window.location.href = "/login";
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
