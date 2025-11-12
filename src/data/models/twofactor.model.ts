import type { user } from "./user.model";


export type twofactor = {
    id: number,
    email: string,
    code: number,
    success: boolean;
    user: user,
    token: string;
    error?: string;

}
