'use client';

import { useState } from 'react';

interface MCQOptionsProps {
  options: string[];
  hasOther?: boolean;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export default function MCQOptions({ options, hasOther = true, onSelect, disabled }: MCQOptionsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState('');

  const handleSelect = (opt: string) => {
    if (disabled) return;
    setSelected(opt);
    setShowOther(false);
    setTimeout(() => onSelect(opt), 150);
  };

  const handleOther = () => {
    if (disabled) return;
    setShowOther(true);
    setSelected(null);
  };

  const handleOtherSubmit = () => {
    const trimmed = otherText.trim();
    if (!trimmed || disabled) return;
    setSelected('other');
    setTimeout(() => onSelect(trimmed), 150);
  };

  return (
    <div className="flex gap-2 flex-wrap animate-fade-in">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleSelect(opt)}
          disabled={disabled || selected !== null}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
          style={
            selected === opt
              ? {
                  background: 'var(--primary)',
                  color: '#fff',
                  borderColor: 'var(--primary)',
                  opacity: 1,
                }
              : {
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)',
                  opacity: selected && selected !== opt ? 0.45 : 1,
                }
          }
          onMouseEnter={(e) => {
            if (!disabled && !selected) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary-text)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !selected) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
        >
          {opt}
        </button>
      ))}

      {hasOther && (
        <button
          onClick={handleOther}
          disabled={disabled || selected !== null}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
            borderStyle: 'dashed',
            opacity: selected ? 0.45 : 1,
          }}
        >
          Other...
        </button>
      )}

      {showOther && (
        <div className="w-full flex gap-2 mt-1 animate-fade-in">
          <input
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOtherSubmit()}
            placeholder="Type your answer..."
            autoFocus
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              borderColor: 'var(--primary)',
            }}
          />
          <button
            onClick={handleOtherSubmit}
            disabled={!otherText.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: 'var(--primary)' }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
