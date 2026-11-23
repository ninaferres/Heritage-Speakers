// Fixed set of interest topics for Connect profiles — shown as chips to fill in (required
// before saving) and shown again on each match's card in "Buscar" so people can see what they
// have in common. Mirrored in the backend's connectInterestSchema.
export type ConnectInterestCode =
  | 'travel'
  | 'music'
  | 'movies'
  | 'cooking'
  | 'sports'
  | 'reading'
  | 'art'
  | 'tech'
  | 'nature'
  | 'history'
  | 'gaming'
  | 'fashion';

export const CONNECT_INTERESTS: { code: ConnectInterestCode; es: string; en: string }[] = [
  { code: 'travel', es: 'Viajes', en: 'Travel' },
  { code: 'music', es: 'Música', en: 'Music' },
  { code: 'movies', es: 'Cine y series', en: 'Movies & TV' },
  { code: 'cooking', es: 'Cocina', en: 'Cooking' },
  { code: 'sports', es: 'Deporte', en: 'Sports' },
  { code: 'reading', es: 'Lectura', en: 'Reading' },
  { code: 'art', es: 'Arte', en: 'Art' },
  { code: 'tech', es: 'Tecnología', en: 'Technology' },
  { code: 'nature', es: 'Naturaleza', en: 'Nature' },
  { code: 'history', es: 'Historia', en: 'History' },
  { code: 'gaming', es: 'Videojuegos', en: 'Gaming' },
  { code: 'fashion', es: 'Moda', en: 'Fashion' },
];

export function interestLabel(code: string, uiLanguage: 'es' | 'en'): string {
  return CONNECT_INTERESTS.find((i) => i.code === code)?.[uiLanguage] ?? code;
}
