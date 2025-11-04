'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';

import { ConversationPanel } from '@/components/conversation-panel';
import { DraftPool } from '@/components/draft-pool';
import { Timeline } from '@/components/timeline';
import type { ConversationMessage, DraftItem, TimelineItem } from '@/lib/mock-data';
import { initialMessages, initialDraftItems, initialTimelineItems } from '@/lib/mock-data';

type Mode = 'ideation' | 'collection' | 'arrangement';

const MODE_SIZES: Record<Mode, { conversation: number; draftPool: number; timeline: number }> = {
  ideation: { conversation: 70, draftPool: 20, timeline: 10 },
  collection: { conversation: 30, draftPool: 60, timeline: 10 },
  arrangement: { conversation: 0, draftPool: 20, timeline: 80 },
};

export default function Home() {
  const [mode, setMode] = useState<Mode>('ideation');
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [draftItems, setDraftItems] = useState<DraftItem[]>(initialDraftItems);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(initialTimelineItems);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const conversationPanelRef = useRef<ImperativePanelHandle>(null);
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
        if (sizes.conversation === 0 && conversationPanelRef.current) {
          conversationPanelRef.current.collapse();
        } else {
          // Expand if collapsed
          if (conversationPanelRef.current?.isCollapsed()) {
            conversationPanelRef.current.expand();
          }
          conversationPanelRef.current?.resize(sizes.conversation);
        }
        draftPoolPanelRef.current?.resize(sizes.draftPool);
        timelinePanelRef.current?.resize(sizes.timeline);
        setIsTransitioning(false);
      }, 10);
    },
    [mode, isTransitioning],
  );

  const handleAddToDraftPool = useCallback(
    (item: DraftItem) => {
      setDraftItems((prev) => [...prev, item]);
      // Auto-transition to collection mode if we have 2+ items
      if (draftItems.length + 1 >= 2 && mode === 'ideation') {
        transitionToMode('collection');
      }
    },
    [draftItems.length, mode, transitionToMode],
  );

  const handleRemoveFromDraftPool = useCallback((id: string) => {
    setDraftItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddToTimeline = useCallback(
    (item: DraftItem, time: string, date: string) => {
      const timelineItem: TimelineItem = {
        id: `timeline-${Date.now()}`,
        draftId: item.id,
        time,
        date,
        title: item.title,
      };
      setTimelineItems((prev) => [...prev, timelineItem]);
      // Transition to arrangement mode when first item is added
      if (timelineItems.length === 0 && mode !== 'arrangement') {
        transitionToMode('arrangement');
      }
    },
    [timelineItems.length, mode, transitionToMode],
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
      if (sizes.conversation === 0 && conversationPanelRef.current) {
        conversationPanelRef.current.collapse();
      } else {
        conversationPanelRef.current?.resize(sizes.conversation);
      }
      draftPoolPanelRef.current?.resize(sizes.draftPool);
      timelinePanelRef.current?.resize(sizes.timeline);
    }, 100);
  }, []);

  const sizes = MODE_SIZES[mode];

  return (
    <div className="bg-background h-screen w-screen touch-none overflow-hidden">
      <PanelGroup direction="vertical" className="h-full w-full">
        {/* Conversation Panel */}
        <Panel
          ref={conversationPanelRef}
          defaultSize={sizes.conversation}
          minSize={mode === 'arrangement' ? 0 : mode === 'ideation' ? 30 : 0}
          maxSize={mode === 'arrangement' ? 0 : mode === 'ideation' ? 100 : 50}
          collapsible={mode === 'arrangement'}
          className={`transition-all duration-300 ease-in-out ${mode === 'arrangement' ? 'hidden' : ''}`}
        >
          <ConversationPanel
            messages={messages}
            onAddMessage={(content) => {
              const newMessage: ConversationMessage = {
                id: `msg-${Date.now()}`,
                role: 'user',
                content,
                timestamp: new Date(),
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
          <DraftPool
            items={draftItems}
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
            items={timelineItems}
            draftItems={draftItems}
            mode={mode}
            onShowConversation={handleShowConversation}
            onUpdateTimeline={setTimelineItems}
            onStartArrangement={() => transitionToMode('arrangement')}
            onJustAdded={(item) => {
              // Optional: Add any post-add logic here (e.g., analytics, animations)
              console.log('Item added to timeline:', item);
            }}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
