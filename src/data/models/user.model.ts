
export enum RoleEnums {
  SYSTEME_ADMIN = "Administrateur du système",
  ADMIN = "Administrateur",
}


export type user = {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    role: RoleEnums,
    success: boolean,
    message: string,
}

