'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TriviaAPI } from '@/lib/api';

export default function WaitingForResultsPage() {
  const router = useRouter();
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(TriviaAPI.finishedPlayers);
      const allDone = await res.json();
      
      if (allDone) {
        clearInterval(interval);
        router.push('/trivia/result');
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [router]);
  
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black/60 backdrop-blur">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl font-bold">⌛ Waiting for Everyone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The results will appear once all players finish.</p>
        </CardContent>
      </Card>
    </main>
  );
}