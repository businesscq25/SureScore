'use client';

import { useState } from 'react';

export default function FeedbackButtons() {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  return (
    <div className="flex items-center gap-3 pl-9 animate-fade-in">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Was this helpful?
      </span>
      <button
        onClick={() => setVoted('up')}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
        style={
          voted === 'up'
            ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }
            : { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
        }
        aria-label="Helpful"
      >
        👍 Yes
      </button>
      <button
        onClick={() => setVoted('down')}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
        style={
          voted === 'down'
            ? { background: '#dc2626', color: '#fff', borderColor: '#dc2626' }
            : { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
        }
        aria-label="Not helpful"
      >
        👎 No
      </button>
      {voted && (
        <span className="text-xs animate-fade-in" style={{ color: 'var(--text-muted)' }}>
          {voted === 'up' ? 'Thanks! 🙌' : 'Got it, we\'ll improve.'}
        </span>
      )}
    </div>
  );
}
