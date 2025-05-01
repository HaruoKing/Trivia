# 🎮 Victor's Anime Trivia Game

A fun, mobile-friendly, anime-themed trivia game built with a **Vapor backend** and a **Next.js + Shadcn UI frontend**. Designed for quick local network play with score tracking and personal trivia questions!

---

## ✨ Features

- 🎭 20-question trivia game featuring Victor’s favorite topics (anime, programming, music, etc.)
- 🧠 +5 points for each correct answer
- 📱 Responsive, mobile-first UI using Shadcn components
- ☁️ Lightweight API built with Vapor (Swift) to handle:
  - Player registration
  - Question delivery
  - Answer validation & score tracking
- 📡 Optimized for **same Wi-Fi network** play — just scan a QR code and go!

---

## 🧩 Tech Stack

| Layer     | Technology       |
|-----------|------------------|
| Backend   | [Vapor (Swift)](https://vapor.codes) |
| Frontend  | [Next.js (App Router)](https://nextjs.org) |
| UI Kit    | [Shadcn UI](https://ui.shadcn.com) |
| Styling   | Tailwind CSS     |
| Database  | SQLite (Local) or PostgreSQL (Optional) |

---

## 🚀 Setup Instructions

### 🔧 Prerequisites

- [Swift](https://www.swift.org/download/)
- [Vapor Toolbox](https://docs.vapor.codes/install/macos/)
- [Node.js & npm](https://nodejs.org/)
- [pnpm](https://pnpm.io/) or `npm`, `yarn`
- [Vercel CLI](https://vercel.com/docs/cli) *(for deployment)*

---

### ⚙️ 1. Backend (Vapor)

```bash
git clone https://github.com/your-username/anime-trivia-game.git
cd anime-trivia-game/server
swift build
vapor run migrate
vapor run serve --hostname 0.0.0.0
```

> 🔗 The backend will be accessible via `http://<your-local-ip>:8080/`

---

### ⚙️ 2. Frontend (Next.js + Shadcn UI)

```bash
cd anime-trivia-game/web
pnpm install        # or npm install / yarn
pnpm dev            # or npm run dev / yarn dev
```

> Access the app at `http://localhost:3000`

---

## 🔄 API Overview

### `POST /trivia/register`
Registers a new player.

```json
{
  "username": "sugoi_player"
}
```

---

### `GET /trivia/questions`
Fetches all questions with options.

---

### `POST /trivia/answer`
Submits an answer to a question.

```json
{
  "playerID": "<uuid>",
  "questionID": "<uuid>",
  "answer": "Tell Your World"
}
```

Returns: `200 OK` on success

---

## 📱 Network Setup for Mobile Play

1. Connect all phones and laptops to the **same Wi-Fi**.
2. Use `http://<your-local-ip>:3000` to access the web app on mobile.
3. Scan a QR code that points to this address (use any QR generator).

---

## 💡 Ideas for Enhancements

- Show leaderboard with top scorers
- Add time-based scoring bonuses
- Integrate Hatsune Miku audio or animations
- Use WebSocket for real-time updates

---

## 🧠 Author

**Victor Rodriguez**  
Full-stack dev & anime enjoyer  
📧 jbts1124@gmail.com  
🎮 Twitch: [@akumetsuv](https://www.twitch.tv/akumetsuv)

---

## 📜 License

MIT License — free to use, remix, and deploy!
