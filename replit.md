# AI Chat Application

## Overview

This is a full-stack AI chat application built with a modern TypeScript stack. The application provides a conversational interface where users can interact with AI through chat conversations. It features user authentication via Replit Auth, persistent chat history, and an admin panel for user management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful endpoints under `/api` prefix
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Zod validation
- **Connection**: Neon serverless with WebSocket support
- **Schema Location**: Shared schema in `/shared/schema.ts`

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with `connect-pg-simple`
- **Middleware**: Custom authentication middleware for protected routes
- **User Management**: Admin panel for user oversight

### Chat System
- **Conversations**: Persistent chat history with title generation
- **Messages**: Support for user and AI message types
- **AI Integration**: OpenRouter API for AI responses using Claude 3.5 Sonnet
- **Real-time Updates**: Optimistic updates with React Query

### UI Components
- **Design System**: shadcn/ui with New York theme variant
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Accessibility**: ARIA-compliant components from Radix UI
- **Dark Mode**: CSS variable-based theming system

## Data Flow

1. **Authentication Flow**:
   - User initiates login via `/api/login`
   - Replit Auth handles OAuth flow
   - User data stored/updated in PostgreSQL
   - Session established with secure cookies

2. **Chat Flow**:
   - User creates new chat or selects existing
   - Messages sent to `/api/chats/:id/messages`
   - Server calls OpenRouter API for AI response
   - Both user and AI messages persisted to database
   - Client receives response and updates UI optimistically

3. **Admin Flow**:
   - Admin users access `/admin` route
   - User management operations via `/api/admin/*` endpoints
   - Role-based access control enforced server-side

## External Dependencies

### Core Dependencies
- **AI Service**: OpenRouter API for Claude 3.5 Sonnet responses
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service
- **UI Components**: Radix UI primitives and Lucide icons

### Development Tools
- **TypeScript**: Strict type checking with path mapping
- **ESBuild**: Production bundling for server code
- **Drizzle Kit**: Database migrations and schema management
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Drizzle push for schema synchronization
- **Environment**: Replit-optimized with cartographer plugin

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Assets**: Static file serving from build output
- **Process**: Single Node.js process serving both API and static files

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENROUTER_API_KEY`: API key for AI service
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OAuth issuer URL (defaults to Replit)

### File Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript definitions
├── migrations/      # Database migration files
├── dist/           # Production build output
└── *.config.ts     # Configuration files
```

The application follows a monorepo structure with clear separation between client, server, and shared code, enabling efficient development and deployment on the Replit platform.