'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function HostPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleStart = async () => {
    try {
      const res = await fetch('http://localhost:8080/trivia/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        toast.error('Invalid password or server error.');
        return;
      }

      toast.success('Game started!');
      router.push('/trivia/1');
    } catch (err) {
      toast.error('Failed to start the game.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Host Control Panel</h1>
        <Input
          type="password"
          placeholder="Enter host password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleStart}>Start Game</Button>
      </div>
    </main>
  );
}
