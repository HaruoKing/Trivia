'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WaitingPage() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://192.168.0.12:8080/trivia/game-state');
        const data = await res.json();
        if (data.started) {
          clearInterval(interval);
          router.push('/trivia/1');
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black/60 backdrop-blur">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">⏰ Waiting for Host</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The game will start automatically once the host begins.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
