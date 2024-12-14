# B2D Venture

# Installation Guide

## Prerequisites

- Node.js 18+ 
- pnpm 9.7.0+
- PostgreSQL 15+
- Clerk account
- Resend account (for emails)

## Environment Setup

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```
2. Install dependencies
```bash
pnpm install
```
3. config a `.env.sample` file in the root directory.
4. Initialize the database
```bash
pnpm db:push
```

## Development

Start the development server:
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`

## Testing

Run Playwright tests:
```bash
pnpm playwright test
```

## Project Structure

- `/src` - Application source code
  - `/app` - Next.js app router pages and layouts
  - `/components` - React components
  - `/server` - Server-side code and API routes
  - `/utils` - Utility functions and helpers
- `/tests` - Playwright test files
- `/public` - Static assets

## Logging

Logs are stored in the `/logger` directory in development mode:
- `combined.log` - All logs
- `error.log` - Error logs only

Make sure to add `/logger` to your `.gitignore

## Project Functionality

[Visit Wiki](https://github.com/ReggieReo/b2d-ventures/wiki)

## Team Member
Kollawat Rupanya 6310545221 <br>
Sittanat Palakawong Na Ayudthaya 6310545400 <br>
Nanthawat Duang-ead 6510545551 <br>
Setthapon Thadisakun 6510545764 <br>
Phumrapee Chaowanapricha 6510545683 <br>