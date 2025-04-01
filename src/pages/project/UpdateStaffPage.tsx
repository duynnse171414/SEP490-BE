import React, { useState } from 'react';

export function UpdateStaffProjectModal({ projectId, staff, availableRoles, onUpdateStaff }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(staff.roleInProject);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpdate = async () => {
    if (!selectedRole) {
      alert('Please select a role.');
      return;
    }

    // Prepare the staff update payload
    const staffProjectUpdate = {
      staffId: staff.id,
      roleInProject: selectedRole,
      projectId: projectId,
      updateAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const response = await fetch(`/api/project/update-staff-in-project?projectId=${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([staffProjectUpdate]), // Send as an array
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateStaff(staffProjectUpdate); // Update the staff data in the parent component
        closeModal();
        alert("Staff updated successfully!");
      } else {
        setError(data.message || "Failed to update staff");
      }
    } catch (err) {
      setError("An error occurred while updating staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update Staff in Project</h2>

            {/* Show Error Message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Staff Name:</label>
              <p>{staff.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role:</label>
              <select
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${loading && 'opacity-50 cursor-not-allowed'}`}
              >
                {loading ? 'Updating...' : 'Update Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
