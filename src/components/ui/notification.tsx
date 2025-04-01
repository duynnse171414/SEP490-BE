// src/components/ToastNotification.tsx
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification: React.FC = () => {
  return (
    <>
      <ToastContainer />
    </>
  );
};

// Xuất các hàm để sử dụng ở nơi khác
export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export { ToastNotification };