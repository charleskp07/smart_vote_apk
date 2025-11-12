import type { competition } from "../../data/models/competition.model";
import axiosInstance from "../axios_instance";

export const VoterCompetitionApi = {

    getAll: async (): Promise<competition[]> => {
        const response = await axiosInstance.get('/voter/competitions/index');
        return response.data.data;
    },

    read: async (id: number): Promise<Array<competition>> => {
        const response = await axiosInstance.get(`/voter/competitions/${id}/show`);
        return response.data.data;
    },

}