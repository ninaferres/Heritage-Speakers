import { useEffect, useState } from 'react';

/** Cycles through a list of encouraging messages while something is loading, instead of a static line. */
export function AnalyzingMessages({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <span key={index} style={{ display: 'inline-block', animation: 'analyzingFadeIn .4s ease' }}>
      {messages[index]}
      <style>{`
        @keyframes analyzingFadeIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
