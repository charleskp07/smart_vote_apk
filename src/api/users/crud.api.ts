import type { user } from "../../data/models/user.model";
import axiosInstance from "../axios_instance";

export const userApi = {

    getAll: async (): Promise<user[]> => {
        const response = await axiosInstance.get('/admin/users');
        return response.data;
    },

    create: async (formData: FormData): Promise<user[]> => {
        const response = await axiosInstance.post('/admin/users', formData);
        return response.data;
    },

    read: async (id: number): Promise<user> => {
        const response = await axiosInstance.get(`/admin/users/${id}/`);
        return response.data;
    },

    update: async (id: number, formData: FormData): Promise<user[]> => {
        const response = await axiosInstance.post(`/admin/users/${id}/`, formData) ;
        return response.data;
    },

    destroy: async (id: number): Promise<user[]> => {
        const response = await axiosInstance.delete(`/admin/users/${id}/`);
        return response.data;
    },

}