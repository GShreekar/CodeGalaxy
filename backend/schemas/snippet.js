import { z } from 'zod';
import { LANGUAGES } from '../constants/languages.js';

// not .strict(): the client harmlessly sends an `author` field the controller
// already ignores (author is always derived server-side from the authenticated user)
export const createSnippetSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  language: z.enum(LANGUAGES, { message: `Language must be one of: ${LANGUAGES.join(', ')}` }),
  code: z.string().trim().min(1, 'Code is required').max(100000)
});

export const addCommentSchema = z.object({
  text: z.string().trim().min(1, 'Comment cannot be empty').max(1000)
}).strict();

// same field rules as create, but every field is optional since an edit may touch just one
export const updateSnippetSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120).optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000).optional(),
  language: z.enum(LANGUAGES, { message: `Language must be one of: ${LANGUAGES.join(', ')}` }).optional(),
  code: z.string().trim().min(1, 'Code is required').max(100000).optional()
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });
