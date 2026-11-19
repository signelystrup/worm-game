
// Relevant user info:
export interface SimpleAccountDTO {
    username: string,
    email: string,
}

// password, username, and email are all optional. If they are not set, they will not be updated.
export interface UpdateAccountDTO {
    id: number,
    password?: string,
    username?: string,
    email?: string,
}






