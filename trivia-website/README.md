# 🌐 Trivia Website (Next.js)

This is the frontend for the multiplayer trivia game. It uses [Next.js 14 App Router](https://nextjs.org) with [TailwindCSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) components.

## 🎮 What It Does

- Provides a mobile-friendly interface for players.
- Handles trivia answers, waiting rooms, and real-time syncing.
- Hosts can trigger the game start from the admin panel.
- Fully responsive design for phones and tablets.

## 🔧 Setup

### 📦 Install Dependencies

```bash
cd trivia-website
npm install
```

### 🌍 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://192.168.0.12:8080
```

Replace with your local LAN IP if testing across devices.

### 🧪 Start the Frontend

```bash
npm run dev
```

Access the site at `http://localhost:3000`.

## 🧠 Game Flow

1. Player joins from the homepage and enters their name.
2. They wait on a waiting screen until the host starts the game.
3. Host visits `/host`, enters password `helloworld`, and starts the game.
4. Players answer each question one by one.
5. After all 20 questions, scores are shown.

## 📁 Important Routes

| Route                              | Description                           |
|-----------------------------------|---------------------------------------|
| `/`                                | Join screen                           |
| `/host`                            | Start game screen (admin only)        |
| `/trivia/[id]`                     | Question view by index                |
| `/trivia/waiting-for-question/[id]`| Shows waiting screen per question     |
| `/trivia/result`                   | Final leaderboard                     |

## 🧩 Packages Used

- [Next.js](https://nextjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [sonner](https://sonner.emilkowal.dev) (toast notifications)

---
