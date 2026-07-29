import { CefrLevel, SkillId } from './types';

export const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const SKILLS: { id: SkillId; sub: string }[] = [
  { id: 'Speaking', sub: 'Natural conversation & pronunciation' },
  { id: 'Reading', sub: 'Articles, documents & literature' },
  { id: 'Listening', sub: 'Real conversations & media' },
  { id: 'Writing', sub: 'Emails, essays & formal text' },
];
