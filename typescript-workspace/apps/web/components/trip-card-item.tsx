'use client';

import { format } from 'date-fns';

import type { TripCard } from '@/lib/mock-data';

interface TripCardItemProps {
  item: TripCard;
  onClick: () => void;
}

export function TripCardItem({ item, onClick }: TripCardItemProps) {
  const timeDisplay = item.startTime ? format(item.startTime, 'MMM d · HH:mm') : '未安排';

  return (
    <div
      onClick={onClick}
      className="border-border bg-card cursor-pointer touch-none rounded-lg border p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-card-foreground text-sm font-semibold">{item.title}</h4>
          <p className="text-muted-foreground mt-1 text-xs">{timeDisplay}</p>
        </div>
      </div>
    </div>
  );
}
