# Mobile Touch Drag-and-Drop Support

## Overview

Implemented mobile touch drag-and-drop support for draft cards to the calendar timeline, matching desktop drag-and-drop functionality across all calendar views (month, week, day).

## Initial Request

Add mobile drag-and-drop support to `draft-card.tsx` component to enable touch-based dragging on mobile devices.

## Implementation Timeline

### Phase 1: Basic Touch Event Handling

**Problem**: React's synthetic touch events are passive by default, preventing `preventDefault()`.

**Solution**: 
- Removed React's synthetic touch event handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`)
- Implemented native event listeners with `{ passive: false }` option
- Attached listeners to DOM elements directly using `useEffect` and `addEventListener`

**Key Changes**:
- Added `useRef` for `cardRef`, `dragElementRef`, and `touchStartRef`
- Created `handleTouchStart`, `handleTouchMove`, `handleTouchEnd` callbacks
- Used native `touchstart`, `touchmove`, `touchend`, `touchcancel` events

### Phase 2: Visual Feedback and Drag Element

**Problem**: No visual feedback when dragging on mobile.

**Solution**:
- Created a drag element (clone of the card) on `touchstart`
- Positioned drag element at touch coordinates during `touchmove`
- Applied visual styling (opacity, transform) to original card
- Cleaned up drag element on `touchend`

**Key Features**:
- Drag element follows touch position
- Original card shows reduced opacity and scale
- Smooth visual transitions

### Phase 3: Preview Event on Calendar

**Problem**: No preview event appeared when dragging over calendar.

**Solution**:
- Implemented custom event system: `mobile-drag-preview` and `mobile-drag-drop`
- Created `calculateDropDate` function to calculate date/time from touch coordinates
- Added preview event to calendar's events array dynamically
- Styled preview event differently (semi-transparent blue with dashed border)

**Key Implementation**:
- `calculateDropDate`: Calculates date from touch position relative to calendar DOM
- Custom events dispatched during `touchmove` for preview updates
- Timeline component listens for events and updates preview state

### Phase 4: Date Calculation Accuracy

**Problem**: Preview dates were incorrect (showing dates in wrong month/week).

**Root Causes**:
1. **Scroll Position**: Not accounting for calendar's scroll offset
2. **Week Calculation**: Using current date instead of calendar's displayed week
3. **View Type**: Not handling different views (day/week/month) correctly

**Solutions**:
1. Added `scrollTop` to relative Y calculation: `relativeY = (touchY - gridRect.top) + scrollTop`
2. Stored calendar's `currentDate` in `window.__calendarCurrentDate`
3. Used `scrollHeight` instead of viewport height for hour calculations
4. Implemented view-specific date calculation logic

### Phase 5: Day View Support

**Problem**: In day view, dates were offset by one day (e.g., Nov 10 → Nov 9).

**Root Cause**: 
- Code always calculated week start, even in day view
- Should use current date directly in day view

**Solution**:
- Stored current view type in `window.__calendarCurrentView`
- Added conditional logic: day view uses `currentDate` directly, week view calculates from week start
- Fixed timezone handling: use `setHours` (local time) instead of `setUTCHours`

### Phase 6: Month View Support

**Problem**: Month view not supported, only week and day views worked.

**Solution**:
- Created `calculateDropDateForMonthView` function
- Detects touch position over `.rbc-day-bg` cells (drop targets)
- Finds corresponding `.rbc-date-cell` to extract date number from button
- Handles off-range dates (previous/next month dates)
- Defaults to 9:00 AM for month view drops

**Key Implementation**:
- Uses `.rbc-day-bg` for drop detection (not `.rbc-date-cell`)
- Matches day-bg index to date-cell index
- Extracts date from `<button class="rbc-button-link">` text content
- Handles `rbc-off-range-bg` class for previous/next month dates

### Phase 7: Drop Event Handling

**Problem**: Drop events not triggering correctly, especially in month view.

