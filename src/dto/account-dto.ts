
export interface SimpleAccountDTO {
    username: string,
    email: string,
}

export interface UpdateAccountDTO {
    id: number,
    newPassword?: string,
    newUsername?: string,
    newEmail?: string,
}






