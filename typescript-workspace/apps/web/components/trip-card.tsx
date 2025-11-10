'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import { X, GripVertical, Calendar } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import type { TripCard } from '@/lib/mock-data';

type Mode = 'ideation' | 'collection' | 'arrangement';

// Extend Window interface for drag data
declare global {
  interface Window {
    __draftDragData?: string;
    __mobileDropData?: { start: Date; end: Date };
    __calendarCurrentView?: 'month' | 'week' | 'day' | 'agenda';
    __calendarCurrentDate?: Date;
  }
}

interface TripCardDisplayProps {
  item: TripCard;
  onRemove: (id: string) => void;
  onAddToTimeline: (item: TripCard, startTime: Date) => void;
  mode: Mode;
}

export function TripCardDisplay({ item, onRemove, onAddToTimeline, mode }: TripCardDisplayProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedDate, setSelectedDate] = useState('Day 1');
  const cardRef = useRef<HTMLDivElement>(null);
  const dragElementRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleAddToTimeline = () => {
    // Calculate Date from selected date and time
    const dayNumber = parseInt(selectedDate.replace('Day ', '')) - 1;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + dayNumber);
    startDate.setHours(hours || 10, minutes || 0, 0, 0);
    onAddToTimeline(item, startDate);
    setShowAddModal(false);
  };

  // Mobile touch drag handlers (using native events with passive: false)
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (mode !== 'arrangement') return;

      const touch = e.touches[0];
      if (!touch) return;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Store drag data (same as desktop)
      window.__draftDragData = JSON.stringify(item);

      // Create drag element immediately
      if (cardRef.current) {
        const dragElement = cardRef.current.cloneNode(true) as HTMLElement;
        Object.assign(dragElement.style, {
          position: 'fixed',
          pointerEvents: 'none',
          opacity: '0.9',
          transform: 'rotate(2deg)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          zIndex: '9999',
          width: `${cardRef.current.offsetWidth}px`,
          left: `${touch.clientX - cardRef.current.offsetWidth / 2}px`,
          top: `${touch.clientY - cardRef.current.offsetHeight / 2}px`,
        });
        document.body.appendChild(dragElement);
        dragElementRef.current = dragElement;

        // Add visual feedback to original
        cardRef.current.style.opacity = '0.5';
        cardRef.current.style.transform = 'scale(0.95)';
      }
    },
    [mode, item],
  );

  // Helper function to calculate date/time from touch position in month view
  const calculateDropDateForMonthView = useCallback(
    (touchX: number, touchY: number, calendarElement: HTMLElement, calendarViewDate: Date | undefined): Date | null => {
      // In month view, find which date cell the touch is over
      const monthView = calendarElement.querySelector('.rbc-month-view') as HTMLElement;
      if (!monthView) {
        console.log('[Mobile Drag] Month view not found');
        return null;
      }

      if (!calendarViewDate) {
        console.warn('[Mobile Drag] Calendar view date not found for month view');
        return null;
      }

      // Find all day background cells (.rbc-day-bg) - these are the drop targets
      const dayBgCells = monthView.querySelectorAll('.rbc-day-bg');
      let targetDayBg: HTMLElement | null = null;
      let dayBgIndex = -1;

      // Find the day-bg cell that contains the touch point
      dayBgCells.forEach((cell, index) => {
        const cellEl = cell as HTMLElement;
        const rect = cellEl.getBoundingClientRect();
        if (touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom) {
          targetDayBg = cellEl;
          dayBgIndex = index;
        }
      });

      if (!targetDayBg || dayBgIndex === -1) {
        console.log('[Mobile Drag] No day-bg cell found at touch position');
        return null;
      }

      // Find the corresponding date cell (.rbc-date-cell) at the same index
      // Both .rbc-day-bg and .rbc-date-cell are in the same row structure
      const dateCells = monthView.querySelectorAll('.rbc-date-cell');
      if (dayBgIndex >= dateCells.length) {
        console.warn('[Mobile Drag] Day-bg index out of range:', dayBgIndex, 'total cells:', dateCells.length);
        return null;
      }

      const dateCell = dateCells[dayBgIndex] as HTMLElement;
      if (!dateCell) {
        console.warn('[Mobile Drag] No date cell found at index:', dayBgIndex);
        return null;
      }

      // Extract date from the button inside the date cell
      // The date number is in <button class="rbc-button-link">XX</button>
      const button = dateCell.querySelector('.rbc-button-link') as HTMLElement;
      if (!button) {
        console.warn('[Mobile Drag] No button found in date cell');
        return null;
      }

      const dayText = button.textContent?.trim();
      if (!dayText) {
        console.warn('[Mobile Drag] No day text found in button');
        return null;
      }

      // Parse day number from button text (e.g., "01", "10", "27")
      const dayNumber = parseInt(dayText, 10);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
        console.warn('[Mobile Drag] Invalid day number:', dayText);
        return null;
      }

      // Calculate the full date based on the current month being displayed
      const viewDate = new Date(calendarViewDate);
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();

      // Check if this is an off-range cell (previous/next month dates)
      // TypeScript: After null check, targetDayBg is definitely HTMLElement
      const dayBg = targetDayBg as HTMLElement;
      const isOffRange = dayBg.classList.contains('rbc-off-range-bg') || dateCell.classList.contains('rbc-off-range');

      let targetDate: Date;
      if (isOffRange) {
        // For off-range dates, we need to determine if it's previous or next month
        // If day number is > 15, it's likely previous month
        // If day number is < 15, it's likely next month
        if (dayNumber > 15) {
          // Previous month
          const prevMonth = month === 0 ? 11 : month - 1;
          const prevYear = month === 0 ? year - 1 : year;
          targetDate = new Date(prevYear, prevMonth, dayNumber);
        } else {
          // Next month
          const nextMonth = month === 11 ? 0 : month + 1;
          const nextYear = month === 11 ? year + 1 : year;
          targetDate = new Date(nextYear, nextMonth, dayNumber);
        }
      } else {
        // Current month
        targetDate = new Date(year, month, dayNumber);
      }

      // In month view, default to 9:00 AM (or could use current time)
      targetDate.setHours(9, 0, 0, 0);

      console.log('[Mobile Drag] Calculated drop date for month view:', {
        calendarViewDate,
        targetDate,
        dayText,
        dayNumber,
        isOffRange,
        year,
        month,
      });

      return targetDate;
    },
    [],
  );

  // Helper function to calculate date/time from touch position
  const calculateDropDate = useCallback(
    (touchX: number, touchY: number): Date | null => {
      // Find calendar element directly (don't use elementFromPoint as it might hit the drag element)
      const calendarElement = document.querySelector('.rbc-calendar') as HTMLElement;

      if (!calendarElement) return null;

      // Check if touch is within calendar bounds
      const calendarRect = calendarElement.getBoundingClientRect();
      if (
        touchX < calendarRect.left ||
        touchX > calendarRect.right ||
        touchY < calendarRect.top ||
        touchY > calendarRect.bottom
      ) {
        return null;
      }

      // Get current view type and date to determine how to calculate date
      const calendarView = window.__calendarCurrentView || 'week';
      const calendarViewDate = window.__calendarCurrentDate;

      // Handle month view differently - it doesn't have time-content
      if (calendarView === 'month') {
        return calculateDropDateForMonthView(touchX, touchY, calendarElement, calendarViewDate);
      }

      // For week/day view, find the time content area (the actual scrollable time grid)
      // This is where the time slots are rendered
      const timeContent = calendarElement.querySelector('.rbc-time-content') as HTMLElement;

      if (!timeContent) {
        console.log('[Mobile Drag] Time content not found');
        return null;
      }

      const gridRect = timeContent.getBoundingClientRect();

      // CRITICAL: Account for scroll position! react-big-calendar calculates dates
      // relative to the scrolled content, not the viewport
      const scrollTop = timeContent.scrollTop;

      // Calculate relative position within the time grid
      // Add scrollTop to account for scrolled content
      const relativeY = touchY - gridRect.top + scrollTop;
      const relativeX = touchX - gridRect.left;

      // If touch is above the time grid (in header area), return null
      if (relativeY < 0) {
        console.log(
          '[Mobile Drag] Touch is above time grid, relativeY:',
          relativeY,
          'gridRect.top:',
          gridRect.top,
          'touchY:',
          touchY,
        );
        return null;
      }

      // If touch is below the time grid, clamp to bottom
      if (relativeY > gridRect.height) {
        console.log('[Mobile Drag] Touch is below time grid, clamping');
        // Could clamp to 23:59, but for now return null
        return null;
      }

      // calendarView already retrieved above
      // Find which day column - look for day slots within the time content
      const daySlots = calendarElement.querySelectorAll('.rbc-day-slot');
      let dayOffset = 0;

      if (calendarView === 'day') {
        // In day view, there's only one day, so dayOffset is always 0
        dayOffset = 0;
      } else if (daySlots.length > 0) {
        // In week view, find which day slot the touch is over
        daySlots.forEach((slot, index) => {
          const slotRect = slot.getBoundingClientRect();
          if (touchX >= slotRect.left && touchX <= slotRect.right) {
            dayOffset = index;
          }
        });
      } else {
        // Fallback: calculate from X position relative to time grid (week view)
        const gridWidth = gridRect.width;
        const dayWidth = gridWidth / 7;
        dayOffset = Math.floor(relativeX / dayWidth);
        // Clamp to valid range
        dayOffset = Math.max(0, Math.min(6, dayOffset));
      }

      // Calculate time from Y position
      // Find time slots to get accurate hour height
      // CRITICAL: Use scrollHeight instead of height to get the full content height
      const timeSlots = calendarElement.querySelectorAll('.rbc-time-slot');
      let hourHeight = 60; // Default 60px per hour

      if (timeSlots.length > 0) {
        const firstSlot = timeSlots[0] as HTMLElement;
        const slotHeight = firstSlot.offsetHeight; // Use offsetHeight, not getBoundingClientRect
        // Each slot typically represents 30 minutes in week view
        hourHeight = slotHeight * 2; // 2 slots per hour
      } else {
        // Fallback: use scrollHeight to get total content height
        // This accounts for the full 24-hour day, not just visible portion
        const totalContentHeight = timeContent.scrollHeight;
        hourHeight = totalContentHeight / 24; // 24 hours in a day
      }

      // Calculate hours and minutes from Y position
      // relativeY is now guaranteed to be >= 0
      const totalMinutes = (relativeY / hourHeight) * 60;
      let hours = Math.floor(totalMinutes / 60);
      let minutes = Math.floor((totalMinutes % 60) / 15) * 15;

      // Clamp hours to valid range (0-23)
      hours = Math.max(0, Math.min(23, hours));

      // Ensure minutes are non-negative
      if (minutes < 0) {
        minutes = 0;
        hours = Math.max(0, hours - 1);
      }

      // calendarViewDate already retrieved above
      if (!calendarViewDate) {
        console.warn('Calendar current date not found, using today');
        return null;
      }

      const viewDate = new Date(calendarViewDate);

      // CRITICAL: Handle day view vs week view differently
      let targetDate: Date;

      if (calendarView === 'day') {
        // In day view, always use the current date (dayOffset should be 0)
        targetDate = new Date(viewDate);
        // Set time using local time methods (not UTC) to match desktop behavior
        targetDate.setHours(hours, minutes, 0, 0);
      } else {
        // In week view, calculate from week start + day offset
        const viewDay = viewDate.getDay();

        // Calculate the start of the week being displayed (Sunday = 0)
        const weekStart = new Date(viewDate);
        weekStart.setDate(weekStart.getDate() - viewDay);
        weekStart.setHours(0, 0, 0, 0);

        // Add the day offset to get the target day within the displayed week
        // dayOffset is 0-6 representing Sunday-Saturday
        targetDate = new Date(weekStart);
        targetDate.setDate(targetDate.getDate() + dayOffset);
        // Set time using local time methods (not UTC) to match desktop behavior
        targetDate.setHours(hours, minutes, 0, 0);
      }

      console.log('[Mobile Drag] Calculated drop date:', {
        calendarView: calendarView,
        calendarViewDate: viewDate,
        dayOffset,
        relativeY,
        scrollTop,
        hourHeight,
        totalMinutes: (relativeY / hourHeight) * 60,
        hours,
        minutes,
        targetDate,
        targetDateISO: targetDate.toISOString(),
        targetDateLocal: targetDate.toString(),
        gridRect: {
          top: gridRect.top,
          bottom: gridRect.bottom,
          height: gridRect.height,
          scrollHeight: timeContent.scrollHeight,
        },
        touchY,
        touchX,
      });

      return targetDate;
    },
    [calculateDropDateForMonthView],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      // Check if we have a touch start reference (more reliable than isDragging state)
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // Only prevent default and update position if moved more than 5px (prevents accidental drags)
      if (deltaX < 5 && deltaY < 5) return;

      e.preventDefault(); // Prevent scrolling while dragging

      // Update drag element position
      if (dragElementRef.current && cardRef.current) {
        dragElementRef.current.style.left = `${touch.clientX - cardRef.current.offsetWidth / 2}px`;
        dragElementRef.current.style.top = `${touch.clientY - cardRef.current.offsetHeight / 2}px`;
      }

      // Calculate and dispatch preview date if over calendar
      const previewDate = calculateDropDate(touch.clientX, touch.clientY);
      // Always dispatch, even if null, to clear preview when not over calendar
      window.dispatchEvent(
        new CustomEvent('mobile-drag-preview', {
          detail: { date: previewDate },
        }),
      );
    },
    [calculateDropDate],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      // Check if we actually started a drag
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      if (!touch) {
        // Cleanup if no touch data
        if (dragElementRef.current) {
          document.body.removeChild(dragElementRef.current);
          dragElementRef.current = null;
        }
        if (cardRef.current) {
          cardRef.current.style.opacity = '1';
          cardRef.current.style.transform = 'scale(1)';
        }
        touchStartRef.current = null;
        return;
      }

      const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);

      // Find calendar drop zone (look for react-big-calendar elements)
      const calendarElement =
        elementAtPoint?.closest('.rbc-calendar') ||
        elementAtPoint?.closest('[class*="rbc-calendar"]') ||
        document.querySelector('.rbc-calendar');

      if (calendarElement && dragElementRef.current) {
        // Use calculateDropDate to get the drop date/time (works for all views: month, week, day)
        const dropDate = calculateDropDate(touch.clientX, touch.clientY);

        if (dropDate) {
          // Get default duration based on item type (same logic as desktop)
          const dragData = window.__draftDragData;
          let defaultDuration = 90; // Default 90 minutes

          if (dragData) {
            try {
              const tripCard: TripCard = typeof dragData === 'string' ? JSON.parse(dragData) : dragData;
              const title = tripCard.title.toLowerCase();
              if (title.includes('餐厅') || title.includes('美食') || title.includes('吃')) {
                defaultDuration = 60; // 1 hour for restaurants
              }
            } catch (error) {
              console.error('[Mobile Drag] Failed to parse drag data for duration:', error);
            }
          }

          const dropEnd = new Date(dropDate);
          dropEnd.setMinutes(dropEnd.getMinutes() + defaultDuration);

          // Store drop data for timeline component
          window.__mobileDropData = {
            start: dropDate,
            end: dropEnd,
          };

          console.log('[Mobile Drag] Dispatching drop event:', {
            start: dropDate,
            end: dropEnd,
            hasDraftData: !!window.__draftDragData,
          });

          // Dispatch drop event - timeline component will handle it
          window.dispatchEvent(
            new CustomEvent('mobile-drag-drop', {
              detail: {
                start: dropDate,
                end: dropEnd,
              },
            }),
          );
        } else {
          console.log('[Mobile Drag] No valid drop date calculated at touch position');
        }
      }

      // Clear preview
      window.dispatchEvent(
        new CustomEvent('mobile-drag-preview', {
          detail: { date: null },
        }),
      );

      // Cleanup
      if (dragElementRef.current) {
        document.body.removeChild(dragElementRef.current);
        dragElementRef.current = null;
      }

      if (cardRef.current) {
        cardRef.current.style.opacity = '1';
        cardRef.current.style.transform = 'scale(1)';
      }

      touchStartRef.current = null;

      // Clean up drag data if not dropped successfully
      setTimeout(() => {
        if (window.__draftDragData) {
          delete window.__draftDragData;
        }
        if (window.__mobileDropData) {
          delete window.__mobileDropData;
        }
      }, 100);
    },
    [calculateDropDate],
  );

  // Add touch event listeners with passive: false to allow preventDefault
  useEffect(() => {
    const element = cardRef.current;
    if (!element || mode !== 'arrangement') {
      // Clean up if mode changes or element is removed
      if (dragElementRef.current) {
        document.body.removeChild(dragElementRef.current);
        dragElementRef.current = null;
      }
      return;
    }

    // Use native event listeners with passive: false to allow preventDefault
    // Also add to document for touchmove/touchend to catch events even if touch moves outside element
    const touchStartHandler = handleTouchStart;
    const touchMoveHandler = handleTouchMove;
    const touchEndHandler = handleTouchEnd;

    element.addEventListener('touchstart', touchStartHandler, { passive: false });
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler, { passive: false });
    document.addEventListener('touchcancel', touchEndHandler, { passive: false });

    return () => {
      element.removeEventListener('touchstart', touchStartHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
      document.removeEventListener('touchcancel', touchEndHandler);

      // Cleanup drag element if still exists
      if (dragElementRef.current) {
        document.body.removeChild(dragElementRef.current);
        dragElementRef.current = null;
      }
    };
  }, [mode, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <>
      <div
        ref={cardRef}
        draggable={mode === 'arrangement'}
        onDragStart={(e) => {
          console.log('[Desktop Drag] onDragStart:', {
            item,
            mode,
            clientX: e.clientX,
            clientY: e.clientY,
          });

          e.dataTransfer.setData('application/json', JSON.stringify(item));
          e.dataTransfer.effectAllowed = 'move';
          // Store in window for react-big-calendar's onDropFromOutside
          window.__draftDragData = JSON.stringify(item);

          console.log('[Desktop Drag] Stored draft data:', {
            hasData: !!window.__draftDragData,
            calendarCurrentDate: window.__calendarCurrentDate,
          });

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
          console.log('[Desktop Drag] onDragEnd:', {
            clientX: e.clientX,
            clientY: e.clientY,
            hasDraftData: !!window.__draftDragData,
          });

          // Restore opacity and transform
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1)';
          // Clean up drag data if not dropped successfully
          setTimeout(() => {
            if (window.__draftDragData) {
              console.log('[Desktop Drag] Cleaning up draft data');
              delete window.__draftDragData;
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
          <p className="text-muted-foreground line-clamp-3 text-xs">{item.description || ''}</p>
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
