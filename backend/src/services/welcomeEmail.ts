import { env, isResendConfigured } from '../env.js';

export class WelcomeEmailNotConfiguredError extends Error {
  constructor() {
    super('Welcome emails are not configured on the server yet (missing RESEND_API_KEY).');
    this.name = 'WelcomeEmailNotConfiguredError';
  }
}

const COPY = {
  es: {
    subject: 'Bienvenida a Heritage Speakers',
    heading: 'Bienvenida a Heritage Speakers',
    body: [
      'Gracias por unirte. Heritage Speakers está pensado para hablantes de herencia: gente que entiende el idioma de su familia pero quiere hablarlo, leerlo y escribirlo con la misma soltura.',
      'Tienes dos formas de avanzar: una práctica diaria corta centrada en una destreza, o un modo examen riguroso por nivel CEFR (A1 a C2), destreza por destreza.',
      'Cuando quieras, vuelve a la web y elige por dónde empezar.',
    ],
    cta: 'Ir a Heritage Speakers',
  },
  en: {
    subject: 'Welcome to Heritage Speakers',
    heading: 'Welcome to Heritage Speakers',
    body: [
      "Thanks for joining. Heritage Speakers is built for heritage speakers: people who understand their family's language but want to speak, read, and write it just as fluently.",
      'You have two ways to progress: a short daily practice focused on one skill, or a rigorous exam mode by CEFR level (A1 to C2), skill by skill.',
      'Whenever you\'re ready, come back and choose where to start.',
    ],
    cta: 'Go to Heritage Speakers',
  },
};

function renderHtml(uiLanguage: 'en' | 'es', appUrl: string): string {
  const t = COPY[uiLanguage];
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#faf7f3;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f3;padding:32px 0;">
      <tr><td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#6b1f2e;padding:28px 32px;">
            <span style="color:#faf7f3;font-family:Georgia,serif;font-size:20px;font-weight:700;">Heritage Speakers</span>
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="color:#3a0f19;font-size:22px;margin:0 0 16px;">${t.heading}</h1>
            ${t.body.map((p) => `<p style="color:#2a2320;font-size:15px;line-height:1.7;margin:0 0 14px;">${p}</p>`).join('\n')}
            <a href="${appUrl}" style="display:inline-block;margin-top:8px;background:#b8935a;color:#3a0f19;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:999px;font-family:sans-serif;font-size:14px;">${t.cta}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendWelcomeEmail(to: string, uiLanguage: 'en' | 'es'): Promise<void> {
  if (!isResendConfigured) throw new WelcomeEmailNotConfiguredError();

  const appUrl = env.corsOrigin;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.resendFromEmail,
      to: [to],
      subject: COPY[uiLanguage].subject,
      html: renderHtml(uiLanguage, appUrl),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend request failed (${res.status}): ${detail}`);
  }
}
