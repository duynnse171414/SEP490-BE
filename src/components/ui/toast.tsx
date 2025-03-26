import React from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
};

export const Toast = ({ message, type }: ToastProps) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg`}>
      {message}
    </div>
  );
};

export const toast = {
  success: (message: string) => {
    alert(`Success: ${message}`); // Thay alert bằng logic hiển thị thực tế của bạn
  },
  error: (message: string) => {
    alert(`Error: ${message}`); // Thay alert bằng logic hiển thị thực tế của bạn
  },
};
