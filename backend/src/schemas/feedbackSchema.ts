import { z } from 'zod';

export const feedbackSchema = z.object({
  category: z.enum(['bug', 'idea', 'other']),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  message: z.string().min(1).max(4000),
  contactEmail: z.string().email().max(200),
  contactPhone: z.string().min(1).max(40),
  uiLanguage: z.enum(['en', 'es']).optional(),
  learningLanguage: z.enum(['es', 'ru']).optional(),
  page: z.string().max(300).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
