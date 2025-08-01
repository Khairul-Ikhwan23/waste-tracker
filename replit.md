# Kitar360 Smart Waste Tracker

## Overview

This is a modern web application for smart waste management specifically designed for Brunei, built as a React-based dashboard with Express.js backend. The system provides a clean, responsive interface for tracking waste collection, recycling metrics, and environmental impact data using a green-themed design palette. The application includes Brunei-specific locations, districts, and localized features for managing waste collection across Brunei-Muara, Belait, Tutong, and Temburong.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server components:

- **Frontend**: React 18 with TypeScript, using Vite for build tooling
- **Backend**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side navigation

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui provides pre-built, accessible components
- **Styling**: Tailwind CSS with custom green color palette for environmental theme
- **Charts**: Recharts for data visualization (waste type breakdown, statistics)
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation
- **TypeScript**: Full type safety across the application

### Backend Architecture
- **API Structure**: RESTful endpoints with `/api` prefix
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with Vite integration in development mode

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Migrations**: Drizzle migrations stored in `/migrations` directory
- **Schema Validation**: Zod integration for runtime type checking

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and interact with database
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response**: JSON responses returned to client with proper error handling
5. **UI Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **recharts**: Chart library for data visualization
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe variant API for components

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both client and server with hot reload
- **Database Setup**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript across the project

### Production
- **Build Process**: `npm run build` compiles both client and server
- **Static Assets**: Client builds to `/dist/public` for serving
- **Server Bundle**: Server compiles to `/dist/index.js` with ESM format
- **Environment**: Requires `DATABASE_URL` environment variable

### Architecture Decisions

**Problem**: Need for rapid UI development with consistent design
**Solution**: shadcn/ui component library with Tailwind CSS
**Rationale**: Provides pre-built, accessible components that can be customized while maintaining design consistency

**Problem**: Type safety across full-stack application
**Solution**: TypeScript with shared schema definitions
**Rationale**: Reduces runtime errors and improves developer experience with IntelliSense

**Problem**: Database management and migrations
**Solution**: Drizzle ORM with PostgreSQL
**Rationale**: Type-safe database operations with excellent TypeScript integration and migration support

**Problem**: State management for server data
**Solution**: TanStack Query
**Rationale**: Handles caching, background updates, and error states automatically

## Changelogs

- July 08, 2025: Enhanced dashboard with Brunei-specific features and user role system
  - Added Pickup Requests page with form validation and Brunei locations
  - Created Route Planner for optimizing waste collection routes
  - Built Recycling Metrics dashboard with performance tracking
  - Implemented Environmental Reports with carbon impact calculations
  - Added notifications system with real-time alerts
  - Integrated Brunei districts and locations data
  - Updated navigation with new functional pages
  - Implemented comprehensive user role management system
  - Added role switcher component for switching between Household, Business, Waste Operator, and Admin roles
  - Created user-centric pages: User Profile, Settings, Pickup History, and EcoRewards
  - Added mobile-optimized CSS classes for better accessibility
  - Integrated UserContext for state management across roles

- July 20, 2025: Mobile responsiveness and functional improvements
  - Implemented Payments functionality with complete frontend page, backend API routes, and dummy transaction data
  - Added Kitar360 logo integration in sidebar header and created splash screen with 1-second slide-up animation
  - Fixed critical mobile responsiveness issues including horizontal scroll, header overflow, and container width constraints
  - Updated role permissions to include payment access for all user types
  - Made quick actions functional with proper navigation and role-based access
  - Removed "View Reports" button from household user interface per user requirements
  - Added role-specific quick actions (Route Planner for operators, Analytics for admins)
  - Enhanced mobile header layout with proper button sizing and text truncation
  - Implemented comprehensive CSS rules to prevent viewport overflow on mobile devices

- July 31, 2025: EcoMap Implementation
  - Created comprehensive EcoMap page with interactive map centered on Brunei Darussalam
  - Implemented Leaflet-based mapping system with custom markers for different facility categories
  - Added authentic Brunei location data including recycling centers, drop-off points, and collection facilities
  - Created modular map controls with category filtering and proximity radius adjustments
  - Implemented user location detection with geolocation API integration
  - Added responsive design with mobile-optimized map controls and popups
  - Built LocationPopup component with facility details, contact info, and directions
  - Structured codebase for easy API integration with separate data and UI modules
  - Added EcoMap to navigation sidebar and role permissions for all user types
  - Fixed hamburger button consistency across all mobile pages for unified navigation

## User Preferences

Preferred communication style: Simple, everyday language.