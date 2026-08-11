import { useEffect, useRef, useState } from 'react';

export function useCountdown(startSeconds: number, running: boolean = true) {
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const label = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const color = secondsLeft <= 30 ? '#b3261e' : secondsLeft <= 90 ? '#b8860b' : 'var(--wine)';

  return { secondsLeft, label, color, expired: secondsLeft === 0 };
}
