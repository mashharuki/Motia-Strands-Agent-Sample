# Strands Agent Support Ticket System - UI Design Specification

> Apple-inspired Premium Design for React + Vite Frontend

---

## 1. Design System Foundation

### Color Palette

```css
:root {
  /* Background Layers */
  --canvas:             #F5F5F7;
  --surface:            #FFFFFF;
  --surface-elevated:   #FFFFFF;
  --surface-glass:      rgba(255, 255, 255, 0.72);

  /* Text */
  --label-primary:      #1D1D1F;
  --label-secondary:    #6E6E73;
  --label-tertiary:     #AEAEB2;
  --label-quaternary:   #C7C7CC;

  /* Status / Semantic Colors */
  --critical:           #FF3B30;
  --high:               #FF9500;
  --medium:             #FFCC00;
  --low:                #34C759;
  --info:               #007AFF;

  /* Ticket Status */
  --status-open:        #007AFF;
  --status-in-progress: #FF9500;
  --status-resolved:    #34C759;
  --status-closed:      #8E8E93;
  --status-escalated:   #5856D6;

  /* Accent */
  --accent-blue:        #007AFF;
  --accent-blue-light:  rgba(0, 122, 255, 0.10);
  --accent-indigo:      #5856D6;

  /* Borders */
  --separator:          rgba(0, 0, 0, 0.08);
  --separator-strong:   rgba(0, 0, 0, 0.16);
}
```

### Dark Mode Colors

```css
@media (prefers-color-scheme: dark) {
  :root {
    --canvas:           #000000;
    --surface:          #1C1C1E;
    --surface-elevated: #2C2C2E;
    --surface-glass:    rgba(28, 28, 30, 0.72);
    --label-primary:    #FFFFFF;
    --label-secondary:  #AEAEB2;
    --label-tertiary:   #636366;
    --label-quaternary: #48484A;
    --separator:        rgba(255, 255, 255, 0.12);
    --separator-strong: rgba(255, 255, 255, 0.20);
  }
}
```

### Typography

```css
:root {
  --font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --font-text:    'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --font-mono:    'SF Mono', 'Fira Code', 'Menlo', monospace;
}
```

| Style       | Size | Weight | Tracking | Line Height |
|-------------|------|--------|----------|-------------|
| Large Title | 34px | 700    | -0.5px   | 1.18        |
| Title 1     | 28px | 700    | -0.4px   | 1.21        |
| Title 2     | 22px | 700    | -0.3px   | 1.27        |
| Title 3     | 20px | 600    | -0.2px   | 1.30        |
| Headline    | 17px | 600    | -0.1px   | 1.41        |
| Body        | 17px | 400    | 0px      | 1.53        |
| Callout     | 16px | 400    | 0px      | 1.50        |
| Subheadline | 15px | 400    | 0px      | 1.47        |
| Footnote    | 13px | 400    | 0px      | 1.54        |
| Caption 1   | 12px | 400    | 0px      | 1.42        |
| Caption 2   | 11px | 400    | 0.2px    | 1.45        |

> Note: Japanese text gets +0.1 line-height and +1 weight level bump.

### Spacing System (8px Grid)

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### Effects

