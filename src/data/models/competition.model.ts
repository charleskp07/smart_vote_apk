import type { candidate } from "./candidate.model"

export type competition = {
    id: number,
    user_id: number,
    image: string,
    name: string,
    description: string,
    start_date: string,
    end_date: string, 
    vote_value: number, 
    success: boolean,
    candidates: Array<candidate>
}
