import type { competition } from "../../data/models/competition.model";
import axiosInstance from "../axios_instance";

export const competitionApi = {

    getAll: async (): Promise<competition[]> => {
        const response = await axiosInstance.get('/admin/competitions');
        return response.data.data;
    },

    create: async (formData: FormData): Promise<competition[]> => {
        const response = await axiosInstance.post('/admin/competitions', formData);
        return response.data;
    },

    read: async (id: number): Promise<competition> => {
        const response = await axiosInstance.get(`/admin/competitions/${id}/`);
        return response.data.data;
    },


    destroy: async (id: number): Promise<competition[]> => {
        const response = await axiosInstance.delete(`/admin/competitions/${id}/`);
        return response.data;
    },

}