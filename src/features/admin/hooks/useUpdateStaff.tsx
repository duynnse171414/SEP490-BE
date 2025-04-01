import { useMutation } from "@tanstack/react-query";

// Define the type for staff data
interface StaffData {
  id: number;
  name: string;
  position: string;
  salary: number;
  jobRank: number;
}

// Function to update staff (API call)
const updateStaff = async (staff: any): Promise<any> => {
  if (!staff.staffId) {
    throw new Error("Staff ID is missing.");
  }

  console.log("Payload gửi lên backend:", staff);

  const response = await fetch(`https://localhost:7100/api/Staffs/${staff.staffId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      staffName: staff.staffName,
      salary: staff.salary,
      jobRank: staff.jobRank,
      department: staff.department,
      status: staff.status, // Thêm trường status vào payload
    }),
  });

  const responseText = await response.text();
  console.log("Response từ backend:", responseText);

  if (!response.ok) {
    throw new Error(responseText || "Failed to update staff");
  }

  return JSON.parse(responseText);
};





// Custom hook for mutation
export const useUpdateStaff = () => {
  return useMutation<StaffData, Error, StaffData>({
    mutationFn: updateStaff,
    onSuccess: (data) => {
      console.log("Staff updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating staff:", error.message);
    },
  });
};
// Example component using the mutation
const MyComponent = () => {
  const mutation = useUpdateStaff();

  const handleUpdate = () => {
    const staffData: StaffData = {
      id: 1,
      name: "John Doe",
      position: "Manager",
      salary: 5000, // Giá trị mẫu
      jobRank: 2, // Giá trị mẫu (chọn ID tương ứng từ danh sách jobRank)
    };

    mutation.mutate(staffData);
  };

  return (
    <div>
      <button onClick={handleUpdate}>Update Staff</button>

      {/* Check mutation status */}
      {mutation.status === "pending" && <p>Updating staff...</p>}
      {mutation.status === "error" && <p>Error: {mutation.error?.message}</p>}
      {mutation.status === "success" && <p>Staff updated successfully!</p>}
    </div>
  );
};

export default MyComponent;

