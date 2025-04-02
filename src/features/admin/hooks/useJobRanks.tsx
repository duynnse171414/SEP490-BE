import { useQuery } from "@tanstack/react-query";

export const useJobRanks = () => {
  return useQuery<{ id: number; name: string }[]>({
    queryKey: ["jobRanks"],
    queryFn: async () => {
      const response = await fetch("https://localhost:7100/api/Staffs/job-ranks");
      if (!response.ok) {
        throw new Error("Failed to fetch job ranks");
      }
      return response.json();
    },
  });
};
