# Streamflix - Netflix-Style Local Movie Streaming App

## Overview

Streamflix is a personal movie streaming application that provides a Netflix-inspired interface for browsing and playing local video files. The application features multi-profile support with kids mode, AI-powered movie metadata extraction, content filtering by age ratings and genres, and an immersive video playback experience. Built as a full-stack TypeScript application, it combines a React frontend with an Express backend, utilizing in-memory storage for profile and movie data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR (Hot Module Replacement)
- Client-side routing handled through view state management rather than a traditional router

**UI Component Library**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, menus, etc.)
- shadcn/ui design system with "new-york" style variant
- Tailwind CSS for utility-first styling with custom Netflix-inspired dark theme
- CSS variables for themeable color system

**State Management**
- React Context API for global profile state (`ProfileContext`)
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks

**Key UI Patterns**
- Profile selection screen with avatar-based user switching
- Hero section with featured movie and gradient overlays
- Horizontal scrolling movie rows grouped by categories
- Modal-based movie details with play/info actions
- Full-screen video player with custom controls
- Kids mode with visual differentiation (colorful gradients, larger touch targets)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Separate development and production entry points (`index-dev.ts`, `index-prod.ts`)
- Development mode integrates Vite middleware for SSR-like experience

**Data Layer**
- In-memory storage implementation (`MemStorage` class) for profiles and movies
- Interface-based storage abstraction (`IStorage`) allowing future database integration
- Drizzle ORM configured for PostgreSQL (schema defined but not yet connected)
- Session management using `connect-pg-simple` for PostgreSQL session store

**API Structure**
- RESTful endpoints for profiles (`/api/profiles`, `/api/profiles/:id`)
- Movie management endpoints (`/api/movies`, `/api/movies/:id`, `/api/movies/scan`)
- File system scanning for video files in `/movies` directory
- Video streaming endpoint for playback (`/api/stream/:id`)

**AI Integration**
- Google Gemini AI (gemini-2.5-flash model) for movie metadata extraction
- Intelligent parsing of movie filenames to extract title, year, genre
- Automated age rating determination and content warnings
- JSON-structured responses using schema validation

### Content Management

**Movie Scanning & Metadata**
- File system traversal of designated movies directory
- Support for common video formats: mp4, mkv, avi, mov, wmv, flv, webm, m4v
- AI-powered metadata extraction from filenames
- Automatic age rating classification (G, PG, PG-13, R, NC-17, Unrated)
- Genre categorization and content warning detection

**Content Filtering**
- Age-appropriate filtering based on profile settings
- Kids mode restricts to G and PG rated content only
- Filter by age rating and genre
- Search functionality across title and genres

### External Dependencies

**Third-Party Services**
- Google Gemini AI API for metadata extraction (requires `GEMINI_API_KEY`)
- Neon Database (PostgreSQL) configured but not actively used (requires `DATABASE_URL`)

**Key Libraries**
- `@tanstack/react-query` - Server state management and caching
- `drizzle-orm` & `drizzle-zod` - Database ORM with Zod schema validation
- `@neondatabase/serverless` - PostgreSQL driver for Neon
- `express` - Web server framework
- `zod` - Schema validation for type-safe data structures
- `nanoid` - Unique ID generation
- `date-fns` - Date manipulation utilities

**UI Dependencies**
- Multiple `@radix-ui/*` packages for accessible component primitives
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` & `clsx` - Conditional class name utilities
- `lucide-react` - Icon library

### Design System

**Typography**
- Primary font: Inter (Google Fonts)
- Font hierarchy: text-xs to text-6xl with semantic weights
- Netflix-inspired visual language

**Color System**
- Dark-first design with CSS custom properties
- Neutral base colors (background: 0 0% 5%)
- Red primary accent (0 72% 51%)
- HSL color format for easy theme variations

**Responsive Design**
- Mobile-first breakpoints (md: 768px, lg: 1024px, xl: 1280px)
- Grid layouts: 2-6 columns for movie grids
- Horizontal scrolling for movie rows
- Touch-optimized for kids mode

### Session & Authentication

**Session Management**
- PostgreSQL-backed sessions via `connect-pg-simple`
- Profile selection acts as lightweight user context switching
- No traditional authentication system currently implemented

### File Organization

**Directory Structure**
```
/client - React frontend
  /src
    /components - Reusable UI components
    /pages - Top-level view components
    /lib - Utilities and context providers
    /hooks - Custom React hooks
/server - Express backend
/shared - Shared TypeScript schemas and types
/movies - Local movie file storage directory
```

**Path Aliases**
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`