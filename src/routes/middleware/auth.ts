import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserPayload, UserRole } from '../../types/user-privileges.js';
import { User } from '../../types/user-privileges.js';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

export function authenticateUser(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as UserPayload;

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export function authorizeRoles(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: 'Access denied: Insufficient permissions' });
            return;
        }
        next();
    };
}

// Assume User is your database model (Prisma, Mongoose, Sequelize, etc.)

export async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // 1. Hash the plain-text password
  const hashedPassword = await hashPassword(password);

  // 2. Force the role to 'user' so nobody can self-assign 'admin'
  const newUser = await User.create({
    email,
    password: hashedPassword,
    role: 'user',
  });

  res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  // 1. Generate a unique 16-byte random salt
  const salt = randomBytes(16).toString('hex');

  // 2. Hash the password with the salt (64-byte output length)
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;

  // 3. Store both salt and hash together separated by a colon
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // 1. Split the stored string back into the salt and original hash
  const [salt, key] = storedHash.split(':');
  if (!salt || !key)
    return false;

  const keyBuffer = Buffer.from(key, 'hex');

  // 2. Hash the incoming login password using the salt
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  if (keyBuffer.length !== derivedKey.length)
    return false;
  return timingSafeEqual(keyBuffer, derivedKey);
}
