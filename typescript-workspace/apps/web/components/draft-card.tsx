'use client';

import { useState } from 'react';

import { X, GripVertical, Calendar } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import type { DraftItem } from '@/lib/mock-data';

type Mode = 'ideation' | 'collection' | 'arrangement';

interface DraftCardProps {
  item: DraftItem;
  onRemove: (id: string) => void;
  onAddToTimeline: (item: DraftItem, time: string, date: string) => void;
  mode: Mode;
}

export function DraftCard({ item, onRemove, onAddToTimeline, mode }: DraftCardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedDate, setSelectedDate] = useState('Day 1');

  const handleAddToTimeline = () => {
    onAddToTimeline(item, selectedTime, selectedDate);
    setShowAddModal(false);
  };

  return (
    <>
      <div
        draggable={mode === 'arrangement'}
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify(item));
          e.dataTransfer.effectAllowed = 'move';
          // Store in window for react-big-calendar's onDropFromOutside
          (window as any).__draftDragData = JSON.stringify(item);
          // Create custom drag image for better visual feedback
          const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
          dragImage.style.opacity = '0.9';
          dragImage.style.transform = 'rotate(2deg)';
          dragImage.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
          document.body.appendChild(dragImage);
          dragImage.style.position = 'absolute';
          dragImage.style.top = '-1000px';
          e.dataTransfer.setDragImage(dragImage, e.currentTarget.offsetWidth / 2, e.currentTarget.offsetHeight / 2);
          setTimeout(() => document.body.removeChild(dragImage), 0);
          // Add visual feedback to original
          e.currentTarget.style.opacity = '0.5';
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onDragEnd={(e) => {
          // Restore opacity and transform
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1)';
          // Clean up drag data if not dropped successfully
          setTimeout(() => {
            if ((window as any).__draftDragData) {
              delete (window as any).__draftDragData;
            }
          }, 100);
        }}
        className={`group border-border bg-card relative flex w-64 touch-none flex-col rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${
          mode === 'arrangement' ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        {/* Drag Handle */}
        {mode === 'arrangement' && (
          <div className="text-muted-foreground absolute top-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onRemove(item.id)}
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Content */}
        <div className="mt-2 flex-1">
          <h3 className="text-card-foreground mb-2 text-sm font-semibold">{item.title}</h3>
          <p className="text-muted-foreground line-clamp-3 text-xs">{item.description}</p>
        </div>

        {/* Actions */}
        {mode === 'collection' && (
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setShowAddModal(true)}>
            <Calendar className="mr-2 h-3 w-3" />
            添加到时间轴
          </Button>
        )}
      </div>

      {/* Add to Timeline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="border-border bg-card w-80 rounded-lg border p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">添加到时间轴</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">日期</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="Day 1">第1天</option>
                  <option value="Day 2">第2天</option>
                  <option value="Day 3">第3天</option>
                  <option value="Day 4">第4天</option>
                  <option value="Day 5">第5天</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">时间</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  取消
                </Button>
                <Button className="flex-1" onClick={handleAddToTimeline}>
                  确认
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
