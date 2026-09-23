import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().toLowerCase().email('Invalid email address').optional()
}).strict();
