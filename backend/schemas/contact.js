import { z } from 'zod';

export const submitContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(100),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  text: z.string().trim().min(1, 'Message is required').max(1000)
}).strict();
