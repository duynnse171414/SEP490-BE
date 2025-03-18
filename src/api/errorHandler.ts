import { AxiosError } from "axios";

export const handleApiError = (error: AxiosError) => {
  if (error.response) {
    console.error(`API Error: ${error.response.status} - ${error.response.data}`);
  } else if (error.request) {
    console.error("API Error: No response received from server");
  } else {
    console.error("API Error:", error.message);
  }
  throw error;
};