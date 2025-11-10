'use client';

import { useRef, useCallback } from 'react';

import type { TripCard } from '@/lib/mock-data';

import { TripCardDisplay } from './trip-card';

type Mode = 'ideation' | 'collection' | 'arrangement';

interface TripCardPoolProps {
  items: TripCard[];
  onRemove: (id: string) => void;
  onScroll: () => void;
  onStartDrag: () => void;
  onAddToTimeline: (item: TripCard, startTime: Date) => void;
  mode: Mode;
}

export function TripCardPool({ items, onRemove, onScroll, onStartDrag, onAddToTimeline, mode }: TripCardPoolProps) {
  // onStartDrag is passed but not used in this component - it's handled by TripCardDisplay
  void onStartDrag;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Filter items to only show draft status cards
  const draftItems = items.filter((item) => item.status === 'draft');

  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      onScroll();
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  }, [onScroll]);

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Header */}
      <div className="border-border bg-muted/50 border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-sm font-semibold">草案池</h2>
          {mode === 'collection' && draftItems.length > 0 && (
            <span className="text-muted-foreground text-xs">{draftItems.length} 个点子</span>
          )}
        </div>
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="scrollbar-hide -webkit-overflow-scrolling-touch flex-1 overflow-x-auto overflow-y-hidden px-4 py-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {draftItems.length === 0 ? (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              <p>暂无草案，从对话中添加想法吧</p>
            </div>
          ) : (
            draftItems.map((item) => (
              <div key={item.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <TripCardDisplay item={item} onRemove={onRemove} onAddToTimeline={onAddToTimeline} mode={mode} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
