'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TriviaAPI } from '@/lib/api';

type Player = {
  id: string;
  username: string;
  score: number;
};

export default function ResultPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  
  useEffect(() => {
    const loadPlayers = async () => {
      const res = await fetch(TriviaAPI.allPlayers);
      const data = await res.json();
      setPlayers(data);
    };
    
    loadPlayers();
  }, []);
  
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black/60 backdrop-blur">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🏆 Final Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {players.map((p, index) => (
              <li key={p.id} className="text-lg">
                <strong>#{index + 1}</strong> {p.username} — {p.score} pts
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}