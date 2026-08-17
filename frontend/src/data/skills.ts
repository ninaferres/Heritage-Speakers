import { CefrLevel, SkillId } from './types';

export const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const SKILLS: { id: SkillId; sub: { es: string; en: string } }[] = [
  { id: 'Speaking', sub: { es: 'Conversación natural y pronunciación', en: 'Natural conversation & pronunciation' } },
  { id: 'Reading', sub: { es: 'Artículos, documentos y literatura', en: 'Articles, documents & literature' } },
  { id: 'Listening', sub: { es: 'Conversaciones reales y medios', en: 'Real conversations & media' } },
  { id: 'Writing', sub: { es: 'Correos, ensayos y texto formal', en: 'Emails, essays & formal text' } },
];
