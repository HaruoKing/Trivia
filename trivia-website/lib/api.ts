// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const TriviaAPI = {
  register: `${API_BASE}/trivia/register`,
  questions: `${API_BASE}/trivia/questions`,
  answer: `${API_BASE}/trivia/answer`,
  player: (id: string) => `${API_BASE}/trivia/player/${id}`,
  allPlayers: `${API_BASE}/trivia/players`,
  startGame: `${API_BASE}/trivia/start`,
  gameState: `${API_BASE}/trivia/game-state`,
  finishedPlayers: `${API_BASE}/trivia/players/finished`,
  activePlayers: `${API_BASE}/trivia/players/active`,
  waiting: (questionID: string) => `${API_BASE}/trivia/waiting/${questionID}`,
  seed: `${API_BASE}/trivia/seed`,
};