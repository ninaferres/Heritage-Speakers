import { z } from 'zod';

const availabilityBlockSchema = z.enum(['morning', 'afternoon', 'evening']);

export const connectAvailabilitySchema = z.object({
  weekday: z.array(availabilityBlockSchema),
  weekend: z.array(availabilityBlockSchema),
});

export const connectProfileInputSchema = z.object({
  bio: z.string().max(500).optional(),
  nativeLanguages: z.array(z.enum(['es', 'ru'])).optional(),
  learningLanguages: z.array(z.enum(['es', 'ru'])).optional(),
  timezone: z.string().min(1).max(100).optional(),
  availability: connectAvailabilitySchema.optional(),
});

export type ConnectProfileInputBody = z.infer<typeof connectProfileInputSchema>;

export const connectLanguageSchema = z.enum(['es', 'ru']);

export const bookConnectSessionSchema = z.object({
  nativeSpeakerId: z.string().uuid(),
  language: connectLanguageSchema,
  scheduledAt: z.string().datetime(),
  mode: z.enum(['audio', 'text']).optional(),
  durationMinutes: z.number().int().min(10).max(30).optional(),
});

export type BookConnectSessionBody = z.infer<typeof bookConnectSessionSchema>;

