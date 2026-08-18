import { createClient } from '@supabase/supabase-js';
import { env, isAuthConfigured } from '../env.js';
import { FeedbackInput } from '../schemas/feedbackSchema.js';

export class FeedbackNotConfiguredError extends Error {
  constructor(detail?: string) {
    super(detail ?? 'The feedback mailbox is not configured on the server yet (missing SUPABASE_URL / SUPABASE_ANON_KEY).');
    this.name = 'FeedbackNotConfiguredError';
  }
}

export interface StoredFeedback extends FeedbackInput {
  id: string;
  submittedAt: string;
}

function anonClient() {
  if (!isAuthConfigured) throw new FeedbackNotConfiguredError();
  return createClient(env.supabaseUrl!, env.supabaseAnonKey!);
}

// The public submission form has no user session to scope a request to, so it writes with the
// plain anon key — safe because the table's only RLS policy is a wide-open INSERT (see
// backend/supabase/feedback.sql). Reading needs the service-role key instead (see listFeedback).
export async function saveFeedback(input: FeedbackInput): Promise<StoredFeedback> {
  const { data, error } = await anonClient()
    .from('feedback')
    .insert({
      category: input.category,
      first_name: input.firstName,
      last_name: input.lastName,
      message: input.message,
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone,
      ui_language: input.uiLanguage,
      learning_language: input.learningLanguage,
      page: input.page,
    })
    .select()
    .single();
  if (error) throw new Error(`Failed to save feedback: ${error.message}`);

  const entry = fromRow(data);
  // Also surface in server logs as a fallback, in case Supabase is briefly unreachable to read back.
  // eslint-disable-next-line no-console
  console.log('[feedback]', JSON.stringify(entry));
  return entry;
}

// Only reachable via the already-gated GET /api/feedback route (shared-secret x-admin-key
// check happens before this is ever called) — the service-role key bypasses RLS on purpose,
// since feedback contains contact info that must not be readable via the public anon key.
export async function listFeedback(): Promise<StoredFeedback[]> {
  if (!isAuthConfigured) throw new FeedbackNotConfiguredError();
  if (!env.supabaseServiceRoleKey) {
    throw new FeedbackNotConfiguredError('Reading feedback requires SUPABASE_SERVICE_ROLE_KEY to be set on the server.');
  }
  const client = createClient(env.supabaseUrl!, env.supabaseServiceRoleKey);
  const { data, error } = await client.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to load feedback: ${error.message}`);
  return (data ?? []).map(fromRow);
}

function fromRow(row: any): StoredFeedback {
  return {
    id: row.id,
    category: row.category,
    firstName: row.first_name,
    lastName: row.last_name,
    message: row.message,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    uiLanguage: row.ui_language ?? undefined,
    learningLanguage: row.learning_language ?? undefined,
    page: row.page ?? undefined,
    submittedAt: row.created_at,
  };
}