**Solution**:
- Unified `handleTouchEnd` to use `calculateDropDate` for all views
- Removed view-specific drop logic that only checked for `timeGrid`
- Added proper duration calculation based on item type
- Ensured drop events are dispatched correctly

## Technical Details

### Key Functions

#### `calculateDropDate(touchX, touchY)`
Main function that calculates drop date/time from touch coordinates. Handles all three views:
- **Month View**: Uses `calculateDropDateForMonthView`
- **Week/Day View**: Calculates from time grid and day slots

#### `calculateDropDateForMonthView(touchX, touchY, calendarElement, calendarViewDate)`
Specialized function for month view:
- Finds `.rbc-day-bg` cell at touch position
- Matches to corresponding `.rbc-date-cell`
- Extracts date from button text
- Handles off-range dates

#### `handleTouchStart(e: TouchEvent)`
- Prevents default scrolling
- Stores touch start position
- Creates drag element (visual clone)
- Stores draft data in `window.__draftDragData`

#### `handleTouchMove(e: TouchEvent)`
- Updates drag element position
- Calculates preview date using `calculateDropDate`
- Dispatches `mobile-drag-preview` event

#### `handleTouchEnd(e: TouchEvent)`
- Calculates final drop date using `calculateDropDate`
- Calculates duration based on item type
- Dispatches `mobile-drag-drop` event
- Cleans up drag element and state

### Event System

**Custom Events**:
- `mobile-drag-preview`: Dispatched during drag, contains calculated date
- `mobile-drag-drop`: Dispatched on drop, contains start and end dates

**Window Variables**:
- `window.__draftDragData`: Stores draft item data during drag
- `window.__calendarCurrentDate`: Stores calendar's current view date
- `window.__calendarCurrentView`: Stores current view type ('month', 'week', 'day')
- `window.__mobileDropData`: Temporary storage for drop data

### Integration with Timeline Component

**Preview Handling**:
- Listens for `mobile-drag-preview` events
- Updates `previewDate` state
- Uses `dragFromOutsideItem` to create preview event (same as desktop)
- Adds preview event to events array with special styling

**Drop Handling**:
- Listens for `mobile-drag-drop` events
- Calls `handleDropFromExternal` (same as desktop drop handler)
- Creates timeline item with calculated date/time

## Files Modified

### `draft-card.tsx`
- Added touch event handlers
- Implemented drag visual feedback
- Created date calculation functions
- Added custom event dispatching

### `timeline.tsx`
- Added listeners for mobile drag events
- Implemented preview event display
- Integrated with existing drop handling

## Key Learnings

1. **Passive Event Listeners**: React's synthetic events are passive by default. Need native listeners with `passive: false` for `preventDefault()`.

2. **Scroll Position**: Always account for scroll offset when calculating positions relative to scrolled content.

3. **View-Specific Logic**: Different calendar views require different calculation methods. Store view type and handle accordingly.

4. **DOM Structure**: Understanding react-big-calendar's DOM structure is crucial:
   - Month view: `.rbc-day-bg` for drops, `.rbc-date-cell` for date extraction
   - Week/Day view: `.rbc-time-content` and `.rbc-day-slot` for calculations

5. **Unified Approach**: Using a single `calculateDropDate` function that delegates to view-specific functions ensures consistency.

## Testing Checklist

- [x] Touch drag starts correctly
- [x] Visual feedback during drag
- [x] Preview event appears in week view
- [x] Preview event appears in day view
- [x] Preview event appears in month view
- [x] Drop creates timeline item in week view
- [x] Drop creates timeline item in day view
- [x] Drop creates timeline item in month view
- [x] Date calculations are accurate
- [x] Scroll position handled correctly
- [x] Off-range dates handled in month view

## Future Improvements

1. Add haptic feedback on drag start
2. Improve drag element styling
3. Add animation for drop confirmation
4. Support drag cancellation (drag outside calendar)
5. Optimize performance for frequent preview updates

