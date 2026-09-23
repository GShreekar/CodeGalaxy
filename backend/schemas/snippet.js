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
