'use client';

import { useState, useEffect } from 'react';

import { format } from 'date-fns';
import { X, Trash2 } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import type { TripCard } from '@/lib/mock-data';

interface TripCardEditModalProps {
  item: TripCard;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (item: TripCard) => void;
}

export function TripCardEditModal({ item, onClose, onDelete, onUpdate }: TripCardEditModalProps) {
  const [title, setTitle] = useState(item.title);
  const [startTime, setStartTime] = useState<Date>(item.startTime || new Date());
  const [endTime, setEndTime] = useState<Date>(item.endTime || new Date());

  useEffect(() => {
    setTitle(item.title);
    setStartTime(item.startTime || new Date());
    setEndTime(item.endTime || new Date());
  }, [item]);

  const handleSave = () => {
    onUpdate({
      ...item,
      title,
      startTime,
      endTime,
      updatedAt: new Date(),
    });
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个行程吗？')) {
      onDelete(item.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="border-border bg-card w-full max-w-md rounded-lg border p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">编辑行程</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">日期</label>
            <input
              type="date"
              value={format(startTime, 'yyyy-MM-dd')}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                const hours = startTime.getHours();
                const minutes = startTime.getMinutes();
                newDate.setHours(hours, minutes, 0, 0);
                setStartTime(newDate);
              }}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">开始时间</label>
            <input
              type="time"
              value={format(startTime, 'HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                const newStartTime = new Date(startTime);
                newStartTime.setHours(hours || 0, minutes || 0, 0, 0);
                setStartTime(newStartTime);
              }}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">结束时间</label>
            <input
              type="time"
              value={format(endTime, 'HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                const newEndTime = new Date(startTime);
                newEndTime.setHours(hours || 0, minutes || 0, 0, 0);
                if (newEndTime > startTime) {
                  setEndTime(newEndTime);
                }
              }}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
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
