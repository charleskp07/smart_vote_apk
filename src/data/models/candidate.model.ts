export enum GenderEnums {
  MASCULIN = "M",
  FEMININ = "F",
}

export type candidate = {
    id: number,
    competition_id: number,
    photo: string,
    first_name: string,
    last_name: string,
    gender: GenderEnums,
    birth_date: string,
    height: number,
    weight: number,
    nationality: string, 
    description: string, 
    accumulated_vote: number, 
    success: boolean,
}
