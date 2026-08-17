import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { FeedbackInput } from '../schemas/feedbackSchema.js';

// Phase-1 storage: no database yet, so submissions are appended to a JSON file on disk.
// Note this lives on the server's local filesystem — it survives restarts but not a fresh
// deploy/volume reset, so it's a mailbox for now, not durable long-term storage.
const DATA_DIR = path.resolve(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

export interface StoredFeedback extends FeedbackInput {
  id: string;
  submittedAt: string;
}

async function readAll(): Promise<StoredFeedback[]> {
  try {
    const raw = await readFile(FEEDBACK_FILE, 'utf-8');
    return JSON.parse(raw) as StoredFeedback[];
  } catch {
    return [];
  }
}

export async function saveFeedback(input: FeedbackInput): Promise<StoredFeedback> {
  await mkdir(DATA_DIR, { recursive: true });
  const entries = await readAll();
  const entry: StoredFeedback = {
    ...input,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
  };
  entries.push(entry);
  await writeFile(FEEDBACK_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  // Also surface in server logs so it's visible even if the disk resets on redeploy.
  // eslint-disable-next-line no-console
  console.log('[feedback]', JSON.stringify(entry));
  return entry;
}

export async function listFeedback(): Promise<StoredFeedback[]> {
  return readAll();
}
