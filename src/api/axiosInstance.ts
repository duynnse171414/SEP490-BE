import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosInstance } from "axios";
import { handleApiError } from "./errorHandler";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_Backend_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});
//const defaultHeaders = { ...axiosInstance.defaults.headers.common };

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const storedUser = localStorage.getItem("loggedUser");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser.token;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("Bad Request");
          break;
        case 401:
          console.error("Unauthorized - Invalid credentials");
          break;
        case 403:
          console.error("Forbidden - Access denied");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 429:
          console.error("Too Many Requests - Rate limit exceeded");
          break;
        case 500:
          console.error("Server error occurred");
          break;
        default:
          console.error(`Unhandled status code: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("Network Error - No response received");
    } else {
      console.error("Request setup error:", error.message);
    }

    handleApiError(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
