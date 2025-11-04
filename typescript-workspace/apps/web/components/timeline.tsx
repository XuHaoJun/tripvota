'use client';

import { useState, useCallback, useMemo } from 'react';

import { format, parse, startOfWeek, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare } from 'lucide-react';
import { Calendar, View, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Button } from '@workspace/ui/components/button';

import type { TimelineItem, DraftItem } from '@/lib/mock-data';

import { EditModal } from './edit-modal';
import { TimelineEditSheet } from './timeline-edit-sheet';

// Wrap Calendar with drag and drop functionality
const DragAndDropCalendar = withDragAndDrop(Calendar);

type Mode = 'ideation' | 'collection' | 'arrangement';

interface TimelineProps {
  items: TimelineItem[];
  draftItems: DraftItem[];
  mode: Mode;
  onShowConversation: () => void;
  onUpdateTimeline: (items: TimelineItem[]) => void;
  onStartArrangement?: () => void;
  onJustAdded?: (item: TimelineItem) => void;
}

// Create a localizer using date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: zhCN }),
  getDay,
  locales: { 'zh-CN': zhCN },
});

// Calendar event interface
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: TimelineItem;
}

// Helper to convert TimelineItem to CalendarEvent
const timelineItemToEvent = (item: TimelineItem): CalendarEvent => {
  // Parse date and time
  // Assuming date format is "Day 1", "Day 2", etc. and time is "HH:mm"
  const dayNumberStr = item.date.replace('Day ', '');
  const dayNumber = parseInt(dayNumberStr) - 1;
  const timeParts = item.time.split(':');
  const hours = timeParts[0] ? parseInt(timeParts[0]) : 0;
  const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0;

  // Start from today, add days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + dayNumber);
  startDate.setHours(hours, minutes, 0, 0);

  // End time is 1 hour later by default
  const endDate = new Date(startDate);
  endDate.setHours(hours + 1, minutes, 0, 0);

  return {
    id: item.id,
    title: item.title,
    start: startDate,
    end: endDate,
    resource: item,
  };
};

