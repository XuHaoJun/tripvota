'use client';

import type { TimelineItem } from '@/lib/mock-data';

interface TimelineItemProps {
  item: TimelineItem;
  onClick: () => void;
}

export function TimelineItem({ item, onClick }: TimelineItemProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98] touch-none"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-card-foreground">{item.title}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.date} · {item.time}
          </p>
        </div>
      </div>
    </div>
  );
}

