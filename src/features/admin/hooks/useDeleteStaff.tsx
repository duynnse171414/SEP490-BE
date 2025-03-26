import { useMutation } from "@tanstack/react-query";


const deleteStaff = async (staffId: number): Promise<any> => {
  const response = await fetch(`https://localhost:7100/api/Staffs/${staffId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete staff");
  }
  return response.json();
};

export const useDeleteStaff = () => {
  return useMutation<number, Error, number>({
    mutationFn: deleteStaff,
    onSuccess: () => {
      console.log("Staff deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting staff:", error.message);
    },
  });
};