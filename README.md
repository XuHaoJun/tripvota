# TripVota

A collaborative travel planning system that combines the scheduling power of Google Calendar with voting capabilities, designed for groups of friends planning short-term domestic trips (weekends and holidays).

## 🎯 Core Value Proposition

TripVota transforms travel planning from a tedious coordination task into an engaging, collaborative experience. Unlike traditional planning tools that rely on back-and-forth messaging and scattered information, TripVota provides:

- **Real-time collaborative editing** - Multiple users can edit simultaneously without conflicts
- **AI-powered option generation** - Intelligent suggestions based on group preferences and constraints
- **Seamless decision-making** - Built-in voting mechanisms integrated directly into the planning workflow
- **Mobile-first design** - Optimized for smartphone use with intuitive touch interactions

## ✨ Key Features

### 1. Real-Time Collaborative Editing
- Simultaneous multi-user editing without conflicts
- Visual indicators showing who's editing what (cursors, avatars)
- Instant synchronization across all devices
- Single source of truth for all trip information

### 2. AI-Driven Planning
- Conversational interface for brainstorming ideas
- Automatic generation of itinerary options based on:
  - Budget constraints
  - Group size
  - Starting location
  - Time preferences
- Smart optimization suggestions (travel time, opening hours, conflicts)

### 3. Three-Stage Planning Flow

#### Stage 1: 发想 (Brainstorming) - "What do we want to do?"
- Chat-style interface for group discussion
- AI assistant to generate suggestions
- Natural language input: "I want to go to the beach" or "@AI generate options for a half-day trip from Taipei Station"
- Options from AI include quick-add buttons

#### Stage 2: 收集 (Collection) - "What ideas do we have?"
- Draft pool displaying all collected ideas as cards
- Horizontal scrolling gallery
- Easy management: add, remove, or categorize ideas
- Visual "materials library" before arrangement

#### Stage 3: 安排 (Arrangement) - "How do we schedule it?"
- Vertical timeline visualization
- Drag-and-drop from draft pool to timeline
- Smart time slot suggestions
- Conflict detection and resolution via voting
- Detailed editing via bottom sheet modal

### 4. Voting & Decision Making
- Inline voting on conflicting options
- Transparent decision process with comments
- Context-aware voting tied to specific time slots or activities

## 📱 Mobile-First UI/UX Design

### Dynamic Screen Layout

The interface adapts based on the user's current task, ensuring focus and clarity:

| Mode | Primary Focus | Screen Ratio | User State |
|------|---------------|--------------|------------|
| **Brainstorming** | Conversation area | 70%+ | Exploration & input |
| **Collection** | Draft pool | 60% | Browsing & selection |
| **Arrangement** | Timeline | 80%+ | Focused scheduling |

### Key Interactions

#### Draft Pool → Timeline Transition
- **Primary**: Drag-and-drop with smart snap-to-time
  - Long-press card from draft pool
  - Drag to timeline position
  - Visual preview and smart time slot suggestion
  - Release to automatically create timeline block
- **Secondary**: Quick-add with time slot selection
  - Tap "Schedule" button on card
  - AI suggests 2-3 optimal time slots
  - One-tap selection

#### Timeline Editing
- Tap any timeline block to open bottom sheet modal
- Edit details:
  - Time (start/end)
  - Transportation method (walk, bus, taxi, etc.)
  - Budget
  - Notes and comments (@mention other members)
  - Initiate voting for uncertain options

### Design Principles

1. **Progressive Disclosure**: Show information only when needed
2. **Gesture-First**: Prioritize drag-and-drop over taps where possible
3. **Visual Feedback**: Clear indicators for collaborative actions (avatars, cursors, "editing..." hints)
4. **Context Preservation**: Discussion threads tied to specific timeline blocks

## 🎨 User Experience Flow

```
Create Trip → Share Link → Friends Join
    ↓
Chat & Brainstorm (AI generates options)
    ↓
Collect Ideas → Draft Pool
    ↓
Drag & Drop → Timeline
    ↓
Refine Details → Add Transportation, Budget, Notes
    ↓
Resolve Conflicts → Vote on Conflicting Options
    ↓
Finalize → Optimize with AI → Share Completed Itinerary
```

## 👥 Target Users

**Primary**: Groups of 3-5 friends planning:
- Weekend trips
- Holiday short getaways
- Domestic travel within the same country/region

**User Needs**:
- Quick decision-making (not overly complex planning)
- Shared ownership of the trip
- Visual and intuitive planning process
- Mobile accessibility

## 🛠 Technical Considerations

### Recommended Tech Stack

- **Frontend**: React/Vue.js for drag-and-drop and real-time updates
- **Real-time Collaboration**: Y.js or Socket.io for synchronization
- **AI Backend**: OpenAI GPT-4 or Google Gemini API
- **Mobile Framework**: React Native or Progressive Web App (PWA)

### Key Technical Challenges

1. **Conflict Resolution**: Handling simultaneous edits to the same timeline block
2. **Network Latency**: Ensuring smooth real-time updates across devices
3. **Offline Support**: Allowing users to continue editing without constant connection
4. **AI Integration**: Efficient prompt engineering for travel-specific suggestions

## 🚀 Development Phases

### Phase 1 (MVP)
- ✅ AI conversation interface for generating options
- ✅ Draft pool collection
- ✅ Basic drag-and-drop to timeline
- ✅ Simple timeline visualization

### Phase 2
- [ ] Real-time collaborative editing
- [ ] Conflict detection and voting
- [ ] Transportation planning
- [ ] Budget tracking

### Phase 3
- [ ] AI optimization suggestions
- [ ] Advanced permissions (view-only, editor)
- [ ] Export and sharing features
- [ ] Integration with booking platforms

## 📝 Design Philosophy

> "Let AI be the team's versatile assistant, responsible for ideation and initial planning; let humans be the decision-makers, co-creating the final itinerary through intuitive drag-and-drop and clicks."

The goal is to hide the complexity of collaborative editing behind intuitive "drag, drop, tap, and press" interactions, making trip planning itself an enjoyable experience.

## 🔍 Competitive Analysis

While no direct competitors combine "collaborative travel planning + voting" exactly, insights from similar tools:

- **Google Calendar**: Solves "when are you free?" but lacks travel-specific features
- **Travel Booking Apps**: Focus on transactions, not collaborative planning
- **Trip Planning Tools**: Often asynchronous sharing, not real-time collaboration

**TripVota's Differentiation**: Deep real-time collaboration + AI-driven option generation + integrated voting mechanism specifically for group travel planning.

---

## License

[To be determined]
