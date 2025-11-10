'use client';

import { useState, useEffect } from 'react';

import { X, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import type { TimelineItem } from '@/lib/mock-data';

interface TimelineEditSheetProps {
  item: TimelineItem | null;
  onClose: () => void;
  onUpdate: (item: TimelineItem) => void;
  onDelete: (id: string) => void;
  hasConflict?: boolean;
}

export function TimelineEditSheet({ item, onClose, onUpdate, onDelete, hasConflict = false }: TimelineEditSheetProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [date, setDate] = useState(item?.date || 'Day 1');
  const [startTime, setStartTime] = useState(item?.time || '10:00');
  const [duration, setDuration] = useState(60); // minutes

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDate(item.date);
      setStartTime(item.time);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    // Note: Duration is not stored in TimelineItem, only time is stored
    // Duration is only used for display/editing purposes
    onUpdate({
      ...item,
      title,
      date,
      time: startTime,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个行程吗？')) {
      onDelete(item.id);
      onClose();
    }
  };

  // Calculate end time
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = (hours || 0) * 60 + (minutes || 0);
  const endMinutes = startMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  return (
    <div className="animate-in slide-in-from-bottom fixed right-0 bottom-0 left-0 z-50 duration-300">
      <div className="border-border bg-card mx-auto max-w-2xl rounded-t-2xl border-t border-r border-l shadow-2xl">
        {/* Handle bar */}
        <div className="flex items-center justify-center py-2">
          <div className="bg-muted h-1 w-12 rounded-full" />
        </div>

        {/* Header */}
        <div className="border-border border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">编辑行程</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conflict warning */}
        {hasConflict && (
          <div className="bg-destructive/10 text-destructive mx-6 mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>此时间段已有其他行程，请调整时间</span>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium">标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                placeholder="输入行程标题"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="h-4 w-4" />
                日期
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              >
                <option value="Day 1">第1天</option>
                <option value="Day 2">第2天</option>
                <option value="Day 3">第3天</option>
                <option value="Day 4">第4天</option>
                <option value="Day 5">第5天</option>
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                时间
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">开始时间</p>
                </div>
                <span className="text-muted-foreground pt-6">至</span>
                <div className="flex-1">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      const [newHours, newMins] = e.target.value.split(':').map(Number);
                      const newStartMinutes = (hours || 0) * 60 + (minutes || 0);
                      const newEndMinutes = (newHours || 0) * 60 + (newMins || 0);
                      const newDuration = newEndMinutes - newStartMinutes;
                      if (newDuration > 0) {
                        setDuration(newDuration);
                      }
                    }}
                    className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">结束时间</p>
                </div>
              </div>
            </div>

            {/* Duration slider */}
            <div>
              <label className="mb-2 block text-sm font-medium">持续时间</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="15"
                  max="480"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-muted-foreground w-16 text-sm">
                  {Math.floor(duration / 60)}h {duration % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-border border-t px-6 py-4">
          <div className="flex gap-2">
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              删除
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
