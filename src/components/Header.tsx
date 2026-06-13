'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

interface HeaderProps {
  showNoBadge?: boolean;
  showShare?: boolean;
}

export default function Header({ showNoBadge = true, showShare = true }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Clarinq', url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header
        className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14"
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Open menu"
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border-light)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="12" x2="17" y2="12" />
            <line x1="3" y1="18" x2="17" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <span className="logo-text flex-1">
          Clar<span>inq</span>
        </span>

        {/* No ads badge */}
        {showNoBadge && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary-text)',
              border: '1px solid var(--primary)',
              borderColor: 'color-mix(in srgb, var(--primary) 30%, transparent)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z" />
            </svg>
            No ads
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Share */}
          {showShare && (
            <button
              onClick={handleShare}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Share"
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          )}

          {/* Settings */}
          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Settings"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
