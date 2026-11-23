import { z } from 'zod';

const hourSlotSchema = z.array(z.number().int().min(0).max(23));

// A recurring weekly template: one array of available hours (0-23, each a 1-hour slot start)
// per day of week, in the user's own timezone. 1 hour is the minimum granularity on purpose.
export const connectAvailabilitySchema = z.object({
  mon: hourSlotSchema,
  tue: hourSlotSchema,
  wed: hourSlotSchema,
  thu: hourSlotSchema,
  fri: hourSlotSchema,
  sat: hourSlotSchema,
  sun: hourSlotSchema,
});

// Fixed set of interest-topic codes, mirrored in the frontend's CONNECT_INTERESTS —
// shown on match cards to help pick who to book with.
export const connectInterestSchema = z.enum([
  'travel', 'music', 'movies', 'cooking', 'sports', 'reading', 'art', 'tech', 'nature', 'history', 'gaming', 'fashion',
]);

export const connectProfileInputSchema = z.object({
  bio: z.string().max(500).optional(),
  nativeLanguages: z.array(z.enum(['es', 'ru', 'en'])).optional(),
  learningLanguages: z.array(z.enum(['es', 'ru', 'en'])).optional(),
  timezone: z.string().min(1).max(100).optional(),
  availability: connectAvailabilitySchema.optional(),
  interests: z.array(connectInterestSchema).optional(),
});

export type ConnectProfileInputBody = z.infer<typeof connectProfileInputSchema>;

export const connectLanguageSchema = z.enum(['es', 'ru', 'en']);

export const bookConnectSessionSchema = z.object({
  nativeSpeakerId: z.string().uuid(),
  language: connectLanguageSchema,
  scheduledAt: z.string().datetime(),
  mode: z.enum(['audio', 'text']).optional(),
  // Pricing is 1 credit per 10 minutes — 30 min (3 credits) is the hard cap.
  durationMinutes: z.union([z.literal(10), z.literal(20), z.literal(30)]).optional(),
});

export type BookConnectSessionBody = z.infer<typeof bookConnectSessionSchema>;

