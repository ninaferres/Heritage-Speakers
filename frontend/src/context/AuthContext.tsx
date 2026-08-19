import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { sendWelcomeEmail } from '../api/client';

// Matches LanguageContext's storage key — read directly instead of via useLanguage() so this
// doesn't depend on provider nesting order.
const UI_LANGUAGE_STORAGE_KEY = 'hs.uiLanguage';

// Fires once per freshly-created account, regardless of how it signed in (password — with or
// without Supabase's email-confirmation step delaying the session — or Google OAuth). Right
// after signUp() often has no session yet if email confirmation is required, so sending from
// there (as before) silently did nothing; onAuthStateChange only fires once a session actually
// exists, whenever that ends up being. "Fresh" is inferred from the account's age rather than
// tracked in localStorage, so a first login on a new device never re-sends it for an old account.
const welcomedThisSession = new Set<string>();
function maybeSendWelcomeEmail(user: User | undefined) {
  if (!user || welcomedThisSession.has(user.id)) return;
  const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0;
  const isFreshSignup = createdAt > 0 && Date.now() - createdAt < 5 * 60 * 1000;
  if (!isFreshSignup) return;
  welcomedThisSession.add(user.id);
  const uiLanguage = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY) === 'es' ? 'es' : 'en';
  sendWelcomeEmail(uiLanguage).catch(() => {});
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      maybeSendWelcomeEmail(data.session?.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      maybeSendWelcomeEmail(next?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      async signInWithPassword(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUpWithPassword(email, password) {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
      },
      async signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.href },
        });
        return { error: error?.message ?? null };
      },
      async signInWithApple() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: { redirectTo: window.location.href },
        });
        return { error: error?.message ?? null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
