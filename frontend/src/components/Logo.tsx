/**
 * The two Heritage Speakers brand marks, as inline SVG symbols so they stay
 * crisp at any size and can be recolored per-context via CSS.
 *  - "bone": bone-colored arch (for placement on the wine hero/footer background)
 *  - "wine": wine-colored arch inside a bone chip (for placement on light backgrounds)
 */

export function LogoMark({ variant = 'bone', width = 50, height = 35 }: { variant?: 'bone' | 'wine'; width?: number; height?: number }) {
  const outer = variant === 'bone' ? '#faf7f3' : '#6b1f2e';
  return (
    <svg viewBox="0 0 215 138" width={width} height={height} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M29.64 107.75 C81.64 28.01 133.64 28.01 185.64 107.75" fill="none" stroke={outer} strokeWidth="18.2" strokeLinecap="round" />
      <path d="M58.24 107.75 C91.17 62.68 124.10 62.68 157.04 107.75" fill="none" stroke="#b8935a" strokeWidth="13" strokeLinecap="round" />
      <rect x="24.44" y="118.14" width="166.4" height="10.4" rx="5.2" fill={outer} />
    </svg>
  );
}

/** Boxed version used in the footer: wine rounded square with the bone/gold arch on top. */
export function LogoBadge({ width = 50, height = 35 }: { width?: number; height?: number }) {
  return (
    <svg viewBox="0 0 215 138" width={width} height={height} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="215" height="138" fill="#6b1f2e" rx="8" />
      <path d="M29.64 107.75 C81.64 28.01 133.64 28.01 185.64 107.75" fill="none" stroke="#faf7f3" strokeWidth="18.2" strokeLinecap="round" />
      <path d="M58.24 107.75 C91.17 62.68 124.10 62.68 157.04 107.75" fill="none" stroke="#b8935a" strokeWidth="13" strokeLinecap="round" />
      <rect x="24.44" y="118.14" width="166.4" height="10.4" rx="5.2" fill="#faf7f3" />
    </svg>
  );
}

export function BrandLockup({ variant = 'wine', name = 'Heritage Speakers' }: { variant?: 'bone' | 'wine'; name?: string }) {
  return (
    <span className="brand">
      <LogoBadge width={38} height={26} />
      <span className="brand-name" style={{ color: variant === 'bone' ? 'var(--bone)' : 'var(--wine-ink)' }}>{name}</span>
    </span>
  );
}
