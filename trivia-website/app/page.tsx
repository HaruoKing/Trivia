'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TriviaAPI } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStart = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const res = await fetch(TriviaAPI.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }
  
      localStorage.setItem('playerID', data.id);
      localStorage.setItem('username', data.username);
  
      // Check game state
      const stateRes = await fetch(TriviaAPI.gameState);
      const state = await stateRes.json();
  
      if (state.started) {
        router.push('/trivia/1');
      } else {
        router.push('/waiting');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🎮 Victor's Anime Trivia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Name"
            disabled={isLoading}
            className="w-full"
          />
          <Button className="w-full" onClick={handleStart} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Trivia'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}