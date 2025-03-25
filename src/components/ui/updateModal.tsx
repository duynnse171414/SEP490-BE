import React, { useState, useEffect } from "react";

const updateModal = ({ isOpen, onClose, onSubmit, staff, jobRanks = [], departments = [] }: any) => {
  const [formData, setFormData] = useState(staff || {});

  useEffect(() => {
    if (isOpen) {
      setFormData(staff || {}); // Reset formData về giá trị ban đầu mỗi khi popup được mở
    }
  }, [isOpen, staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData); // Gửi dữ liệu đã chỉnh sửa
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-black">Update Staff</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="staffName" className="block text-black">
              Staff Name
            </label>
            <input
              type="text"
              id="staffName"
              name="staffName"
              value={formData.staffName || ""}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            />
          </div>

          {/* Job Rank */}
          <div>
            <label htmlFor="jobRank" className="block text-black">
              Job Rank
            </label>
            <select
              id="jobRank"
              name="jobRank"
              value={formData.jobRank || ""}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            >
              <option value="">Select Job Rank</option>
              {jobRanks?.map((rank: { id: number, name: string }) => (
                <option key={rank.id} value={rank.id}>
                  {rank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-black">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary || ""}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-black">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            >
              <option value="">Select Department</option>
              {departments?.map((dept: { id: number, name: string }) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gray-300 text-black px-4 py-2 rounded-md cursor-pointer hover:bg-gray-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default updateModal;
