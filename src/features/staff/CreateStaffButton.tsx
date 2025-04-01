import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// API calls
const fetchJobRanks = async () => {
  const response = await fetch("https://localhost:7100/api/Staffs/job-ranks");
  if (!response.ok) throw new Error("Failed to fetch job ranks");
  return await response.json();
};

const fetchDepartments = async () => {
  const response = await fetch("https://localhost:7100/api/Staffs/departments");
  if (!response.ok) throw new Error("Failed to fetch departments");
  return await response.json();
};

const createStaff = async (staffData: any) => {
  const response = await fetch("https://localhost:7100/api/Staffs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  });
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return await response.json();
};

interface CreateStaffButtonProps {
  onSuccess: (newStaff: any) => void;
}

const CreateStaffButton: React.FC<CreateStaffButtonProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    staffName: "",
    jobRank: "", // Store job rank ID as a string
    salary: 0,
    userId: "",
    departmentId: "", // Store department ID as a string
  });

  const [jobRanks, setJobRanks] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobRanksData, departmentsData] = await Promise.all([
          fetchJobRanks(),
          fetchDepartments(),
        ]);
        setJobRanks(jobRanksData);
        setDepartments(departmentsData);
      } catch (err) {
        setError("Failed to load job ranks or departments.");
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "salary" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate Job Rank and Department selection
    if (!formData.jobRank || !formData.departmentId) {
      setError("Please select a valid Job Rank and Department.");
      setLoading(false);
      return;
    }

    const jobRankId = jobRanks.find(
      (rank) => rank.id === Number(formData.jobRank)
    )?.id;
    const departmentId = departments.find(
      (dept) => dept.id === Number(formData.departmentId)
    )?.id;

    // Ensure Job Rank ID starts from 0 and Department ID starts from 1
    if (jobRankId === undefined || jobRankId < 0) {
      setError("Invalid Job Rank selected.");
      setLoading(false);
      return;
    }

    if (departmentId === undefined || departmentId < 1) {
      setError("Invalid Department selected.");
      setLoading(false);
      return;
    }

    // Prepare payload with valid IDs
    const payload = {
      ...formData,
      jobRank: jobRankId,
      departmentId: departmentId,
    };

    try {
      const newStaff = await createStaff(payload);
      onSuccess(newStaff);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="px-4 py-2 cursor-pointer">
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Staff</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Staff Name */}
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

          {/* Job Rank (Dropdown) */}
          <div className="mb-4">
            <label htmlFor="jobRank" className="block font-medium mb-1">
              Job Rank
            </label>
            <select
              id="jobRank"
              name="jobRank"
              value={formData.jobRank}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select Job Rank</option>
              {jobRanks.map((rank) => (
                <option key={rank.id} value={rank.id}>
                  {rank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
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

          {/* User ID */}
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

          {/* Department (Dropdown) */}
          <div className="mb-4">
            <label htmlFor="departmentId" className="block font-medium mb-1">
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Buttons */}
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
