import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from "axios";
import { handleApiError } from "./errorHandler";
import { Backend_URL } from "@/config.global";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: Backend_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const defaultHeaders = { ...axiosInstance.defaults.headers.common };

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers["If-None-Match"] = "your-etag";

    config.headers = {
      ...config.headers,
      ...defaultHeaders,
    } as AxiosRequestHeaders;

    return config;
  },
  (error) => {
    Promise.reject(error);
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
