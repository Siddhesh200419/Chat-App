# Chatty — Real‑Time MERN Chat App

Chatty is a full‑stack messaging platform that combines an Express/Socket.IO backend with a React + Vite frontend. It supports secure authentication, profile customization with Cloudinary-hosted avatars, one‑to‑one messaging (text + images), online presence indicators, rich theming via DaisyUI, and instant updates delivered over WebSockets.

## Feature Highlights
- **Account management**: email/password signup, login, logout, auth guard, and JWT stored as HTTP-only cookies.
- **Profile editing**: upload avatars directly from the browser; images are stored via Cloudinary.
- **Realtime chat**: Socket.IO keeps conversations, delivery status, and online user badges in sync.
- **Media messaging**: drag/drop or select an image to send alongside text in any conversation.
- **Dynamic themes**: 30+ DaisyUI themes plus per-user persistence in `localStorage`.
- **Responsive UI/UX**: mobile-friendly layouts, skeleton loaders, toast notifications, and keyboard-friendly forms.

## Tech Stack
| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, TailwindCSS v4 + DaisyUI, Zustand, React Router, Axios, Lucide icons, React Hot Toast |
| Backend | Node.js, Express, Socket.IO, MongoDB (Mongoose), JWT, bcrypt, Cloudinary SDK, CORS, cookie-parser |
| Tooling | Nodemon, ESLint, npm |

## Project Structure
```
Chat-App/
├── BackEnd/           # Express + Socket.IO API
│   ├── src/
│   │   ├── controllers/    # auth + message logic
│   │   ├── lib/            # db, socket, cloudinary, jwt helpers
│   │   ├── middlewares/    # auth guard
│   │   ├── models/         # User & Message schemas
│   │   ├── routes/         # REST routes
│   │   └── seeds/          # Mongo seed script
├── FrontEnd/         # React client
│   ├── src/
│   │   ├── components/     # chat UI, navbar, skeleton loaders
│   │   ├── pages/          # auth, settings, profile, home
│   │   ├── store/          # Zustand stores (auth/chat/theme)
│   │   └── lib/constants   # axios instance, util helpers
├── package.json      # workspace-level helper scripts
└── README.md
```

## Environment Variables

Create `.env` files in the project root(s) before running the servers.

### `BackEnd/.env`
```
PORT=5000
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster/.../chatty
JWT_SECRET=super-secret-string
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
FRONTEND_URL=http://localhost:5173,http://localhost:4173
NODE_ENV=development
```

### `FrontEnd/.env` (optional)
```
VITE_API_URL=http://localhost:5000/api   # only needed if you want a custom base URL
```
> The frontend defaults to `http://localhost:5000/api` in development and `/api` in production, so you can often skip this file.

## Getting Started

### 1. Install dependencies
```bash
npm install                 # installs root deps (none) + prepares lockfiles
npm install --prefix BackEnd
npm install --prefix FrontEnd
```

### 2. Seed sample users (optional)
```bash
node BackEnd/src/seeds/user.seed.js
```
This script populates MongoDB with curated demo accounts (eight female, seven male) using the `randomuser.me` avatars.

### 3. Run the app locally
In two separate terminals:
```bash
# Terminal 1 – backend API + socket server
npm run dev --prefix BackEnd

# Terminal 2 – Vite dev server
npm run dev --prefix FrontEnd
```
Visit `http://localhost:5173`. The frontend proxies API calls/images to `http://localhost:5000/api` and opens a Socket.IO connection at `http://localhost:5000`.

Alternatively, use the root helper scripts:
```bash
npm run dev     # launches only the frontend dev server (edit package if you want both)
npm run start   # production-style: runs BackEnd/src/index.js
npm run build   # installs both apps and builds the frontend into FrontEnd/dist
```

### 4. Production build
```bash
npm run build                 # builds FrontEnd/dist
npm run start --prefix BackEnd
```
`BackEnd/src/index.js` serves the built frontend when `NODE_ENV=production`, so deploy the backend folder (with `FrontEnd/dist`) to any Node-friendly host (Railway, Render, etc.).

## API Overview

### Auth Routes (`/api/auth`)
- `POST /signup` — create user, hash password, auto-login via JWT cookie.
- `POST /login` — authenticate user credentials, returns profile data + cookie.
- `POST /logout` — clears the JWT cookie.
- `PUT /update-profile` — requires auth; uploads `profilePic` base64 to Cloudinary and saves URL.
- `GET /check` — returns the logged-in user's profile, used for silent auth refresh.

### Message Routes (`/api/messages`)
- `GET /users` — returns all other users (except the requester) for the sidebar roster.
- `GET /:id` — fetch chat history between the requester and `:id`.
- `POST /send/:id` — persist text/image messages, emit `"newMessage"` to the recipient's socket, and respond with the saved message.

### Socket Events
- **Client → Server**: implicit `connection` with `query.userId` to register presence.
- **Server → Client**:
  - `getOnlineUsers` — broadcast array of active user IDs (used for sidebar presence + counts).
  - `newMessage` — delivered to the receiver when a new message is stored.

## Frontend State Flows
- `useAuthStore`: handles auth lifecycle, JWT-backed axios instance, socket lifecycle, and toast messaging.
- `useChatStore`: loads contacts/messages, streams new messages via sockets, manages the active conversation.
- `useThemeStore`: persists DaisyUI theme keys to `localStorage` and syncs `data-theme`.

## Troubleshooting
- **CORS errors**: ensure `FRONTEND_URL` includes every origin (comma-separated) hitting the backend.
- **Socket not connecting**: confirm the frontend points to the same host/port defined in `BASE_URL` (`useAuthStore`).
- **Images not uploading**: verify Cloudinary credentials and that the payload being sent from `MessageInput`/`ProfilePage` is a base64 string.
- **Stuck on loading spinner**: backend `/api/auth/check` must be reachable and return a user. Inspect network tab and server logs.

## Next Steps & Ideas
- Group chats or channels.
- Message read receipts & typing indicators.
- Push notifications (Web Push / FCM).
- Advanced search or media gallery.

Enjoy building with Chatty! Contributions and custom deployments are welcome—feel free to fork and tailor features to your needs.
