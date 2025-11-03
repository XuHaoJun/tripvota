'use client';

import { useState, useRef, useEffect } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import type { ConversationMessage, DraftItem } from '@/lib/mock-data';

interface ConversationPanelProps {
  messages: ConversationMessage[];
  onAddMessage: (content: string) => void;
  onAddToDraftPool: (item: DraftItem) => void;
  onFocusInput: () => void;
}

export function ConversationPanel({ messages, onAddMessage, onAddToDraftPool, onFocusInput }: ConversationPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddIdea = (content: string) => {
    const draftItem: DraftItem = {
      id: `draft-${Date.now()}`,
      title: content.length > 30 ? content.substring(0, 30) + '...' : content,
      description: content,
    };
    onAddToDraftPool(draftItem);
  };

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Messages Area */}
      <div className="scrollbar-hide -webkit-overflow-scrolling-touch flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.role === 'ai' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-2 text-xs"
                  onClick={() => handleAddIdea(message.content)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  添加
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-border bg-background border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={onFocusInput}
            placeholder="输入你的想法..."
            className="border-input bg-background focus:ring-ring flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          />
          <Button type="submit" size="default">
            发送
          </Button>
        </form>
      </div>
    </div>
  );
}
