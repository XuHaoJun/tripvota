'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';

import { RpcClientProvider } from '@workspace/rpc-client/index';

import { ChatPanel } from '@/components/chat-panel';
import { Timeline } from '@/components/timeline';
import { TripCardPool } from '@/components/trip-card-pool';
import type { Message, TripCard } from '@/lib/mock-data';
import { initialMessages, initialTripCards } from '@/lib/mock-data';

type Mode = 'ideation' | 'collection' | 'arrangement';

const MODE_SIZES: Record<Mode, { chat: number; draftPool: number; timeline: number }> = {
  ideation: { chat: 70, draftPool: 20, timeline: 10 },
  collection: { chat: 30, draftPool: 60, timeline: 10 },
  arrangement: { chat: 0, draftPool: 20, timeline: 80 },
};

export default function Home() {
  const [mode, setMode] = useState<Mode>('ideation');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [tripCards, setTripCards] = useState<TripCard[]>(initialTripCards);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const chatPanelRef = useRef<ImperativePanelHandle>(null);
  const draftPoolPanelRef = useRef<ImperativePanelHandle>(null);
  const timelinePanelRef = useRef<ImperativePanelHandle>(null);

  const transitionToMode = useCallback(
    (newMode: Mode) => {
      if (newMode === mode || isTransitioning) return;

      setIsTransitioning(true);
      setMode(newMode);

      const sizes = MODE_SIZES[newMode];

      // Resize panels with smooth transition
      setTimeout(() => {
        if (sizes.chat === 0 && chatPanelRef.current) {
          chatPanelRef.current.collapse();
        } else {
          // Expand if collapsed
          if (chatPanelRef.current?.isCollapsed()) {
            chatPanelRef.current.expand();
          }
          chatPanelRef.current?.resize(sizes.chat);
        }
        draftPoolPanelRef.current?.resize(sizes.draftPool);
        timelinePanelRef.current?.resize(sizes.timeline);
        setIsTransitioning(false);
      }, 10);
    },
    [mode, isTransitioning],
  );

  const handleAddToDraftPool = useCallback(
    (item: TripCard) => {
      setTripCards((prev) => [...prev, item]);
      // Auto-transition to collection mode if we have 2+ draft items
      const draftCount = tripCards.filter((card) => card.status === 'draft').length;
      if (draftCount + 1 >= 2 && mode === 'ideation') {
        transitionToMode('collection');
      }
    },
    [tripCards, mode, transitionToMode],
  );

  const handleRemoveFromDraftPool = useCallback((id: string) => {
    setTripCards((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddToTimeline = useCallback(
    (item: TripCard, startTime: Date) => {
      // Create a new scheduled card from the draft card
      const defaultDuration = 90; // Default 1.5 hours
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + defaultDuration);

      const scheduledCard: TripCard = {
        ...item,
        id: `trip-card-${Date.now()}`,
        startTime,
        endTime,
        status: 'scheduled',
        updatedAt: new Date(),
      };
      setTripCards((prev) => [...prev, scheduledCard]);
      // Transition to arrangement mode when first scheduled item is added
      const scheduledCount = tripCards.filter((card) => card.status === 'scheduled').length;
      if (scheduledCount === 0 && mode !== 'arrangement') {
        transitionToMode('arrangement');
      }
    },
    [tripCards, mode, transitionToMode],
  );

  const handleFocusInput = useCallback(() => {
    if (mode !== 'ideation') {
      transitionToMode('ideation');
    }
  }, [mode, transitionToMode]);

  const handleDraftPoolScroll = useCallback(() => {
    if (mode === 'ideation') {
      transitionToMode('collection');
    }
  }, [mode, transitionToMode]);

  const handleStartDrag = useCallback(() => {
    if (mode !== 'arrangement') {
      transitionToMode('arrangement');
    }
  }, [mode, transitionToMode]);

  const handleShowConversation = useCallback(() => {
    if (mode === 'arrangement') {
      transitionToMode('collection');
    }
  }, [mode, transitionToMode]);

  // Initialize panel sizes on mount
  useEffect(() => {
    const sizes = MODE_SIZES[mode];
    setTimeout(() => {
      if (sizes.chat === 0 && chatPanelRef.current) {
        chatPanelRef.current.collapse();
      } else {
        chatPanelRef.current?.resize(sizes.chat);
      }
      draftPoolPanelRef.current?.resize(sizes.draftPool);
      timelinePanelRef.current?.resize(sizes.timeline);
    }, 100);
  }, [mode]);

  const sizes = MODE_SIZES[mode];

  return (
    <RpcClientProvider
      connectTransportOptions={{
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:3030',
      }}
    >
      <div className="bg-background h-screen w-screen touch-none overflow-hidden">
        <PanelGroup direction="vertical" className="h-full w-full">
          {/* Chat Panel */}
          <Panel
            ref={chatPanelRef}
            defaultSize={sizes.chat}
            minSize={mode === 'arrangement' ? 0 : mode === 'ideation' ? 30 : 0}
            maxSize={mode === 'arrangement' ? 0 : mode === 'ideation' ? 100 : 50}
            collapsible={mode === 'arrangement'}
            className={`transition-all duration-300 ease-in-out ${mode === 'arrangement' ? 'hidden' : ''}`}
          >
            <ChatPanel
              messages={messages}
              onAddMessage={(content) => {
                const newMessage: Message = {
                  id: `msg-${Date.now()}`,
                  chatId: 'chat-1',
                  senderRole: 'user',
                  content,
                  createdAt: new Date(),
                };
                setMessages((prev) => [...prev, newMessage]);
              }}
              onAddToDraftPool={handleAddToDraftPool}
              onFocusInput={handleFocusInput}
            />
          </Panel>
          {mode !== 'arrangement' && (
            <PanelResizeHandle className="bg-border hover:bg-primary/20 h-1 touch-none transition-colors" />
          )}

          {/* Draft Pool Panel */}
          <Panel
            ref={draftPoolPanelRef}
            defaultSize={sizes.draftPool}
            minSize={10}
            maxSize={mode === 'collection' ? 80 : 40}
            className="transition-all duration-300 ease-in-out"
          >
            <TripCardPool
              items={tripCards}
              onRemove={handleRemoveFromDraftPool}
              onScroll={handleDraftPoolScroll}
              onStartDrag={handleStartDrag}
              onAddToTimeline={handleAddToTimeline}
              mode={mode}
            />
          </Panel>

          {/* Timeline Panel */}
          <PanelResizeHandle className="bg-border hover:bg-primary/20 h-1 touch-none transition-colors" />
          <Panel
            ref={timelinePanelRef}
            defaultSize={sizes.timeline}
            minSize={mode === 'arrangement' ? 50 : 5}
            maxSize={mode === 'arrangement' ? 100 : 20}
            className="transition-all duration-300 ease-in-out"
          >
            <Timeline
              items={tripCards}
              draftItems={tripCards}
              mode={mode}
              onShowConversation={handleShowConversation}
              onUpdateTimeline={setTripCards}
              onStartArrangement={() => transitionToMode('arrangement')}
              onJustAdded={(item) => {
                // Optional: Add any post-add logic here (e.g., analytics, animations)
                console.log('Item added to timeline:', item);
              }}
            />
          </Panel>
        </PanelGroup>
      </div>
    </RpcClientProvider>
  );
}
