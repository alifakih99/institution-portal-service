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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (originalRequest.status === 401 && refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const ax = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            headers: {
              "Content-Type": "application/json",
              "refresh-token": refreshToken,
            },
          });

          const { data } = await ax.post("/api/v1/auth/refresh-token");
          localStorage.setItem("access_token", data.data.accessToken);
          localStorage.setItem("refresh_token", data.data.refreshToken);
          localStorage.setItem("expired_after", data.data.expiresIn);

          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);

          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("expired_after");
          window.location.href = "/login";
        }
      } else {
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default api;
