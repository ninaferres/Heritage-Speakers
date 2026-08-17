import { FormEvent, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { submitFeedback } from '../api/client';
import { MessageIcon } from './icons/SkillIcons';

type Category = 'bug' | 'idea' | 'other';

const LABELS = {
  es: {
    fab: 'Enviar sugerencia',
    title: 'Buzón de sugerencias',
    intro: 'Cuéntanos qué falla o qué te gustaría ver.',
    category: 'Tipo',
    bug: 'Algo no funciona',
    idea: 'Una idea o mejora',
    other: 'Otro',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Tu nombre',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Tu apellido',
    message: 'Tu mensaje',
    messagePlaceholder: 'Escribe aquí...',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    phone: 'Teléfono',
    phonePlaceholder: '+34 600 000 000',
    submit: 'Enviar',
    sending: 'Enviando…',
    success: 'Gracias, lo hemos recibido.',
    close: 'Cerrar',
    error: 'No se pudo enviar. Inténtalo de nuevo.',
  },
  en: {
    fab: 'Send feedback',
    title: 'Feedback mailbox',
    intro: "Tell us what's broken or what you'd like to see.",
    category: 'Type',
    bug: "Something's broken",
    idea: 'An idea or improvement',
    other: 'Other',
    firstName: 'First name',
    firstNamePlaceholder: 'Your first name',
    lastName: 'Last name',
    lastNamePlaceholder: 'Your last name',
    message: 'Your message',
    messagePlaceholder: 'Write here...',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    phone: 'Phone',
    phonePlaceholder: '+1 555 000 0000',
    submit: 'Send',
    sending: 'Sending…',
    success: "Thanks, we've received it.",
    close: 'Close',
    error: "Couldn't send it. Please try again.",
  },
};

export function FeedbackWidget() {
  const { uiLanguage, learningLanguage } = useLanguage();
  const t = LABELS[uiLanguage];
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>('idea');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function reset() {
    setCategory('idea');
    setFirstName('');
    setLastName('');
    setMessage('');
    setEmail('');
    setPhone('');
    setError(null);
    setSent(false);
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  const canSubmit = firstName.trim() && lastName.trim() && message.trim() && email.trim() && phone.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback({
        category,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        message: message.trim(),
        contactEmail: email.trim(),
        contactPhone: phone.trim(),
        uiLanguage,
        learningLanguage,
        page: window.location.pathname,
      });
      setSent(true);
    } catch {
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button className="feedback-fab" onClick={() => setOpen(true)} aria-label={t.fab}>
        <MessageIcon />
      </button>

      {open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title">
            <button className="modal-close" aria-label={t.close} onClick={handleClose}>✕</button>

            {sent ? (
              <>
                <h3 id="feedback-modal-title">{t.success}</h3>
                <button className="btn btn-wine" style={{ width: '100%', marginTop: '1.4rem' }} onClick={handleClose}>
                  {t.close}
                </button>
              </>
            ) : (
              <>
                <h3 id="feedback-modal-title">{t.title}</h3>
                <p className="modal-copy">{t.intro}</p>

                <form onSubmit={handleSubmit}>
                  <label className="field-label" htmlFor="feedback-category">{t.category}</label>
                  <select
                    id="feedback-category"
                    className="field-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    <option value="bug">{t.bug}</option>
                    <option value="idea">{t.idea}</option>
                    <option value="other">{t.other}</option>
                  </select>

                  <div style={{ display: 'flex', gap: '.8rem' }}>
                    <div style={{ flex: 1 }}>
                      <label className="field-label" htmlFor="feedback-first-name">{t.firstName}</label>
                      <input
                        id="feedback-first-name"
                        type="text"
                        className="field-input"
                        placeholder={t.firstNamePlaceholder}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="field-label" htmlFor="feedback-last-name">{t.lastName}</label>
                      <input
                        id="feedback-last-name"
                        type="text"
                        className="field-input"
                        placeholder={t.lastNamePlaceholder}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <label className="field-label" htmlFor="feedback-message">{t.message}</label>
                  <textarea
                    id="feedback-message"
                    className="field-input feedback-textarea"
                    placeholder={t.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={4000}
                  />

                  <label className="field-label" htmlFor="feedback-email">{t.email}</label>
                  <input
                    id="feedback-email"
                    type="email"
                    className="field-input"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <label className="field-label" htmlFor="feedback-phone">{t.phone}</label>
                  <input
                    id="feedback-phone"
                    type="tel"
                    className="field-input"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  {error && <div className="modal-error">{error}</div>}

                  <button className="btn btn-wine" type="submit" disabled={submitting || !canSubmit}>
                    {submitting ? t.sending : t.submit}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
