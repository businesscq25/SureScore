import type { RecentSearch, QuestionMode } from './types';

const RECENT_KEY = 'clarinq_recent';
const MODE_KEY = 'clarinq_mode';
const DARK_KEY = 'clarinq_dark';
const MAX_RECENT = 10;

const CATEGORY_ICONS: Record<string, string> = {
  laptop: '💻',
  notebook: '💻',
  macbook: '💻',
  phone: '📱',
  smartphone: '📱',
  mobile: '📱',
  iphone: '📱',
  android: '📱',
  earbud: '🎧',
  earphone: '🎧',
  headphone: '🎧',
  headset: '🎧',
  speaker: '🔊',
  camera: '📷',
  dslr: '📷',
  mirrorless: '📷',
  gopro: '📷',
  tv: '📺',
  television: '📺',
  monitor: '🖥️',
  tablet: '📟',
  ipad: '📟',
  watch: '⌚',
  smartwatch: '⌚',
  printer: '🖨️',
  router: '📡',
  keyboard: '⌨️',
  mouse: '🖱️',
};

export function getIconForQuery(query: string): string {
  const lower = query.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '🔌';
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined') return;
  const existing = getRecentSearches();
  const icon = getIconForQuery(query);
  const newItem: RecentSearch = {
    id: Date.now().toString(),
    query,
    icon,
    timestamp: Date.now(),
  };
  const filtered = existing.filter(
    (s) => s.query.toLowerCase() !== query.toLowerCase()
  );
  const updated = [newItem, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function getQuestionMode(): QuestionMode {
  if (typeof window === 'undefined') return 'mid';
  return (localStorage.getItem(MODE_KEY) as QuestionMode) || 'mid';
}

export function setQuestionMode(mode: QuestionMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODE_KEY, mode);
}

export function getDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DARK_KEY) === 'true';
}

export function setDarkMode(dark: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DARK_KEY, String(dark));
}