```css
:root {
  /* Shadows */
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm:  0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08);
  --shadow-critical: 0 4px 20px rgba(255,59,48,0.20);

  /* Border Radius */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* Animation */
  --duration-instant: 60ms;
  --duration-fast:    120ms;
  --duration-normal:  240ms;
  --duration-slow:    360ms;
  --duration-slower:  480ms;

  --easing-standard:   cubic-bezier(0.25, 0.1, 0.25, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --easing-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 2. Application Shell Layout

```
+----------------------------------------------------------+
| Sidebar (240px)     |  Main Content Area (flex-1)         |
|                     |                                     |
| +------------------+|  +-------------------------------+  |
| | Logo + App Name  ||  | Top Bar (56px)                |  |
| | (48px height)    ||  | breadcrumb + actions          |  |
| +------------------+|  +-------------------------------+  |
| | Nav Items        ||  |                               |  |
| | (44px each)      ||  |  Page Content                 |  |
| |                  ||  |  (independent scroll)         |  |
| | * Dashboard      ||  |                               |  |
| | * Tickets        ||  |                               |  |
| | * AI Assistant   ||  +-------------------------------+  |
| |                  ||                                     |
| +------------------+|                                     |
| | User Profile     ||                                     |
| | (bottom)         ||                                     |
| +------------------+|                                     |
+----------------------------------------------------------+
```

### Sidebar Specs
- Background: `surface-glass` with `backdrop-filter: blur(20px)`
- Right border: `1px solid separator`
- Position: `fixed`, left/top/bottom: 0
- z-index: 100

### Nav Item Specs
- Height: 44px (touch target)
- Padding: 0 16px, gap: 12px (icon-to-text)
- Border-radius: 10px, margin-x: 8px
- Active: `accent-blue-light` bg, `accent-blue` text
- Hover: `rgba(0,0,0,0.04)` bg
- Icon: 18x18px

### Top Bar Specs
- Height: 56px
- Background: `surface-glass` with `backdrop-filter: blur(20px)`
- Bottom border: `1px solid separator`
- Position: sticky, top: 0, z-index: 50
- Padding: 0 32px

---

## 3. Dashboard Screen

### 3-1. Stats Cards Row (4-column grid)

```
+---------------+ +---------------+ +---------------+ +---------------+
| Total Tickets | | Open Today    | | SLA Breached  | | Avg Res Time  |
|               | |               | |               | |               |
| [Icon 32px]   | | [Icon 32px]   | | [Icon 32px]   | | [Icon 32px]   |
| 248           | | 12            | | 3             | | 47 min        |
| +8 today      | | 4 in triage   | | +2 from yday  | | -12 min       |
+---------------+ +---------------+ +---------------+ +---------------+
```

- Grid: 4 columns, gap 16px
- Each card: surface, shadow-md, radius-lg, padding 20px 24px
- Icon container: 40x40px, radius 10px, semantic color background
- Trend indicators: Green down-arrow (improving), Red up-arrow (worsening)
- Hover: translateY(-2px) + shadow-lg transition 240ms

### 3-2. SLA Status Panel

- Progress bars: height 6px, radius-full
- Color coding: 90-100% green, 70-89% orange, 0-69% red
- Animation: width 0% to actual, 600ms with 80ms stagger per row

### 3-3. Priority Distribution + Recent Activity (60/40 split)

- Left: Donut chart (SVG, 160px diameter) with center count label
- Right: Timeline feed, latest 5 entries with status-colored icons

---

## 4. Ticket List Screen

### 4-1. Filter Bar (height: 52px)

```
[Search (280px)] | [All] [Critical] [High] [Medium] [Low] | [Sort] [View Toggle]
```

- Search: height 36px, radius-sm, focus state with blue border + glow
- Pill filters: height 32px, radius-full, selected = accent-blue + white text
- Sort/Toggle buttons: 36x36px, radius-sm

### 4-2. Ticket Table

| Column   | Width  | Content                      |
|----------|--------|------------------------------|
| Priority | 80px   | Color dot + label            |
| ID       | 80px   | #TKT-xxxx (mono font)       |
| Title    | flex-1 | Main info                    |
| Customer | 180px  | Email                        |
| Status   | 120px  | Pill badge                   |
| SLA      | 100px  | Countdown timer              |
| Assignee | 120px  | Avatar + name                |
| Created  | 120px  | Relative time                |
| Actions  | 80px   | "..." menu button            |

- Header: 44px height, rgba(0,0,0,0.02) bg, uppercase footnote text
- Data rows: 56px height, hover bg, click navigates to detail
- Critical rows: 3px left red accent border + shadow-critical on hover
- SLA countdown color: >50% gray, 25-50% orange, <25% red pulse, overdue = red bg

### Status Badge Colors

| Status      | Background              | Text      |
|-------------|-------------------------|-----------|
| open        | rgba(0,122,255,0.10)    | #007AFF   |
| in-progress | rgba(255,149,0,0.10)    | #FF9500   |
| resolved    | rgba(52,199,89,0.10)    | #34C759   |
| closed      | rgba(142,142,147,0.12)  | #8E8E93   |
| escalated   | rgba(88,86,214,0.10)    | #5856D6   |

---

## 5. Ticket Detail Screen

### 2-Column Layout (65% content / 35% action panel)

```
+-------------------------------+--------------------+
| Main Content                  | Action Panel       |
|                               |                    |
| +---------------------------+ | +----------------+ |
| | Ticket Header             | | | Ticket Info    | |
| | (breadcrumb, id, title,   | | +----------------+ |
| |  meta info, status badge) | | | Triage Action  | |
| +---------------------------+ | | (assignee,     | |
| | Description               | | |  priority,     | |
| +---------------------------+ | |  submit btn)   | |
| | Activity Timeline         | | +----------------+ |
| | (chronological events     | | | Escalate       | |
| |  with status icons)       | | | (reason,       | |
| +---------------------------+ | |  submit btn)   | |
|                               | +----------------+ |
+-------------------------------+--------------------+
```

- Left column: surface, shadow-md, radius-xl
- Right column: position sticky, top 24px
- Gap: 24px

### Action Buttons

- Primary (Triage): accent-blue bg, white text, 44px height, full width
- Secondary (Escalate): white bg, separator-strong border
- Loading: spinner + "Processing..." text
- Active: scale(0.98) + opacity 0.9

---

## 6. Create Ticket Form

- Max width: 640px, centered
- Container: surface, shadow-md, radius-xl, padding 40px
- Field gap: 24px

### Priority Selector (Visual Radio Cards)

```
+----------+ +----------+ +----------+ +----------+
|   Low    | |  Medium  | |   High   | | Critical |
| (green)  | | (yellow) | | (orange) | |  (red)   |
+----------+ +----------+ +----------+ +----------+
```

- Each card: 64x72px, radius-md, border 1px
- Selected: border = priority color, bg = priority color @ 6% opacity, checkmark

### Form Fields

- Label: footnote, weight 600, secondary color
- Input: 44px height, radius-sm, border separator-strong
- Focus: accent-blue border + `box-shadow: 0 0 0 3px rgba(0,122,255,0.12)`
- Error: critical border + red glow + message in caption-1

---

## 7. AI Assistant Panel

### Slide-in Side Sheet

- Width: 400px desktop / fullscreen mobile
- Background: surface-glass + backdrop-filter: blur(20px)
- Left border: 1px solid separator
- Animation: translateX(100%) to translateX(0), 360ms decelerate

### Chat Messages

**User bubble (right-aligned):**
- bg: accent-blue, text: white
- radius: 18px 18px 4px 18px
- max-width: 80%

**AI bubble (left-aligned):**
- bg: rgba(0,0,0,0.05)
- radius: 18px 18px 18px 4px
- max-width: 85%
- AI avatar icon (24px) on left

### Typing Indicator
- 3-dot bounce animation (1.2s infinite, 0.2s stagger)

### Input Area (fixed footer)
- TextArea: auto-grow, min 44px / max 120px
- Send button: 40x40px, accent-blue, radius-full
- Enter = send, Shift+Enter = newline

### Context Chip (Ticket Link)
- When opened from ticket detail: shows "Asking about TKT-0042"
- Pill chip: accent-blue-light bg, accent-blue text, dismissible

### Suggested Prompts (empty state)
- 3-4 prompt cards: border separator, radius-lg, hover accent-blue border
- Examples: "Suggest triage for this ticket", "Analyze SLA breach risk", "Find similar tickets"

---

## 8. Modal & Overlay

### Confirmation Dialog
- Overlay: rgba(0,0,0,0.40) + backdrop-filter: blur(4px)
- Dialog: 400px, surface, shadow-xl, radius-xl, padding 32px
- Animation: scale(0.96) opacity(0) to normal, 240ms spring easing

### Toast Notifications
- Position: bottom-right (32px inset)
- Width: 360px, surface, shadow-lg, radius-lg
- Left border: 4px semantic color
- Auto-dismiss: 4s (success), manual (error)

---

## 9. Responsive Breakpoints

| Breakpoint | Width     | Sidebar        | Stats Grid | Ticket List  |
|------------|-----------|----------------|------------|--------------|
| Desktop    | > 1024px  | 240px sidebar  | 4 columns  | Full table   |
| Tablet     | 768-1024  | Collapsed icon | 2x2 grid   | Reduced cols |
| Mobile     | < 768px   | Bottom tab bar | 1 column   | Card list    |

### Mobile Adaptations
- Sidebar becomes 83px bottom tab bar (with safe-area inset)
- Ticket detail: single column, action panel = sticky footer or bottom sheet
- AI Assistant: fullscreen modal
- All tap targets: minimum 44x44px
- Swipe gestures: left-swipe for quick actions, right-swipe to close panels

---

## 10. Accessibility (WCAG 2.1 AA)

- Color contrast: primary text 17.5:1, secondary text 5.4:1
- Keyboard navigation: tab order matches visual order
- Focus ring: 3px solid accent-blue, offset 2px
- ARIA labels on icon-only buttons
- SLA timer: `aria-live="polite"` for updates
- Modal: focus trap implemented
- Loading states: `aria-busy="true"`

---

## 11. Component Hierarchy

```
AppShell
+-- Sidebar
|   +-- Logo
|   +-- NavItem (x N)
|   +-- UserProfile
+-- TopBar
|   +-- Breadcrumb
|   +-- ActionBar (search, notifications, AI-toggle)
+-- PageContent
    +-- DashboardPage
    |   +-- StatsCard (x 4)
    |   +-- SLAStatusPanel
    |   +-- PriorityDonutChart
    |   +-- RecentActivityFeed
    +-- TicketListPage
    |   +-- FilterBar
    |   |   +-- SearchInput
    |   |   +-- PillFilter (x N)
    |   +-- TicketsTable
    |   |   +-- TableHeader
    |   |   +-- TicketRow (x N)
    |   |       +-- PriorityDot
    |   |       +-- StatusBadge
    |   |       +-- SLATimer
    |   +-- EmptyState
    +-- TicketDetailPage
    |   +-- TicketHeader
    |   +-- TicketDescription
    |   +-- ActivityTimeline
    |   +-- ActionSidebar
    |       +-- TriageCard
    |       +-- EscalateCard
    +-- CreateTicketPage
    |   +-- TicketForm
    |       +-- FormField (x N)
    |       +-- PrioritySelector
    |       +-- SubmitButton
    +-- AIAssistantPanel (Portal)
        +-- ChatHeader
        +-- MessageList
        |   +-- MessageBubble (x N)
        +-- TypingIndicator
        +-- SuggestedPrompts
        +-- ChatInput

Shared Components:
+-- Button (primary / secondary / ghost / danger)
+-- Input / Textarea / Select
+-- Modal
+-- Toast
+-- SkeletonLoader
+-- Avatar
+-- Spinner
```

---

## 12. Implementation Phases

### Phase 1: Core (Must-have)
1. Design system (CSS variables, base components)
2. AppShell (Sidebar + TopBar)
3. TicketListPage (table + filters)
4. CreateTicketPage (form)

### Phase 2: Feature Complete
5. DashboardPage (stats + SLA)
6. TicketDetailPage (header + actions)
7. AIAssistantPanel (chat UI)

### Phase 3: Polish
8. Full animation implementation
9. Dark mode support
10. Mobile responsive completion
11. Accessibility audit + fixes
12. Core Web Vitals optimization