// Helper to convert CalendarEvent back to TimelineItem
const eventToTimelineItem = (event: CalendarEvent): TimelineItem => {
  const dayNumber = Math.floor((event.start.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) + 1;
  const date = `Day ${dayNumber}`;
  const time = format(event.start, 'HH:mm');

  return {
    ...event.resource,
    date,
    time,
  };
};

export function Timeline({
  items,
  draftItems,
  mode,
  onShowConversation,
  onUpdateTimeline,
  onStartArrangement,
  onJustAdded,
}: TimelineProps) {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('week');

  // Convert timeline items to calendar events
  const events = useMemo(() => {
    return items.map(timelineItemToEvent);
  }, [items]);

  // Handle event selection - open bottom sheet instead of modal
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setEditingItem(event.resource);
    setSelectedItem(null); // Close modal if open
  }, []);

  // Smart snap to nearest time slot (15-minute intervals)
  const snapToNearestSlot = useCallback((date: Date): Date => {
    const minutes = date.getMinutes();
    const snappedMinutes = Math.round(minutes / 15) * 15;
    const snapped = new Date(date);
    snapped.setMinutes(snappedMinutes, 0, 0);
    return snapped;
  }, []);

  // Get default duration based on item type (smart preset)
  const getDefaultDuration = useCallback((draftItem: DraftItem): number => {
    // Default to 1.5 hours for most items, 1 hour for restaurants
    const title = draftItem.title.toLowerCase();
    if (title.includes('餐厅') || title.includes('美食') || title.includes('吃')) {
      return 60; // 1 hour
    }
    return 90; // 1.5 hours
  }, []);

  // Function to get the dragged item from outside (required by react-big-calendar)
  // This should return an event object with start and end times for preview
  const dragFromOutsideItem = useCallback(
    (start?: Date): CalendarEvent | null => {
      const dragData = (window as any).__draftDragData;
      if (!dragData) return null;

      try {
        const draftItem: DraftItem = typeof dragData === 'string' ? JSON.parse(dragData) : dragData;

        // Use provided start time or current time as fallback
        const previewStart = start ? snapToNearestSlot(start) : new Date();

        // Get default duration based on item type (same as snapToNearestSlot logic)
        const defaultDuration = getDefaultDuration(draftItem);
        const previewEnd = new Date(previewStart);
        previewEnd.setMinutes(previewEnd.getMinutes() + defaultDuration);

        // Return a temporary event object for preview
        return {
          id: `preview-${Date.now()}`,
          title: draftItem.title,
          start: previewStart,
          end: previewEnd,
          resource: {
            id: `preview-${Date.now()}`,
            draftId: draftItem.id,
            time: format(previewStart, 'HH:mm'),
            date: 'Day 1', // Will be calculated on drop
            title: draftItem.title,
          },
        };
      } catch (error) {
        console.error('Failed to parse drag data:', error);
        return null;
      }
    },
    [snapToNearestSlot, getDefaultDuration],
  );

  // Check for time conflicts
  const checkConflict = useCallback(
    (start: Date, end: Date, excludeId?: string): boolean => {
      return events.some((event) => {
        if (excludeId && event.id === excludeId) return false;
        return (
          (start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end)
        );
      });
    },
    [events],
  );

  // Handle drop from draft card (external drag)
  const handleDropFromExternal = useCallback(
    ({ start, end, allDay }: { start: Date; end: Date; allDay?: boolean }) => {
      // Get draft item from window data (not from dragFromOutsideItem which returns CalendarEvent)
      const dragData = (window as any).__draftDragData;
      if (!dragData) return;

      let draftItem: DraftItem;
      try {
        draftItem = typeof dragData === 'string' ? JSON.parse(dragData) : dragData;
      } catch (error) {
        console.error('Failed to parse drag data:', error);
        return;
      }

      try {
        // Smart snap to nearest 15-minute slot
        const snappedStart = snapToNearestSlot(start);

        // Get default duration
        const defaultDuration = getDefaultDuration(draftItem);
        const snappedEnd = new Date(snappedStart);
        snappedEnd.setMinutes(snappedEnd.getMinutes() + defaultDuration);

        // Check for conflicts
        const hasConflict = checkConflict(snappedStart, snappedEnd);

        // Calculate day number relative to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(snappedStart);
        startDate.setHours(0, 0, 0, 0);
        const dayNumber = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const date = `Day ${dayNumber}`;
        const time = format(snappedStart, 'HH:mm');

        const newTimelineItem: TimelineItem = {
          id: `timeline-${Date.now()}`,
          draftId: draftItem.id,
          time,
          date,
          title: draftItem.title,
        };

        const updatedItems = [...items, newTimelineItem];
        onUpdateTimeline(updatedItems);

        // Clear drag data
        delete (window as any).__draftDragData;

        // Auto-open bottom edit sheet after drop (Aha! Moment)
        setTimeout(() => {
          setEditingItem(newTimelineItem);
          onJustAdded?.(newTimelineItem);
        }, 300);
      } catch (error) {
        console.error('Failed to create timeline item:', error);
      }
    },
    [items, onUpdateTimeline, snapToNearestSlot, checkConflict, getDefaultDuration, onJustAdded],
  );

  // Handle event move (drag within calendar)
  const handleEventMove = useCallback(
    (params: { event: CalendarEvent; start: Date; end: Date; isAllDay?: boolean }) => {
      const { event, start, end } = params;
      const updatedItem = eventToTimelineItem({
        ...event,
        start,
        end,
      });
      onUpdateTimeline(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    },
    [items, onUpdateTimeline],
  );

  // Handle event resize
  const handleEventResize = useCallback(
    (params: { event: CalendarEvent; start: Date; end: Date }) => {
      const { event, start, end } = params;
      const updatedItem = eventToTimelineItem({
        ...event,
        start,
        end,
      });
      onUpdateTimeline(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    },
    [items, onUpdateTimeline],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleDeleteItem = useCallback(
    (id: string) => {
      onUpdateTimeline(items.filter((item) => item.id !== id));
      setSelectedItem(null);
      setEditingItem(null);
    },
    [onUpdateTimeline],
  );

  const handleUpdateItem = useCallback(
    (updatedItem: TimelineItem) => {
      onUpdateTimeline(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      setSelectedItem(null);
      setEditingItem(null);
    },
    [items, onUpdateTimeline],
  );

  // Check if editing item has conflict
  const editingItemHasConflict = useMemo(() => {
    if (!editingItem) return false;
    const event = timelineItemToEvent(editingItem);
    return checkConflict(event.start, event.end, editingItem.id);
  }, [editingItem, checkConflict]);

  if (mode === 'ideation' || mode === 'collection') {
    return (
      <div className="bg-muted/30 flex h-full flex-col items-center justify-center">
        <p className="text-muted-foreground text-sm">时间轴区域</p>
        {mode === 'collection' && (
          <Button variant="ghost" size="sm" onClick={() => onStartArrangement?.()} className="mt-2">
            <MessageSquare className="mr-2 h-4 w-4" />
            开始安排行程
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Header */}
      <div className="border-border bg-muted/50 border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-base font-semibold">行程安排</h2>
          <Button variant="ghost" size="sm" onClick={onShowConversation}>
            <MessageSquare className="mr-2 h-4 w-4" />
            对话
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="rbc-calendar-wrapper flex-1 overflow-hidden">
        <DragAndDropCalendar
          localizer={localizer}
          events={events as any}
          startAccessor={(event: any) => (event as CalendarEvent).start}
          endAccessor={(event: any) => (event as CalendarEvent).end}
          style={{ height: '100%' }}
          defaultView="week"
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={(event: any) => handleSelectEvent(event as CalendarEvent)}
          dragFromOutsideItem={(start?: Date) => {
            const result = dragFromOutsideItem(start);
            return result as any;
          }}
          onDropFromOutside={(args: any) => {
            const { start, end, allDay } = args;
            handleDropFromExternal({ start, end, allDay });
          }}
          onEventDrop={(args: any) => {
            const { event, start, end, isAllDay } = args;
            handleEventMove({ event: event as CalendarEvent, start, end, isAllDay });
          }}
          onEventResize={(args: any) => {
            const { event, start, end } = args;
            handleEventResize({ event: event as CalendarEvent, start, end });
          }}
          resizable
          draggableAccessor={() => true}
          defaultDate={new Date()}
          formats={{
            dayFormat: 'E',
            dayHeaderFormat: 'E MMM d',
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, 'MMM d', { locale: zhCN })} - ${format(end, 'MMM d', { locale: zhCN })}`,
            eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, 'HH:mm', { locale: zhCN })} - ${format(end, 'HH:mm', { locale: zhCN })}`,
          }}
          messages={{
            next: '下一个',
            previous: '上一个',
            today: '今天',
            month: '月',
            week: '周',
            day: '日',
            agenda: '议程',
            date: '日期',
            time: '时间',
            event: '事件',
            noEventsInRange: '此范围内没有事件',
          }}
          className="rbc-calendar"
        />
      </div>

      {/* Edit Modal (fallback for non-calendar views) */}
      {selectedItem && (
        <EditModal
          item={selectedItem}
          onClose={handleCloseModal}
          onDelete={handleDeleteItem}
          onUpdate={handleUpdateItem}
        />
      )}

      {/* Bottom Edit Sheet (primary editing interface) */}
      {editingItem && (
        <TimelineEditSheet
          item={editingItem}
          onClose={handleCloseSheet}
          onDelete={handleDeleteItem}
          onUpdate={handleUpdateItem}
          hasConflict={editingItemHasConflict}
        />
      )}
    </div>
  );
}
