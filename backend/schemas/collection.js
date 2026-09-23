import { z } from 'zod';

export const createCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(500).optional()
}).strict();

export const updateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100).optional(),
  description: z.string().trim().max(500).optional()
}).strict().refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });
