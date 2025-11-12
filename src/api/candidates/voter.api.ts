
import type { candidate } from "../../data/models/candidate.model";
import axiosInstance from "../axios_instance";

export const VoterCandidateApi = {

    getAll: async (): Promise<candidate[]> => {
        const response = await axiosInstance.get('/voter/candidates/index');
        return response.data.data;
    },

    read: async (id: number): Promise<candidate> => {
        const response = await axiosInstance.get(`/voter/candidates/${id}/show`);
        return response.data.data;
    },

}