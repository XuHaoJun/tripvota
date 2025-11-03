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
      className="border-border bg-card cursor-pointer touch-none rounded-lg border p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-card-foreground text-sm font-semibold">{item.title}</h4>
          <p className="text-muted-foreground mt-1 text-xs">
            {item.date} · {item.time}
          </p>
        </div>
      </div>
    </div>
  );
}
