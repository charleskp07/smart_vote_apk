import type { twofactor } from "../../data/models/twofactor.model";
import type { user } from "../../data/models/user.model";
import axiosInstance from "../axios_instance";

export const authenticationApi = {
    login: async (formData: FormData): Promise<user> => {
        const response = await axiosInstance.post('/login', formData);
        return response.data;
    },

    twoFactor: async (formData: FormData): Promise<twofactor> => {
        const response = await axiosInstance.post('/twofactorcode-verify', formData);
        return response.data;
    },

}