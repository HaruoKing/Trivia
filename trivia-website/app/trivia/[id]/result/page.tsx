'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Player = {
  id: string;
  username: string;
  score: number;
};

export default function ResultPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScore = async () => {
      const playerID = localStorage.getItem('playerID');
      if (!playerID) {
        toast.error('No player ID found.');
        router.push('/');
        return;
      }

      try {
        const res = await fetch(`http://192.168.0.12:8080/trivia/player/${playerID}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to load score.');

        setPlayer(data);
      } catch (err: any) {
        toast.error(err.message || 'Something went wrong.');
      }
    };

    fetchScore();
  }, [router]);

  const handleRestart = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">🎉 Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
  {player ? (
    <>
      <p className="text-lg">
        Well done, <span className="font-semibold">{player.username}</span>!
      </p>
      <p className="text-2xl font-bold">{player.score} / 100</p>
      <Button onClick={handleRestart} className="w-full">
        Play Again
      </Button>
    </>
  ) : (
    <p className="text-lg">Loading your results...</p>
  )}
</CardContent>
      </Card>
    </main>
  );
}
