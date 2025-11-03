'use client';

import { useState, useCallback, useMemo } from 'react';
import { MessageSquare } from 'lucide-react';
import { Calendar, View, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Button } from '@workspace/ui/components/button';
import { EditModal } from './edit-modal';
import type { TimelineItem, DraftItem } from '@/lib/mock-data';

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
  const dayNumber = parseInt(item.date.replace('Day ', '')) - 1;
  const [hours, minutes] = item.time.split(':').map(Number);
  
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
}: TimelineProps) {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('week');

  // Convert timeline items to calendar events
  const events = useMemo(() => {
    return items.map(timelineItemToEvent);
  }, [items]);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedItem(event.resource);
  }, []);

  // Function to get the dragged item from outside (required by react-big-calendar)
  const dragFromOutsideItem = useCallback(() => {
    const dragData = (window as any).__draftDragData;
    if (!dragData) return null;

    try {
      const draftItem: DraftItem = typeof dragData === 'string' ? JSON.parse(dragData) : dragData;
      return draftItem;
    } catch (error) {
      console.error('Failed to parse drag data:', error);
      return null;
    }
  }, []);

  // Handle drop from draft card (external drag)
  const handleDropFromExternal = useCallback(
    ({ start, end, allDay }: { start: Date; end: Date; allDay?: boolean }) => {
      // Get draft item using the helper function
      const draftItem = dragFromOutsideItem();
      if (!draftItem) return;

      try {
        // Calculate day number relative to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        const dayNumber = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const date = `Day ${dayNumber}`;
        const time = format(start, 'HH:mm');

        const newTimelineItem: TimelineItem = {
          id: `timeline-${Date.now()}`,
          draftId: draftItem.id,
          time,
          date,
          title: draftItem.title,
        };

        onUpdateTimeline([...items, newTimelineItem]);
        
        // Clear drag data
        delete (window as any).__draftDragData;
      } catch (error) {
        console.error('Failed to create timeline item:', error);
      }
    },
    [items, onUpdateTimeline, dragFromOutsideItem]
  );

  // Handle event move (drag within calendar)
  const handleEventMove = useCallback(
    ({ event, start, end, isAllDay }: { event: CalendarEvent; start: Date; end: Date; isAllDay?: boolean }) => {
      const updatedItem = eventToTimelineItem({
        ...event,
        start,
        end,
      });
      onUpdateTimeline(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    },
    [items, onUpdateTimeline]
  );

  // Handle event resize
  const handleEventResize = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      const updatedItem = eventToTimelineItem({
        ...event,
        start,
        end,
      });
      onUpdateTimeline(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    },
    [items, onUpdateTimeline]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleDeleteItem = useCallback(
    (id: string) => {
      onUpdateTimeline(items.filter((item) => item.id !== id));
      setSelectedItem(null);
    },
    [onUpdateTimeline]
  );

  const handleUpdateItem = useCallback(
    (updatedItem: TimelineItem) => {
      onUpdateTimeline(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      setSelectedItem(null);
    },
    [items, onUpdateTimeline]
  );


  if (mode === 'ideation' || mode === 'collection') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">时间轴区域</p>
        {mode === 'collection' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartArrangement?.()}
            className="mt-2"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            开始安排行程
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">行程安排</h2>
          <Button variant="ghost" size="sm" onClick={onShowConversation}>
            <MessageSquare className="mr-2 h-4 w-4" />
            对话
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-hidden rbc-calendar-wrapper">
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          defaultView="week"
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleSelectEvent}
          dragFromOutsideItem={dragFromOutsideItem}
          onDropFromOutside={handleDropFromExternal}
          onEventDrop={handleEventMove}
          onEventResize={handleEventResize}
          resizable
          draggableAccessor={() => true}
          defaultDate={new Date()}
          formats={{
            dayFormat: 'E',
            dayHeaderFormat: 'E MMM d',
            dayRangeHeaderFormat: ({ start, end }) =>
              `${format(start, 'MMM d', { locale: zhCN })} - ${format(end, 'MMM d', { locale: zhCN })}`,
            eventTimeRangeFormat: ({ start, end }) =>
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

      {/* Edit Modal */}
      {selectedItem && (
        <EditModal
          item={selectedItem}
          onClose={handleCloseModal}
          onDelete={handleDeleteItem}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
}
