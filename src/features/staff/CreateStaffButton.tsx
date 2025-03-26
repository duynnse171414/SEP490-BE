import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Hàm gọi API tạo nhân viên
const createStaff = async (staffData: any) => {
  const response = await fetch("https://localhost:7100/api/Staffs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staffData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response.json();
};

// Props cho component
interface CreateStaffButtonProps {
  onSuccess: (newStaff: any) => void; // Callback khi tạo thành công
}

const CreateStaffButton: React.FC<CreateStaffButtonProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    staffName: "",
    jobRank: 0,
    salary: 0,
    userId: "",
    departmentId: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "jobRank" || name === "salary" || name === "departmentId"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newStaff = await createStaff(formData); // Gọi API tạo nhân viên
      onSuccess(newStaff); // Gọi callback cập nhật danh sách
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="px-4 py-2 cursor-pointer"
        >
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Staff</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="staffName" className="block font-medium mb-1">
              Staff Name
            </label>
            <input
              type="text"
              id="staffName"
              name="staffName"
              value={formData.staffName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobRank" className="block font-medium mb-1">
              Job Rank
            </label>
            <input
              type="number"
              id="jobRank"
              name="jobRank"
              value={formData.jobRank}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block font-medium mb-1">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userId" className="block font-medium mb-1">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="departmentId" className="block font-medium mb-1">
              Department ID
            </label>
            <input
              type="number"
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffButton;
