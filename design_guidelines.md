# Design Guidelines: Netflix-Style Local Movie Streaming App

## Design Approach
**Reference-Based**: Primary inspiration from Netflix's interface patterns, with emphasis on content discovery, profile management, and immersive viewing experience.

## Core Design Principles
1. **Content-First**: Movie posters and visual content dominate the interface
2. **Seamless Navigation**: Effortless transitions between browsing, profile switching, and playback
3. **Age-Appropriate Safety**: Clear visual distinction between kids and adult content areas

---

## Typography System

**Font Families**: 
- Primary: Inter or Netflix Sans alternative via Google Fonts
- Fallback: System sans-serif stack

**Hierarchy**:
- Hero/Profile Headers: text-4xl to text-6xl, font-bold
- Section Titles: text-2xl to text-3xl, font-semibold
- Movie Titles: text-base to text-lg, font-medium
- Body/Metadata: text-sm, font-normal
- Microcopy: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm (p-4, gap-8, mb-12, etc.)

**Grid Structures**:
- Profile Selection: 2-4 profile cards centered (grid-cols-2 lg:grid-cols-4)
- Movie Grids: 2-6 columns responsive (grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6)
- Kids Section: Larger tiles, 2-4 columns max for easier navigation

**Container Strategy**:
- Full-bleed background imagery
- Content max-width: max-w-7xl with px-6 lg:px-8
- Horizontal scrolling rows for movie categories

---

## Component Library

### 1. Profile Management
**Profile Selection Screen**:
- Centered layout with large profile avatars (w-32 h-32 to w-40 h-40)
- Add Profile button with dashed border treatment
- "Who's watching?" header at top center
- Manage Profiles link at bottom

**Profile Cards**:
- Square avatar containers with rounded corners (rounded-xl)
- Name label below avatar (text-lg)
- Kids profiles: distinct visual indicator (badge/icon)
- Hover: subtle scale transform (scale-105)

### 2. Navigation Header
**Fixed Top Bar**:
- Logo left (h-8 to h-10)
- Main navigation: Browse, Kids, My List (horizontal flex, gap-6)
- Right utilities: Search icon, Profile avatar with dropdown
- Semi-transparent background with backdrop blur
- Minimal height: h-16 to h-20

### 3. Movie Discovery Interface

**Hero Section** (Top of Browse/Home):
- Full-width featured movie banner (h-screen lg:h-[70vh])
- Large movie poster/backdrop as background with gradient overlay
- Content positioned left or center-left (max-w-xl to max-w-2xl)
- Title: text-4xl to text-6xl, font-bold
- Metadata row: Age rating badge, year, duration (flex gap-3, text-sm)
- Description: max 3 lines with truncation (line-clamp-3)
- Primary CTA buttons: Play (prominent) and More Info (secondary) with backdrop-blur-md bg-white/20
- Buttons: px-8 py-3, rounded-md, gap-4

**Category Rows**:
- Section title with subtle bottom margin (text-xl font-semibold mb-4)
- Horizontal scrolling grid (overflow-x-auto, snap-x)
- Movie cards with 16:9 aspect ratio for posters
- Hover state: scale-110 transform with smooth transition
- Multiple rows stacked with spacing (space-y-12 to space-y-16)

**Movie Cards**:
- Poster image fills container (object-cover, rounded-md)
- Minimal metadata overlay on hover: title + rating badge
- Kids section: rounded-xl with playful styling

### 4. Video Player
**Full-Screen Layout**:
- 16:9 aspect ratio video container
- Custom controls overlay at bottom with gradient backdrop
- Control bar height: h-20, backdrop-blur
- Buttons arrangement: Play/Pause (left), 10s back/forward (inline), progress bar (flex-1), volume, fullscreen (right)
- Skip buttons: clearly labeled icons with tooltips
- Progress bar: full-width scrubber with hover preview
- Back to browse: top-left exit button (absolute positioning)

**Player Controls Spacing**:
- Icons: w-10 h-10 clickable area
- Button groups: gap-2 to gap-4
- Padding: px-6 py-4

### 5. Kids Section UI
**Visual Distinction**:
- Larger, more colorful UI elements
- Increased touch target sizes (buttons min h-12)
- Simplified navigation with fewer options
- Prominent "Exit Kids" button
- Rounded, friendly shapes (rounded-2xl)

### 6. Search & Filters
**Search Interface**:
- Expandable search bar in header (w-0 to w-64 transition)
- Filter chips for age ratings (flex-wrap gap-2, px-4 py-2 rounded-full)
- Results grid matching main movie grid

### 7. Movie Details Modal/Page
**Layout**:
- Large backdrop image at top (h-96)
- Content overlay with metadata grid
- Age rating badge prominent (px-3 py-1 rounded-md, text-sm font-semibold)
- Cast, genre, duration in organized rows (grid-cols-2 gap-4)
- Description: prose max-w-2xl

---

## Images

**Required Images**:
1. **Hero Section**: Featured movie backdrop (1920x1080 minimum) - use placeholder service initially
2. **Movie Posters**: 16:9 ratio thumbnails - extracted from video files or placeholder
3. **Profile Avatars**: Square icons/images (200x200) - use avatar placeholder service
4. **Kids Section Graphics**: Playful, colorful placeholder illustrations

**Image Treatment**:
- All images: rounded-md to rounded-xl
- Hero images: gradient overlay (from-black/80 to-transparent)
- Lazy loading for all poster images

---

## Responsive Breakpoints

- Mobile (base): Single column, vertical stacking
- Tablet (md: 768px): 2-3 movie columns, simplified header
- Desktop (lg: 1024px): 4-6 movie columns, full feature set
- Large (xl: 1280px): Optimal viewing, maximum columns

---

## Accessibility

- All interactive elements: min-h-11 touch targets
- Focus visible states on all controls (ring-2 ring-offset-2)
- ARIA labels for all icon buttons
- Keyboard navigation for video player (Space, Arrow keys)
- High contrast text on all backgrounds
- Skip to content links