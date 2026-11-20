export interface LidResult {
  detectedLanguage: string;
  confidence: number;
  mocked: true;
}

/**
 * Automatic language identification for native-speaker verification clips — the first filter
 * before a user can list a language as native, per the app's "no heavy ID-document verification"
 * approach.
 *
 * MOCKED for now: it always reports the claimed language back with high confidence, since there's
 * no real detector wired in yet. This is the single integration point to swap for a real one
 * later (e.g. a cloud speech API that returns a language-confidence score) — callers only need
 * `identifyLanguage(audio, claimedLanguage)` to keep returning a `LidResult`, nothing else in the
 * app needs to change.
 */
export async function identifyLanguage(_audioBuffer: Buffer, claimedLanguage: string): Promise<LidResult> {
  return { detectedLanguage: claimedLanguage, confidence: 0.99, mocked: true };
}
