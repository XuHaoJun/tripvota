# Trip Planning Interface - UI/UX Prototype Documentation

## Overview

This document describes the implementation of a dynamic, mobile-first trip planning interface prototype built with React, Next.js, and react-big-calendar. The interface features three contextual modes that automatically adapt panel sizes based on user interactions, providing focused UI for each workflow stage.

## Project Structure

- **Framework**: Next.js 15.5.4 with Turbopack
- **UI Library**: React 19.1.1
- **Styling**: Tailwind CSS 4.1.13
- **Calendar**: react-big-calendar 1.19.4 with drag-and-drop addon
- **Date Handling**: date-fns 4.1.0
- **Panel Management**: react-resizable-panels 3.0.6
- **Language**: Chinese (Simplified) interface

## Three-Mode Interface Design

### Mode 1: Ideation Mode (发想模式) - "What should we do?"

**Trigger**: User enters page or focuses input field

**UI Distribution**:
- Conversation Panel: ~70% (dominant)
- Draft Pool: ~20% (collapsed, horizontal scroll)
- Timeline: ~10% (minimal, hint only)

**Purpose**: Focus entirely on brainstorming and AI conversation

**Interactions**:
- User chats with AI or friends
- Click "+添加" button on AI messages to add ideas to draft pool
- Cards fly into draft pool with animation

### Mode 2: Collection Mode (收集模式) - "What ideas do we have?"

**Trigger**: User scrolls draft pool horizontally OR adds 2+ items

**UI Distribution**:
- Conversation Panel: ~30% (reduced)
- Draft Pool: ~60% (expanded, visual focus)
- Timeline: ~10% (minimal, hint with "开始安排行程" button)

**Purpose**: Browse, manage, and filter collected ideas

**Interactions**:
- Horizontal scrolling through draft cards
- Delete unwanted ideas
- Click "添加到时间轴" button to add to timeline (opens modal)

### Mode 3: Arrangement Mode (安排模式) - "How to arrange?"

**Trigger**: User drags draft card OR clicks "开始安排行程" button

**UI Distribution**:
- Conversation Panel: ~0% (hidden, accessible via chat icon)
- Draft Pool: ~20% (minimized horizontal scroll bar as "material library")
- Timeline: ~80% (full focus, calendar view)

**Purpose**: Focus entirely on timeline scheduling and detail adjustment

**Interactions**:
- Drag draft cards from pool to calendar
- Drag events within calendar to reschedule
- Resize events to adjust duration
- Click events to edit details (opens modal)

## Implementation Details

### Main Page (`apps/web/app/page.tsx`)

**Key Features**:
- Client component with state management for modes, messages, draft items, and timeline items
- Uses `react-resizable-panels` for dynamic panel resizing
- Automatic mode transitions based on user interactions
- Panel collapse/expand logic for arrangement mode

**State Management**:
```typescript
type Mode = 'ideation' | 'collection' | 'arrangement';

const MODE_SIZES: Record<Mode, { conversation: number; draftPool: number; timeline: number }> = {
  ideation: { conversation: 70, draftPool: 20, timeline: 10 },
  collection: { conversation: 30, draftPool: 60, timeline: 10 },
  arrangement: { conversation: 0, draftPool: 20, timeline: 80 },
};
```

**Mode Transition Logic**:
- Ideation → Collection: User scrolls draft pool OR adds 2+ items
- Collection → Arrangement: User drags card OR clicks "开始安排行程"
- Arrangement → Collection: User clicks conversation button
- Any → Ideation: User focuses input field

### Components

#### 1. Conversation Panel (`components/conversation-panel.tsx`)

**Features**:
- Chat interface with message history
- Input field fixed at bottom
- "+添加" button on AI messages to add ideas to draft pool
- Auto-scroll to latest message
- Input focus handler to switch to ideation mode

**Key Implementation**:
- Messages displayed with role-based styling (user vs AI)
- Draft items created from message content when "+添加" clicked

#### 2. Draft Pool (`components/draft-pool.tsx`)

**Features**:
- Horizontal scrollable card grid
- Scroll detection for mode transitions
- Drag-and-drop support in arrangement mode
- Empty state message

**Key Implementation**:
- Uses `scrollbar-hide` class for clean scrolling
- Touch-friendly scrolling with `-webkit-overflow-scrolling-touch`
- Scroll detection triggers collection mode transition

#### 3. Draft Card (`components/draft-card.tsx`)

**Features**:
- Card component with title and description
- Remove button (appears on hover)
- Drag handle indicator in arrangement mode
- "添加到时间轴" button in collection mode
- Modal for adding to timeline with date/time selection

**Drag Implementation**:
```typescript
onDragStart={(e) => {
  e.dataTransfer.setData('application/json', JSON.stringify(item));
  e.dataTransfer.effectAllowed = 'move';
  // Store in window for react-big-calendar's onDropFromOutside
  (window as any).__draftDragData = JSON.stringify(item);
  e.currentTarget.style.opacity = '0.5';
}}
```

#### 4. Timeline (`components/timeline.tsx`)

**Features**:
- React Big Calendar integration with drag-and-drop addon
- Week view by default
- Chinese localization
- External drag support (from draft cards)
- Event drag and resize support
- Event click to edit

**Key Implementation**:
- Uses `withDragAndDrop` HOC from react-big-calendar
- `dragFromOutsideItem` function required for external drags
- Converts between TimelineItem format and CalendarEvent format
- Handles date calculations (Day 1, Day 2, etc. relative to today)

