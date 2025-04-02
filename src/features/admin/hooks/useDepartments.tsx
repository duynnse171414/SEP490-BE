import { useQuery } from "@tanstack/react-query";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"], // Query key định danh cho dữ liệu này
    queryFn: async () => {
      const response = await fetch("https://localhost:7100/api/Staffs/departments");
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      return response.json();
    },
  });
};
