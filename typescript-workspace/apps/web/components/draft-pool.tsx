'use client';

import { useRef, useCallback } from 'react';

import { X, GripVertical } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import type { DraftItem } from '@/lib/mock-data';

import { DraftCard } from './draft-card';

type Mode = 'ideation' | 'collection' | 'arrangement';

interface DraftPoolProps {
  items: DraftItem[];
  onRemove: (id: string) => void;
  onScroll: () => void;
  onStartDrag: () => void;
  onAddToTimeline: (item: DraftItem, time: string, date: string) => void;
  mode: Mode;
}

export function DraftPool({ items, onRemove, onScroll, onStartDrag, onAddToTimeline, mode }: DraftPoolProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      onScroll();
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  }, [onScroll]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, item: DraftItem) => {
      onStartDrag();
      // Store in dataTransfer for standard drag-and-drop
      e.dataTransfer.setData('application/json', JSON.stringify(item));
      e.dataTransfer.effectAllowed = 'move';
      // Also store in window for react-big-calendar's onDropFromOutside
      (window as any).__draftDragData = JSON.stringify(item);
    },
    [onStartDrag],
  );

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Header */}
      <div className="border-border bg-muted/50 border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-sm font-semibold">草案池</h2>
          {mode === 'collection' && items.length > 0 && (
            <span className="text-muted-foreground text-xs">{items.length} 个点子</span>
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
          {items.length === 0 ? (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              <p>暂无草案，从对话中添加想法吧</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <DraftCard item={item} onRemove={onRemove} onAddToTimeline={onAddToTimeline} mode={mode} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
