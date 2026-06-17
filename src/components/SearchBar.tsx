'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  initialValue?: string;
}

export default function SearchBar({
  onSubmit,
  placeholder = 'Describe what you want to buy...',
  disabled = false,
  autoFocus = false,
  initialValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  return (
    <div
      className="px-4 py-3"
      style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}
    >
      <div
        className="flex items-end gap-2 rounded-2xl px-4 py-2.5"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 resize-none text-sm leading-relaxed bg-transparent outline-none py-0.5 min-h-[24px] max-h-[140px]"
          style={{ color: 'var(--text-primary)', caretColor: 'var(--primary)' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: value.trim() && !disabled ? 'var(--primary)' : 'var(--border)',
            color: '#fff',
            cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
          }}
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        Electronics only · India · Results ranked by fit, not commission
      </p>
    </div>
  );
}