**Date Handling**:
```typescript
// Convert TimelineItem to CalendarEvent
const timelineItemToEvent = (item: TimelineItem): CalendarEvent => {
  const dayNumber = parseInt(item.date.replace('Day ', '')) - 1;
  const [hours, minutes] = item.time.split(':').map(Number);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + dayNumber);
  startDate.setHours(hours, minutes, 0, 0);
  // ...
};
```

#### 5. Edit Modal (`components/edit-modal.tsx`)

**Features**:
- Edit timeline item title, date, and time
- Delete functionality with confirmation
- Save changes

### Data Structures

**Mock Data** (`lib/mock-data.ts`):

```typescript
export interface ConversationMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface DraftItem {
  id: string;
  title: string;
  description: string;
  category?: string;
}

export interface TimelineItem {
  id: string;
  draftId: string;
  time: string;  // Format: "HH:mm"
  date: string;  // Format: "Day 1", "Day 2", etc.
  title: string;
}
```

## Technical Decisions

### Panel Resizing

- Uses `react-resizable-panels` for smooth, programmatic resizing
- Panels collapse/expand based on mode
- Conversation panel collapses completely in arrangement mode
- Smooth transitions with CSS `transition-all duration-300 ease-in-out`

### Drag-and-Drop Implementation

**External Drags (Draft Cards → Calendar)**:
- Stores drag data in `window.__draftDragData` during drag start
- `dragFromOutsideItem` function retrieves data for react-big-calendar
- `onDropFromOutside` handler processes the drop and creates timeline item
- Cleans up window data after successful drop

**Internal Drags (Within Calendar)**:
- Uses react-big-calendar's built-in drag-and-drop
- `onEventDrop` handles event moves
- `onEventResize` handles event resizing

### Theme Configuration

**Forced Light Theme** (`components/providers.tsx`):
```typescript
<NextThemesProvider
  attribute="class"
  defaultTheme="light"
  forcedTheme="light"
  enableSystem={false}
  // ...
>
```

### Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interactions
- `touch-none` class on draggable elements
- `-webkit-overflow-scrolling-touch` for smooth scrolling
- Disabled text selection on draggable cards
- Tap highlight removal with `WebkitTapHighlightColor: 'transparent'`

### Calendar Styling

Custom CSS added to `packages/ui/src/styles/globals.css`:
- Theme-aware colors using CSS variables
- Styled toolbar buttons
- Custom event styling
- Responsive calendar layout

## Issues Encountered and Solutions

### Issue 1: Panel Conditional Rendering

**Problem**: Conditionally rendering panels broke PanelGroup structure

**Solution**: Always render all panels, but control visibility/size:
- Use `collapsible` prop for conversation panel
- Call `collapse()`/`expand()` methods programmatically
- Hide with CSS class when needed

### Issue 2: External Drag Support

**Problem**: `_this.context.draggable.dragFromOutsideItem is not a function` error

**Solution**: 
- Added `dragFromOutsideItem` function prop to DragAndDropCalendar
- Function retrieves drag data from `window.__draftDragData`
- Both `dragFromOutsideItem` and `onDropFromOutside` are required

### Issue 3: Date Calculation

**Problem**: Day number calculation relative to today

**Solution**:
- Normalize dates to midnight before calculation
- Use `Math.floor` for day difference calculation
- Handle edge cases for same-day events

## File Structure

```
typescript-workspace/apps/web/
├── app/
│   ├── page.tsx              # Main page with mode management
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── conversation-panel.tsx # Chat interface
│   ├── draft-pool.tsx        # Draft cards container
│   ├── draft-card.tsx        # Individual draft card
│   ├── timeline.tsx          # Calendar component
│   ├── timeline-item.tsx     # Timeline entry (unused in calendar mode)
│   ├── edit-modal.tsx        # Edit timeline item modal
│   └── providers.tsx         # Theme provider
└── lib/
    └── mock-data.ts          # Type definitions and initial data
```

## Dependencies

```json
{
  "react-big-calendar": "^1.19.4",
  "react-resizable-panels": "^3.0.6",
  "date-fns": "^4.1.0",
  "next": "^15.5.4",
  "react": "^19.1.1",
  "lucide-react": "^0.544.0"
}
```

## Key Patterns

1. **Mode-based UI**: Dynamic panel sizing based on user context
2. **Progressive Disclosure**: Show more detail as user progresses through workflow
3. **Drag-and-Drop**: External drags from draft pool to calendar
4. **Event Management**: Create, update, delete timeline items
5. **Mobile-First**: Touch-friendly interactions and responsive design

## Future Enhancements

- Add filtering/sorting to draft pool
- Implement undo/redo for timeline changes
- Add collaboration features (voting, comments)
- Enhance calendar with more views (month, agenda)
- Add export functionality
- Implement persistence (localStorage or backend)

## Notes for AI Assistants

When working with this codebase:

1. **Mode Management**: Always update both state and panel sizes when changing modes
2. **Drag Data**: External drags require storing data in `window.__draftDragData`
3. **Date Format**: Timeline items use "Day X" format, calendar uses Date objects
4. **Conversion**: Always convert between TimelineItem and CalendarEvent formats
5. **Theme**: App is forced to light theme - don't add dark mode toggle
6. **Mobile**: Ensure all interactions work on touch devices
7. **Panel Refs**: Use refs to programmatically resize panels, not just CSS

## Testing Checklist

- [ ] Mode transitions work correctly
- [ ] Draft cards can be dragged to calendar
- [ ] Events can be moved within calendar
- [ ] Events can be resized
- [ ] Edit modal works correctly
- [ ] Mobile touch interactions work
- [ ] Panel resizing is smooth
- [ ] Chinese localization displays correctly

