import { randomUUID } from 'crypto';
import 'express';
import type { JwtPayload } from 'jsonwebtoken';

export type UserRole = 'admin' | 'user';

export interface UserPayload extends JwtPayload {
    id: string;
    role: UserRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    role: UserRole;
}

// users are currently stored in-memory - might want this to be in the database
const users: IUser[] = [];

export const User = {
    async create(data: Omit<IUser, 'id'>): Promise<IUser> {
        const newUser: IUser = {
            id: randomUUID(),
            ...data,
        };
        users.push(newUser);
        return newUser;
    },

    async findOne(query: { email: string }): Promise<IUser | undefined> {
        return users.find((u) => u.email === query.email);
    },

    async updateRole(id: string, role: UserRole): Promise<IUser | undefined> {
        const user = users.find((u) => u.id === id);
        if (user) {
            user.role = role;
        }
        return user;
    },
};