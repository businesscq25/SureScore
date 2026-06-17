'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import SuggestionCards from '@/components/SuggestionCards';
import { addRecentSearch } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    addRecentSearch(query);
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div
      className="flex flex-col h-dvh"
      style={{ background: 'var(--bg)' }}
    >
      <Header />

      {/* Main content — vertically centered */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 py-8 overflow-y-auto">
        {/* Logo + tagline */}
        <div className="text-center px-4">
          <div className="logo-text-lg mb-4">
            Clar<span>inq</span>
          </div>
          <p
            className="text-base max-w-xs mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Describe the electronics you want. I&apos;ll ask a few smart questions and find the
            best options — no ads, no sponsored results.
          </p>
          <div
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary-text)',
              border: '1.5px solid color-mix(in srgb, var(--primary) 25%, transparent)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z" />
            </svg>
            Zero sponsored results. Ever.
          </div>
        </div>

        {/* Suggestion cards */}
        <SuggestionCards onSelect={handleSearch} />
      </main>

      {/* Fixed bottom search bar */}
      <div className="shrink-0">
        <SearchBar onSubmit={handleSearch} autoFocus={false} />
      </div>
    </div>
  );
}
