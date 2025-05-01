'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WaitingForQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionID = params.questionID || params.questionid; // handles fallback casing
  const [waitingPlayers, setWaitingPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (!questionID || typeof questionID !== 'string') return;

    const poll = async () => {
      try {
        const res = await fetch(`http://192.168.0.12:8080/trivia/waiting/${questionID}`);
        const names: string[] = await res.json();

        if (names.length === 0) {
          const nextNum = parseInt(localStorage.getItem('nextQuestionNumber') || '2');
          router.push(`/trivia/${nextNum}`);
        } else {
          setWaitingPlayers(names);
        }
      } catch {
        setWaitingPlayers([]);
      }
    };

    const interval = setInterval(poll, 3000);
    poll(); // initial fetch

    return () => clearInterval(interval);
  }, [questionID, router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black/60 backdrop-blur">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl font-bold">⏳ Waiting for Others</CardTitle>
        </CardHeader>
        <CardContent>
          {waitingPlayers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Waiting on the following players to answer:
              </p>
              <ul className="list-disc list-inside text-left text-sm text-gray-300">
                {waitingPlayers.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground animate-pulse">Checking players...</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
