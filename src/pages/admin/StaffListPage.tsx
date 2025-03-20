// pages/staff-list.tsx
import { useStaff, useStaffs } from "@/features/admin/hooks/useStaff";
import { useState } from "react";

const StaffListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { data: staffs, isLoading, error } = useStaff(pageNumber);

  console.log(staffs);
  console.log(pageNumber);

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  if (isLoading) {
    return <div>Loading staffs...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!Array.isArray(staffs) || !staffs.length) {
    return <div>No staffs found.</div>; // hoặc loading
  }

  return (
    <div>
      <h2>Staff List</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Staff Name</th>
            <th>Job Rank</th>
            <th>Salary</th>
            <th>Department</th>
            <th>Active</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.staffId}>
              <td>{staff.email}</td>
              <td>{staff.staffName}</td>
              <td>{staff.jobRank}</td>
              <td>{staff.salary}</td>
              <td>{staff.departmentName}</td>
              <td>{staff.isActive ? "Yes" : "No"}</td>
              <td>{staff.createAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div>
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        <span>Page {pageNumber}</span>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          // disabled={!staffs || staffs.length < 10}
          disabled={staffs.length < 3}
        >
          {" "}
          {/* Disable Next if last page*/}
          Next
        </button>
      </div>
    </div>
  );
};

export default StaffListPage;
