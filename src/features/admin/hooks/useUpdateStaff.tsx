import { useMutation } from "@tanstack/react-query";


const updateStaff = async (staff: { staffId: number; [key: string]: any }): Promise<any> => {
  const response = await fetch(`https://localhost:7100/api/Staffs/${staff.staffId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });
  if (!response.ok) {
    throw new Error("Failed to update staff");
  }
  return response.json();
};

export const useUpdateStaff = () => {
  return useMutation<any, Error, { staffId: number; [key: string]: any }>({
    mutationFn: updateStaff,
    onSuccess: () => {
      console.log("Staff updated successfully");
    },
    onError: (error) => {
      console.error("Error updating staff:", error.message);
    },
  });
};
