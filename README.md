# Underworld Rise

Underworld Rise is a cyberpunk-themed browser-based RPG game where players can fight, join clans, commit crimes, and rise through the ranks of the underworld.

## Project Structure

The project is organized as a monorepo with the following structure:

- **backend**: NestJS application handling the API, game logic, and database interactions.
- **frontend**: React + Vite application providing the user interface.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

1.  Clone the repository.
2.  Install dependencies for both backend and frontend.

    ```bash
    # Backend
    cd backend
    npm install

    # Frontend
    cd ../frontend
    npm install
    ```

### Running the Application

You need to run both the backend and frontend servers.

**Backend:**

```bash
cd backend
npm run start:dev
```

The backend API will be available at `http://localhost:3000`.

**Frontend:**

```bash
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## Features

- **Authentication**: Secure login and registration.
- **Character System**: Create and customize your character.
- **Combat System**: PvP fights with other players.
- **Clan System**: Join or create clans, manage members, and upgrade clan facilities.
- **Missions & Crimes**: Complete missions and commit crimes to earn XP and money.
- **Marketplace**: Buy and sell items.
- **Leaderboards**: Compete for the top spot.
- **Real-time Updates**: WebSocket integration for live notifications.

## Technologies

- **Backend**: NestJS, Prisma, SQLite (dev), TypeScript
- **Frontend**: React, Vite, TailwindCSS, TypeScript
