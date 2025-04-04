"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useJobRanks } from "@/features/admin/hooks/useJobRanks"
import { useDepartments } from "@/features/admin/hooks/useDepartments"

const UpdateModal = ({ isOpen, onClose, onSubmit, staff }: any) => {
  const [formData, setFormData] = useState(staff || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: jobRanks } = useJobRanks()
  const { data: departments } = useDepartments()

  useEffect(() => {
    if (isOpen && staff) {
      
      const elementJobRank = jobRanks?.find((item) => item.name === staff?.jobRank)
      const elementDepartments = departments?.find((item: any) => item.name === staff?.departmentName)

      console.log("Found job rank:", elementJobRank)
      console.log("Staff job rank:", staff?.jobRank)
      console.log("All job ranks:", jobRanks)

      setFormData({
        staffName: staff?.staffName || "",
        salary: staff?.salary || 0,
        jobRank: elementJobRank ? elementJobRank.id : "",
        department: elementDepartments ? elementDepartments.id : "",
        status: staff?.isActive ? "active" : "inactive",
      })
    }
  }, [isOpen, staff, jobRanks, departments])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(`Changing ${name} to:`, value)

    if (name === "jobRank" || name === "department") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      })
    } else if (name === "salary") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async () => {
    const payload = {
      staffId: staff.staffId,
      staffName: formData.staffName.trim(),
      salary: Number(formData.salary),
      jobRank: Number(formData.jobRank),
      department: Number(formData.department),
      status: formData.status === "active",
    }

    if (!payload.staffName) {
      alert("Staff Name is required.")
      return
    }
    if (payload.salary <= 0) {
      alert("Salary must be greater than 0.")
      return
    }
    if (payload.jobRank < 0) {
      alert("Job Rank must be selected.");
      return;
    }
    if (!payload.department) {
      alert("Department must be selected.")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(payload)
    } catch (error) {
      console.error("Error updating staff:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-black">Update Staff</h2>
        <form className="space-y-4">
          {/* Staff Name */}
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

          {/* Job Rank */}
          <div>
            <label htmlFor="jobRank" className="block text-black">
              Job Rank
            </label>
            <select
              id="jobRank"
              name="jobRank"
              value={formData.jobRank}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            >
              <option value="">Select Job Rank</option>
              {jobRanks?.map((rank: { id: number; name: string }) => (
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
              value={formData.department}
              onChange={handleChange}
              className="w-full border-black border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
            >
              <option value="">Select Department</option>
              {departments?.map((dept: { id: number; name: string }) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-black">
              Status
            </label>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setFormData({ ...formData, status: formData.status === "active" ? "inactive" : "active" })}
            >
              <span
                className={`px-2 py-1 rounded-md ${
                  formData.status === "active" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {formData.status}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateModal

