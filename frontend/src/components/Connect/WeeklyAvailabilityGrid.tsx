import { Fragment } from 'react';
import { ConnectAvailability, ConnectDayKey } from '../../api/client';
import { DAY_KEYS } from '../../utils/connectSchedule';

const DAY_SHORT: Record<ConnectDayKey, { es: string; en: string }> = {
  mon: { es: 'Lu', en: 'Mo' },
  tue: { es: 'Ma', en: 'Tu' },
  wed: { es: 'Mi', en: 'We' },
  thu: { es: 'Ju', en: 'Th' },
  fri: { es: 'Vi', en: 'Fr' },
  sat: { es: 'Sá', en: 'Sa' },
  sun: { es: 'Do', en: 'Su' },
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_COL_WIDTH = '2.2rem';

/** A real weekly-calendar grid (hours x days) for picking recurring availability, instead of
 * seven separate scrolling rows of chips — click a cell to toggle that 1-hour slot. */
export function WeeklyAvailabilityGrid({
  availability,
  onToggle,
  uiLanguage,
}: {
  availability: ConnectAvailability;
  onToggle: (day: ConnectDayKey, hour: number) => void;
  uiLanguage: 'en' | 'es';
}) {
  return (
    <div
      style={{
        border: '1.5px solid var(--line)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--card)',
      }}
    >
      <div style={{ maxHeight: '22rem', overflowY: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `${HOUR_COL_WIDTH} repeat(7, 1fr)`,
          }}
        >
          {/* Header row: day labels, sticky to the top while scrolling hours */}
          <div style={{ position: 'sticky', top: 0, background: 'var(--bone-dim)', zIndex: 1 }} />
          {DAY_KEYS.map((day) => (
            <div
              key={day}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: 'var(--bone-dim)',
                color: 'var(--wine-ink)',
                fontWeight: 700,
                fontSize: '.78rem',
                textAlign: 'center',
                padding: '.5rem 0',
                borderBottom: '1.5px solid var(--line)',
              }}
            >
              {DAY_SHORT[day][uiLanguage]}
            </div>
          ))}

          {/* Hour rows */}
          {HOURS.map((hour) => (
            <Fragment key={hour}>
              <div
                style={{
                  fontSize: '.68rem',
                  color: 'var(--muted)',
                  textAlign: 'right',
                  paddingRight: '.3rem',
                  lineHeight: '1.6rem',
                  borderRight: '1px solid var(--line)',
                }}
              >
                {String(hour).padStart(2, '0')}
              </div>
              {DAY_KEYS.map((day) => {
                const active = availability[day].includes(hour);
                return (
                  <button
                    key={`${day}-${hour}`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToggle(day, hour)}
                    style={{
                      height: '1.6rem',
                      border: '1px solid var(--line)',
                      borderLeft: 'none',
                      borderTop: 'none',
                      background: active ? 'var(--wine)' : 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'background .1s ease',
                    }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
