'use client';

import type { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^(\d+)\.\s(.+)$/gm, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(?!<)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[huhb])/g, '$1')
    .replace(/(<\/[huhb][^>]*>)<\/p>/g, '$1');
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2 items-end animate-fade-in">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ background: 'var(--primary)' }}
      >
        C
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div
          className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed text-white"
          style={{ background: 'var(--primary)' }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  const html = renderMarkdown(message.content);

  return (
    <div className="flex gap-2 items-end animate-fade-in">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mb-0.5"
        style={{ background: 'var(--primary)' }}
      >
        C
      </div>
      <div
        className="max-w-[88%] px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        {message.type === 'question' && message.questionNumber && (
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--primary-light)', color: 'var(--primary-text)' }}
            >
              Question {message.questionNumber}
              {message.totalQuestions ? ` of ${message.totalQuestions}` : ''}
            </span>
          </div>
        )}
        <div
          className="prose-clarinq"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
