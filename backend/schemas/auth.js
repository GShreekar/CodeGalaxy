import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  // bcrypt silently ignores anything past 72 bytes, so cap there rather than let it surprise a user
  password: z.string().min(8, 'Password must be at least 8 characters').max(72)
}).strict();

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
}).strict();
