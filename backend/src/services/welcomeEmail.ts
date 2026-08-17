import { env, isResendConfigured } from '../env.js';

export class WelcomeEmailNotConfiguredError extends Error {
  constructor() {
    super('Welcome emails are not configured on the server yet (missing RESEND_API_KEY).');
    this.name = 'WelcomeEmailNotConfiguredError';
  }
}

interface WelcomePoint {
  title: string;
  body: string;
}

const COPY = {
  es: {
    subject: '¡Te damos la bienvenida a Heritage Speakers!',
    greeting: '¡Hola!',
    intro: [
      'Nos hace mucha ilusión que formes parte de Heritage Speakers.',
      'Reconectar con la lengua de tu familia no es solo estudiar un idioma: es reencontrarte con tus raíces, tus recuerdos y tu historia. Queremos ser ese lugar seguro donde te sientas en casa mientras ganas confianza al hablar, leer y escribir.',
    ],
    ctaIntro: 'Para dar el primer paso, te invitamos a conocer nuestras rutas de aprendizaje:',
    cta: 'Explora las rutas de aprendizaje',
    pointsTitle: 'Tu punto de partida:',
    points: [
      { title: 'Elige tu propio camino', body: 'Explora los itinerarios y encuentra el que mejor se adapte a tu momento actual.' },
      { title: 'Avanza a tu ritmo', body: 'Disfruta de contenidos prácticos diseñados para soltarte y expresarte de forma natural.' },
      { title: 'Siente el respaldo de la comunidad', body: 'Comparte vivencias y aprendizajes con personas que viven un proceso similar al tuyo.' },
    ] as WelcomePoint[],
    closing: 'Si tienes cualquier duda o quieres que te ayudemos a elegir tu ruta, responde a este correo. Estamos aquí para acompañarte en todo el camino.',
    signoffLine1: 'Un cálido abrazo,',
    signoffLine2: 'El equipo de Heritage Speakers',
  },
  en: {
    subject: 'Welcome to Heritage Speakers!',
    greeting: 'Hi there,',
    intro: [
      'We are truly excited to have you join Heritage Speakers.',
      "Reconnecting with your family's language is about so much more than studying: it's about reconnecting with your roots, your memories, and your story. We want to be a welcoming space where you feel right at home while building confidence in speaking, reading, and writing.",
    ],
    ctaIntro: 'To take your first step, we invite you to explore our learning paths:',
    cta: 'Explore Learning Paths',
    pointsTitle: 'Your starting point:',
    points: [
      { title: 'Choose your path', body: 'Browse our tracks and find the one that best matches where you are today.' },
      { title: 'Go at your own pace', body: 'Enjoy practical lessons designed to help you express yourself naturally.' },
      { title: 'Connect with community', body: 'Share experiences and learn alongside people who are on a similar journey.' },
    ] as WelcomePoint[],
    closing: "If you have any questions or need help picking the right path, just reply to this email. We're here to guide you every step of the way.",
    signoffLine1: 'Warmly,',
    signoffLine2: 'The Heritage Speakers Team',
  },
};

// Same arc mark used in the site header (frontend/src/components/Logo.tsx), reproduced inline
// since email clients can't load app assets. Most clients render inline SVG fine; the ones that
// don't (older Outlook) just show the wordmark next to it, so it degrades gracefully.
const LOGO_SVG = `<svg width="34" height="22" viewBox="0 0 215 138" xmlns="http://www.w3.org/2000/svg">
  <path d="M29.64 107.75 C81.64 28.01 133.64 28.01 185.64 107.75" fill="none" stroke="#faf7f3" stroke-width="18.2" stroke-linecap="round" />
  <path d="M58.24 107.75 C91.17 62.68 124.10 62.68 157.04 107.75" fill="none" stroke="#b8935a" stroke-width="13" stroke-linecap="round" />
</svg>`;

function renderHtml(uiLanguage: 'en' | 'es', appUrl: string): string {
  const t = COPY[uiLanguage];
  const pathsUrl = `${appUrl}#paths`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#efe9e0;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#efe9e0;padding:36px 16px;">
      <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#faf7f3;border-radius:18px;overflow:hidden;box-shadow:0 4px 20px rgba(58,15,25,.08);">
          <tr><td style="background:#6b1f2e;padding:26px 32px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:10px;vertical-align:middle;">${LOGO_SVG}</td>
              <td style="vertical-align:middle;">
                <span style="color:#faf7f3;font-family:Georgia,serif;font-size:19px;font-weight:700;letter-spacing:.2px;">Heritage Speakers</span>
              </td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:36px 36px 8px;">
            <p style="color:#3a0f19;font-size:16px;font-weight:700;margin:0 0 18px;">${t.greeting}</p>
            ${t.intro.map((p) => `<p style="color:#2a2320;font-size:15px;line-height:1.7;margin:0 0 14px;">${p}</p>`).join('\n')}
            <p style="color:#2a2320;font-size:15px;line-height:1.7;margin:22px 0 18px;">${t.ctaIntro}</p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:30px;"><tr><td style="border-radius:999px;background:#b8935a;">
              <a href="${pathsUrl}" style="display:inline-block;color:#3a0f19;text-decoration:none;font-weight:700;padding:13px 28px;border-radius:999px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;">${t.cta}</a>
            </td></tr></table>
            <p style="color:#3a0f19;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:0 0 16px;">${t.pointsTitle}</p>
            ${t.points
              .map(
                (point) => `<table cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>
              <td style="width:6px;background:#b8935a;border-radius:3px;"></td>
              <td style="padding-left:14px;">
                <p style="color:#3a0f19;font-size:14.5px;font-weight:700;margin:0 0 3px;">${point.title}</p>
                <p style="color:#5c5049;font-size:14px;line-height:1.6;margin:0;">${point.body}</p>
              </td>
            </tr></table>`
              )
              .join('\n')}
            <p style="color:#2a2320;font-size:15px;line-height:1.7;margin:22px 0 6px;">${t.closing}</p>
          </td></tr>
          <tr><td style="padding:0 36px 32px;">
            <p style="color:#2a2320;font-size:15px;line-height:1.5;margin:18px 0 2px;">${t.signoffLine1}</p>
            <p style="color:#3a0f19;font-size:15px;font-weight:700;margin:0 0 20px;">${t.signoffLine2}</p>
            <p style="margin:0;padding-top:18px;border-top:1px solid rgba(107,31,46,.14);">
              <a href="${appUrl}" style="color:#b8935a;font-size:12.5px;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">${appUrl.replace(/^https?:\/\//, '')}</a>
            </p>
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
