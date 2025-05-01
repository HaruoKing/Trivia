'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

type Player = {
  id: string;
  username: string;
  score: number;
};

export default function ScoresPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://192.168.0.12:8080/trivia/players');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch players.');
        setPlayers(data);
      } catch (err: any) {
        toast.error(err.message || 'Error loading leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">🏆 Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
  {loading ? (
    <p>Loading...</p>
  ) : players.length === 0 ? (
    <p>No players yet.</p>
  ) : (
    <>
      <Separator className="my-4" />
      <ScrollArea className="h-[400px] px-2">
  <ul className="space-y-3">
    {players.map((player, index) => (
      <li
        key={player.id}
        className="flex justify-between items-center rounded-lg px-4 py-3 bg-muted"
      >
        <span className="font-semibold">
          #{index + 1} — {player.username}
        </span>
        <span className="text-sm">{player.score} pts</span>
      </li>
    ))}
  </ul>
</ScrollArea>
    </>
  )}
</CardContent>
      </Card>
    </main>
  );
}
