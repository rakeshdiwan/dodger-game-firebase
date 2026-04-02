# Emoji Dodge

Mobile-first arcade web game where players dodge falling emojis, preserve lives, and compete on a leaderboard.

## Tech Stack

- Frontend: React + Vite + TypeScript, Zustand, Tailwind CSS, Framer Motion, Howler.js
- Backend: Node.js, Express, TypeScript
- Database: Firebase Firestore (via Firebase Admin SDK)
- DevOps: Docker, Docker Compose, Nginx (frontend static serving)

## Project Structure

```text
/emoji-dodge
  /frontend
  /backend
  docker-compose.yml
  README.md
```

## Features (MVP)

- Name-based login (unique player name, no password)
- Landing page with quick navigation and best score
- Core dodge gameplay:
  - 5 lives
  - emoji spawn and increasing speed
  - score over time
  - 3-second countdown
- Game over card with restart/home actions and high-score indicator
- Leaderboard (top players by highest score)
- Score history per user (score, duration, date)
- Sound toggle and hit/game-over feedback hooks

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as reference:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

Notes:
- Keep `FIREBASE_PRIVATE_KEY` wrapped in quotes.
- Preserve `\n` sequences; backend converts them to real newlines.

### Frontend (`frontend/.env`)

Use `frontend/.env.example` as reference:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Local Setup

1. Create Firebase project and Firestore database.
2. Generate a Firebase service account key and map values to `backend/.env`.
3. Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

4. Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

5. Open `http://localhost:5173`.

## Docker Setup

From project root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

To stop:

```bash
docker compose down
```

## API Documentation

### Auth

- `POST /api/users/login`
  - body: `{ "name": "playerOne" }`
  - behavior: finds existing user or creates a new one
- `POST /api/users/logout`
  - body: `{ "userId": "..." }`

### Game

- `POST /api/game/start`
  - body: `{ "userId": "..." }`
  - returns transient session metadata
- `POST /api/game/end`
  - body: `{ "userId": "...", "score": 120, "duration": 42.4 }`
  - persists session and updates highest score

### Scores

- `GET /api/scores/history/:userId`
- `GET /api/scores/highest/:userId`
- `GET /api/scores/leaderboard`

### Health

- `GET /api/health`

## Game Rules

- Move player by mouse/touch drag in the bottom safe zone
- Avoid falling emojis from the top zone
- Hit by emoji => lose 1 life
- Start with 5 lives
- Speed ramps up gradually
- Score increases by survival time
- Game ends at 0 lives

## Scripts

### Backend

- `npm run dev` - start in watch mode
- `npm run build` - compile TypeScript
- `npm run start` - run compiled output
- `npm run typecheck` - type check only

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production bundle

## Troubleshooting

- CORS errors: ensure `CORS_ORIGIN` matches frontend URL.
- Firebase init errors: verify project id, client email, and private key formatting.
- Empty leaderboard: play at least one game and submit via game end.

## Future Enhancements

- Difficulty levels (easy/normal/hard)
- Power-ups (shield, slow motion)
- Pause/resume with keyboard and mobile controls
- JWT session token flow
- PWA support and offline-ready shell
- Real audio asset pack replacing placeholder beeps
