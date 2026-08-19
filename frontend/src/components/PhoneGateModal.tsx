import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getCopy } from '../i18n/copy';
import { flagEmoji, sortedCountries } from '../data/countries';
import { supabase } from '../lib/supabaseClient';

/** Blocking, non-dismissable modal shown after ANY successful sign-in (password, Google, or
 * Apple) when the account has no WhatsApp number saved yet. Applies uniformly to every auth
 * path — including OAuth, which has no form step to attach a field to before the redirect — and
 * also catches pre-existing accounts created before this requirement existed. The number is
 * stored on Supabase's own user_metadata (via updateUser), so no extra table/RLS is needed and
 * it shows up right in the Authentication -> Users raw metadata in the Supabase dashboard. */
export function PhoneGateModal() {
  const { user } = useAuth();
  const { uiLanguage } = useLanguage();
  const COPY = getCopy(uiLanguage);
  const countries = sortedCountries(uiLanguage);
  const [dialCode, setDialCode] = useState(countries[0].dialCode);
  const [number, setNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const needsPhone = !!user && !user.user_metadata?.whatsapp_number;
  if (!needsPhone) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = number.replace(/\D/g, '');
    if (digits.length < 5) {
      setError(COPY.phoneGateError);
      return;
    }
    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        whatsapp_country_code: dialCode,
        whatsapp_number: digits,
        whatsapp_full: `${dialCode}${digits}`,
      },
    });
    setSubmitting(false);
    if (updateError) setError(updateError.message);
    // On success, AuthContext's onAuthStateChange picks up the USER_UPDATED event and refreshes
    // `user`, so `needsPhone` above flips to false and this modal unmounts itself.
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="phone-gate-title">
        <h3 id="phone-gate-title">{COPY.phoneGateTitle}</h3>
        <p className="modal-copy">{COPY.phoneGateBody}</p>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="phone-gate-country">{COPY.countryLabel}</label>
          <select
            id="phone-gate-country"
            className="field-input"
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.iso2} value={c.dialCode}>
                {flagEmoji(c.iso2)} {uiLanguage === 'es' ? c.nameEs : c.nameEn} ({c.dialCode})
              </option>
            ))}
          </select>

          <label className="field-label" htmlFor="phone-gate-number">{COPY.whatsappLabel}</label>
          <div className="phone-row">
            <span className="phone-row-code">{dialCode}</span>
            <input
              id="phone-gate-number"
              className="field-input"
              type="tel"
              required
              autoComplete="tel-national"
              inputMode="numeric"
              placeholder="612 345 678"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <button className="btn btn-wine" type="submit" disabled={submitting}>
            {submitting ? COPY.pleaseWait : COPY.phoneGateAction}
          </button>
        </form>
      </div>
    </div>
  );
}
