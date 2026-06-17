'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ChatMessage, { TypingIndicator } from '@/components/ChatMessage';
import MCQOptions from '@/components/MCQOptions';
import FeedbackButtons from '@/components/FeedbackButtons';
import type { Message, AIResponse } from '@/lib/types';
import { getQuestionMode, addRecentSearch } from '@/lib/storage';

function ChatPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionsDone, setQuestionsDone] = useState(false);
  const initialized = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const sendToAI = async (userMsg: string, currentMessages: Message[]) => {
    setIsTyping(true);
    scrollToBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          mode: getQuestionMode(),
          userMessage: userMsg,
        }),
      });

      const data: AIResponse = await res.json();

      const aiMsg: Message = {
        role: 'assistant',
        content: data.message,
        type: data.type,
        options: data.options,
        hasOther: data.hasOther,
        questionNumber: data.questionNumber,
        totalQuestions: data.totalQuestions,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.type === 'recommendation' || data.type === 'follow_up') {
        setShowFeedback(true);
        setQuestionsDone(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          type: 'error',
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // Initialize chat with the initial query
  useEffect(() => {
    if (!query || initialized.current) return;
    initialized.current = true;

    if (!query.trim()) {
      router.push('/');
      return;
    }

    addRecentSearch(query);

    const firstMsg: Message = { role: 'user', content: query };
    setMessages([firstMsg]);
    sendToAI(query, [firstMsg]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleUserReply = (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setShowFeedback(false);
    sendToAI(text, updated);
    scrollToBottom();
  };

  // Last AI message for MCQ display
  const lastAIMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const showMCQ =
    !isTyping &&
    lastAIMsg?.type === 'question' &&
    lastAIMsg.options &&
    lastAIMsg.options.length > 0;

  return (
    <div className="flex flex-col h-dvh" style={{ background: 'var(--bg)' }}>
      <Header />

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* MCQ options appear below the last AI question */}
          {showMCQ && lastAIMsg && (
            <div className="pl-9">
              <MCQOptions
                options={lastAIMsg.options!}
                hasOther={lastAIMsg.hasOther ?? true}
                onSelect={handleUserReply}
                disabled={isTyping}
              />
            </div>
          )}

          {/* Feedback after recommendation */}
          {showFeedback && !isTyping && <FeedbackButtons />}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Search bar — for follow-up questions */}
      <div className="shrink-0">
        <SearchBar
          onSubmit={handleUserReply}
          placeholder={
            questionsDone
              ? 'Ask a follow-up question...'
              : 'Or type a custom answer...'
          }
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex h-dvh items-center justify-center"
          style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}
        >
          <div className="flex gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
