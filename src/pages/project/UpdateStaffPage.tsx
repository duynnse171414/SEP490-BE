"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "react-router-dom";

const BASE_URL = "https://localhost:7100/api";

interface UpdateStaffPageProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: number;
  onSubmit: (updatedStaff: any) => void;
}

const UpdateStaffPage = ({ isOpen, onClose, staffId, onSubmit }: UpdateStaffPageProps) => {
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffId) {
      setLoading(true);
      fetch(`${BASE_URL}/Staffs/${staffId}`)
        .then((res) => res.json())
        .then((data) => {
          setStaff(data.data); 
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching staff:", error);
          setLoading(false);
        });
    }
  }, [staffId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({
      ...staff,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    fetch(`${BASE_URL}/Staffs/${staffId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(staff), 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Staff updated:", data);
        onSubmit(staff); 
        setLoading(false);
        onClose(); 
      })
      .catch((error) => {
        console.error('Error updating staff:', error);
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Staff Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : staff ? (
          <div className="space-y-4">
            <div>
              <label>Staff Name</label>
              <Input
                value={staff.staffName}
                name="staffName"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                value={staff.email}
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={handleSubmit}>Save Changes</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>No staff data found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStaffPage;
