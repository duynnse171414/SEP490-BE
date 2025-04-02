import { useMutation } from "@tanstack/react-query";


const deleteStaff = async (staffId: string): Promise<any> => {
  const response = await fetch(`https://localhost:7100/api/Staffs/${staffId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete staff");
  }
  return response.json();
};

export const useDeleteStaff = () => {
  return useMutation<string, Error, string>({
    mutationFn: deleteStaff,
    onSuccess: () => {
      console.log("Staff deactivated successfully");
    },
    onError: (error) => {
      console.error("Error deactivating staff:", error.message);
    },
  });
};
