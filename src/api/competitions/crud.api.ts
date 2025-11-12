import type { competition } from "../../data/models/competition.model";
import axiosInstance from "../axios_instance";

export const competitionApi = {

    getAll: async (): Promise<competition[]> => {
        const response = await axiosInstance.get('/competitions');
        return response.data.data;
    },

    create: async (formData: FormData): Promise<competition[]> => {
        const response = await axiosInstance.post('/competitions', formData);
        return response.data;
    },

    read: async (id: number): Promise<competition> => {
        const response = await axiosInstance.get(`/competitions/${id}/`);
        return response.data.data;
    },


    destroy: async (id: number): Promise<competition[]> => {
        const response = await axiosInstance.delete(`/competitions/${id}/`);
        return response.data;
    },

}