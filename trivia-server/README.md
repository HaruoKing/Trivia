# 📘 Trivia Server (Vapor)

This is the backend server for the multiplayer trivia game, built using [Vapor](https://vapor.codes/) and Swift.

## 📦 What It Does

The server:
- Stores all trivia questions in a SQLite database.
- Handles player registration and tracks their score.
- Accepts player answers, checks correctness, and updates scores.
- Tracks when all players finish all questions.
- Supports real-time game state sync with the frontend.
- Exposes API endpoints consumed by the Next.js frontend.

## 🚀 Getting Started

### 📋 Requirements

- Swift 5.9+
- Vapor Toolbox
- SQLite (auto-managed by Vapor)
- macOS with Xcode 15+ installed

### 🧪 Running the Server

```bash
cd trivia-server
swift run TriviaServer serve --hostname 0.0.0.0 --port 8080
```

The server starts on `http://localhost:8080`.

### 🌐 Public Endpoint Notes
Make sure your server is accessible from devices on the same network (e.g., iPad/iPhone). Use `ifconfig` or `ipconfig getifaddr en0` to get your LAN IP.

## 🔌 API Routes

| Method | Route                         | Description                           |
|--------|-------------------------------|---------------------------------------|
| POST   | `/trivia/register`            | Register a player                     |
| GET    | `/trivia/questions`           | Get list of all questions             |
| POST   | `/trivia/answer`              | Submit an answer                      |
| GET    | `/trivia/player/:id`          | Get info for a specific player        |
| GET    | `/trivia/players`             | List all players                      |
| GET    | `/trivia/players/finished`    | Check if all players are done         |
| GET    | `/trivia/players/active`      | List all players still playing        |
| GET    | `/trivia/waiting/:questionID` | Get list of players still answering   |
| GET    | `/trivia/game-state`          | Check if the game has started         |
| POST   | `/trivia/start`               | Host starts the game (password: `helloworld`) |
| POST   | `/trivia/seed`                | Reseed sample questions               |

## 🧠 Game Flow

1. Players register via the website using a name.
2. The host goes to the `/host` page and starts the game with the admin password.
3. Players are redirected to the first question.
4. After each question, they wait until all players have submitted answers.
5. After 20 questions, scores are shown and sorted.

## ✅ Packages Used

- [Vapor](https://github.com/vapor/vapor)
- [Fluent](https://github.com/vapor/fluent)
- [SQLite driver](https://github.com/vapor/fluent-sqlite-driver)

---
