import axiosInstance from "@/api/axiosInstance";

export const useCreateClaims = async (url: string, data: any) => {
    try {
        const res = await axiosInstance.post(url, data);
        return res.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Lỗi hệ thống hoặc dữ liệu không hợp lệ.";
        throw new Error(message);
    }
};