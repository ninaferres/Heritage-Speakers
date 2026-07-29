export function HostSection() {
  return (
    <section className="block host">
      <div className="wrap">
        <div className="host-card">
          <div className="host-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
          </div>
          <div>
            <h3>Meet Nina</h3>
            <p>
              I grew up in a family where we spoke Spanish, Catalan, and Russian. I use Spanish and Catalan every day
              here in Catalonia, but Russian is the language I only speak with my family. It's that language, the one
              that connects me to my roots, that inspired me to build Heritage Speakers. I know what it feels like to
              understand a language but struggle to speak it fluently. I know the fear of losing it. That's why I
              created this: so your heritage language stays alive, not something you lose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
