'use client';

const SUGGESTIONS = [
  { icon: '💻', text: 'Laptop for video editing under ₹60,000' },
  { icon: '🎧', text: 'Wireless earbuds with good bass under ₹2,000' },
  { icon: '📱', text: 'Best smartphone under ₹15,000 for camera' },
  { icon: '📷', text: 'DSLR camera for beginners' },
];

interface SuggestionCardsProps {
  onSelect: (text: string) => void;
}

export default function SuggestionCards({ onSelect }: SuggestionCardsProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-4 space-y-2.5">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.text}
          onClick={() => onSelect(s.text)}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left text-sm transition-all"
          style={{
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,107,88,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
        >
          <span className="text-xl shrink-0">{s.icon}</span>
          <span className="font-medium">{s.text}</span>
        </button>
      ))}
    </div>
  );
}
