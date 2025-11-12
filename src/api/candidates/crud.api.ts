
import type { candidate } from "../../data/models/candidate.model";
import axiosInstance from "../axios_instance";

export const CandidateApi = {

    getAll: async (): Promise<candidate[]> => {
        const response = await axiosInstance.get('/candidates');
        return response.data.data;
    },

    
    create: async (formData: FormData): Promise<candidate[]> => {
        const response = await axiosInstance.post('/candidates', formData);
        return response.data;
    },
    
    read: async (id: number): Promise<candidate> => {
        const response = await axiosInstance.get(`/candidates/${id}/`);
        return response.data.data;
    },


    destroy: async (id: number): Promise<candidate[]> => {
        const response = await axiosInstance.delete(`/candidates/${id}/`);
        return response.data;
    },

}