import express from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from './middleware/auth.js';
import type { UserPayload } from '../types/user-privileges.js';
import { User } from '../types/user-privileges.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const hashedPassword = await hashPassword(password);

  // Save to your database with default 'user' role
  const newUser = await User.create({
    email,
    password: hashedPassword,
    role: 'user',
  });

  res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
});

// POST /api/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
        res.status(400).json({ message: 'provide an email and password' });
        return;
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    // Verify the password using it's salt and hashing it
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    // Sign the JWT with the user's ID and role ('admin' or 'user')
    const payload: UserPayload = { id: user.id, role: user.role };
    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.json({ token });
});

export default router;
