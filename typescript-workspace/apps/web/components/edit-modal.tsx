'use client';

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import type { TimelineItem } from '@/lib/mock-data';

interface EditModalProps {
  item: TimelineItem;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (item: TimelineItem) => void;
}

export function EditModal({ item, onClose, onDelete, onUpdate }: EditModalProps) {
  const [title, setTitle] = useState(item.title);
  const [date, setDate] = useState(item.date);
  const [time, setTime] = useState(item.time);

  useEffect(() => {
    setTitle(item.title);
    setDate(item.date);
    setTime(item.time);
  }, [item]);

  const handleSave = () => {
    onUpdate({
      ...item,
      title,
      date,
      time,
    });
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个行程吗？')) {
      onDelete(item.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
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
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">日期</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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

