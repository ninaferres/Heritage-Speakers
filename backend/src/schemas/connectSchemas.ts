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
