# 🎮 Victor's Anime Trivia Game

This is a full-stack local trivia web game that runs across mobile and desktop. Built with:

- ✅ **Vapor (Swift)** for the backend server
- ✅ **Next.js + Shadcn UI** for the frontend
- ✅ **SQLite** for local persistence
- ✅ **Local IP** networking so all players can join on the same Wi-Fi

---

## 🧠 What It Is

A personalized trivia quiz experience where:

- The **host** (Victor) starts the game after all players join.
- **Players** register with a name and answer 20 curated anime/personality questions.
- Everyone must answer each question **in sync**—no skipping ahead.
- Scores are calculated and shown on a **live leaderboard**.
- Entire game runs locally and can be tested from multiple devices.

---

## 📁 Structure

```
trivia-project/
├── server/            # Vapor backend with REST API + Seeder
├── website/           # Next.js frontend client
└── README.md          # You're reading it now
```

---

## ⚙️ Prerequisites

- Swift + Vapor toolchain
- Node.js + npm
- Devices connected to the same network
- Local IP address (e.g., `http://192.168.0.12:8080`)

---

## 🚀 How to Run

1. `cd server` → follow instructions in `server/README.md` to start the backend
2. `cd website` → follow instructions in `website/README.md` to start the frontend
3. Visit your frontend URL on your **iPad, iPhone, or laptop** browser

---

## 🔑 How It Works

### 👤 Host:

- Goes to `/host`
- Enters password `"helloworld"`
- Starts the game → game state becomes `started: true`

### 🙋 Players:

- Go to home page `/`
- Enter their name to register
- Must wait for host to start
- Progress together through each question

---

## 🔌 Backend APIs

| Method | Endpoint                        | Description                            |
|--------|----------------------------------|----------------------------------------|
| POST   | `/trivia/register`              | Register a player                      |
| GET    | `/trivia/questions`             | Get all trivia questions               |
| POST   | `/trivia/answer`                | Submit an answer                       |
| GET    | `/trivia/player/:id`           | Get one player by ID                   |
| GET    | `/trivia/players`              | Get all players (leaderboard)          |
| GET    | `/trivia/players/active`       | Get players who haven't finished       |
| GET    | `/trivia/players/finished`     | Check if all players are done          |
| GET    | `/trivia/game-state`           | Check if host started the game         |
| POST   | `/trivia/start`                | Host starts the game                   |
| GET    | `/trivia/waiting/:questionID`  | Get players who haven't answered yet   |
| POST   | `/trivia/seed`                 | Seeds the 20 questions (auto-run)      |

---

## 🌐 Sites & Tools Used

- [https://shadcn.dev/](https://shadcn.dev/)
- [https://nextjs.org](https://nextjs.org)
- [https://vapor.codes](https://vapor.codes)

---

## 🎯 Game Rules

- 20 questions
- 5 points per correct answer
- Players must progress together
- Host does not play
- All results shown only after everyone finishes

---

## 📱 Phone Friendly?

Yes! The UI is responsive using TailwindCSS and Shadcn. You can join from:

- iPad
- iPhone
- Android
- Laptop

---

Enjoy hosting your own anime trivia party, Victor!
