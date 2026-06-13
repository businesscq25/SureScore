'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import type { RecentSearch, QuestionMode } from '@/lib/types';
import { getRecentSearches } from '@/lib/storage';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const MODES: { key: QuestionMode; label: string; emoji?: string }[] = [
  { key: 'low', label: 'Low' },
  { key: 'mid', label: 'Mid' },
  { key: 'max', label: 'Max' },
  { key: 'auto', label: 'Auto', emoji: '✨' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const { dark, toggleDark, mode, setMode } = useTheme();
  const [recents, setRecents] = useState<RecentSearch[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setRecents(getRecentSearches());
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleNewSearch = () => {
    router.push('/');
    onClose();
  };

  const handleRecentClick = (query: string) => {
    router.push(`/chat?q=${encodeURIComponent(query)}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-transform duration-250 ease-out
          w-[min(320px,85vw)]`}
        style={{
          background: 'var(--surface)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: open ? 'var(--shadow-md)' : 'none',
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="logo-text">
            Clar<span>inq</span>
          </span>
        </div>

        {/* New Search */}
        <div className="px-4 pt-4 pb-3">
          <button
            onClick={handleNewSearch}
            className="w-full flex items-center gap-2 justify-center py-3 px-4 rounded-full font-semibold text-white text-sm transition-colors"
            style={{ background: 'var(--primary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
          >
            <span className="text-lg leading-none">+</span>
            New search
          </button>
        </div>

        {/* Recent Searches */}
        <div className="flex-1 overflow-y-auto">
          {recents.length > 0 && (
            <div className="px-4">
              <p
                className="text-xs font-semibold tracking-widest mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                RECENT
              </p>
              <ul className="space-y-0.5">
                {recents.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => handleRecentClick(r.query)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--primary-light)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span className="text-base shrink-0">{r.icon}</span>
                      <span
                        className="truncate"
                        style={{ color: 'var(--primary-text)', fontWeight: 500 }}
                      >
                        {r.query}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom settings */}
        <div
          className="px-4 py-4 space-y-4"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--border-light)' }}
        >
          {/* Question Mode */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              QUESTION MODE
            </p>
            <div className="flex gap-2 flex-wrap">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={
                    mode === m.key
                      ? {
                          background: 'var(--primary)',
                          color: '#fff',
                          boxShadow: '0 1px 4px rgba(26,107,88,0.4)',
                        }
                      : {
                          background: 'var(--surface)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }
                  }
                >
                  {m.emoji && <span className="mr-1">{m.emoji}</span>}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode */}
          <button
            onClick={toggleDark}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>{dark ? '☀️' : '🌙'}</span>
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>
    </>
  );
}
