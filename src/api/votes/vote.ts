import type { vote } from "../../data/models/vote.model";
import axiosInstance from "../axios_instance";

export const VoteApi = {
    
    createVote: async (formData: FormData): Promise<vote> => {
        const response = await axiosInstance.post('/vote/init', formData);
        return response.data;
    },
    

}