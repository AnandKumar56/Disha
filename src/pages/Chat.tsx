import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, Bot } from 'lucide-react';
import { trackEvent, trackPageView } from '../utils/analytics';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export const Chat: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    document.title = 'Chat with Disha | India Elections Guide';
    trackPageView('chat');
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    t('startingQuestion1'),
    t('startingQuestion2'),
    t('startingQuestion3'),
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    trackEvent('chat_message_sent');

    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages([...newMessages, { role: 'bot', content: data.reply }]);
    } catch (err: any) {
      setError(t('chatError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          {t('chatTitle')}
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          {t('chatSubtitle')}
        </p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-[8px] flex flex-col overflow-hidden shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 bg-[var(--color-bg)]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col border border-dashed border-gray-300 rounded-[8px] justify-center items-center p-6 bg-white">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <p className="text-gray-500 mb-6 font-medium text-center">{t('chatSubtitle')}</p>
              <div className="flex flex-col gap-3 w-full max-w-md">
                {starterQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      trackEvent('starter_question_used');
                      handleSend(q);
                    }}
                    className="p-3 text-sm text-left border border-gray-200 rounded-[8px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <span className="text-white font-bold text-sm">D</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] md:max-w-[70%] p-3 px-4 rounded-[12px] leading-relaxed text-sm md:text-base ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                     <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 px-4 rounded-[12px] rounded-tl-sm text-gray-500 text-sm shadow-sm flex items-center gap-1">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center text-red-500 text-sm mt-4">{error}</div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex gap-2"
          >
            <label htmlFor="chat-input" className="sr-only">{t('chatInputPlaceholder')}</label>
            <input
              id="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatInputPlaceholder')}
              disabled={isLoading}
              maxLength={1000}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-[8px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              aria-label={t('send')}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 md:px-6 py-3 bg-[var(--color-primary)] text-white rounded-[8px] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E66000] transition-colors flex items-center justify-center gap-2"
            >
              <span className="hidden md:inline">{t('send')}</span>
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
          <span className="text-xs text-gray-400 text-right block mt-1">
            {debouncedInput.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};
