import axios from "axios";

const API_URL =
  "https://mini-contact-book-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// ADD ACCESS TOKEN TO EVERY REQUEST
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// REFRESH ACCESS TOKEN IF EXPIRED
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 once
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken");

      // No refresh token
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        // Save new access token
        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        // Add new token to original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError
        );

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;