# SG Arts & Culture - Singapore Arts Events Calendar

A web app that pulls together arts and cultural events in Singapore, allowing users to discover, book, and add events to their calendar. Event organisers can list and manage their events for free.

## Features

### For Event-Goers
- Browse and search arts & cultural events across Singapore
- Filter by category (Theatre, Music, Dance, Visual Arts, Film, Heritage, etc.)
- Book tickets with instant confirmation
- Download .ics calendar files to add events to any calendar app
- Personal calendar view showing all booked events

### For Event Organisers (Free)
- Register and create an organiser account
- Create, edit, and manage event listings
- Track bookings and capacity
- Publish, draft, or cancel events

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: SQLite via Prisma ORM 7 + better-sqlite3
- **Auth**: JWT-based authentication for organisers

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed sample data (16 Singapore arts events)
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse events.

## Demo Organiser Account

After seeding, you can log in as an organiser:
- **Email**: events@esplanade.com
- **Password**: demo123

## Project Structure

```
src/
  app/
    api/              # REST API routes
      events/         # Public event endpoints
      bookings/       # Booking creation & lookup
      calendar/       # .ics calendar file generation
      organizer/      # Organiser auth & event management
    events/[id]/      # Event detail page
    my-calendar/      # Personal booked events calendar
    organizer/        # Organiser dashboard, login, register
  components/         # Shared React components
  lib/                # Database, auth, utilities
prisma/
  schema.prisma       # Database schema
  seed.ts             # Sample data seeder
```
