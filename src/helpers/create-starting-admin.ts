import 'dotenv/config';
import { hashPassword } from '../routes/middleware/auth.js'
import { User } from '../types/user-privileges.js'

export async function createInitialAdmin() {
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL!;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD!;

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  await User.create({
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
  });
}