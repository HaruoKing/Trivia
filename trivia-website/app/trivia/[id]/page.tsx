'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
};

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionNumber = Number(params.id);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const playerID = typeof window !== 'undefined' ? localStorage.getItem('playerID') : null;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://192.168.0.12:8080/trivia/questions');
        const data = await res.json();
        setQuestions(data);

        const question = data[questionNumber - 1];
        if (!question) {
          router.push('/trivia/result');
        } else {
          setCurrentQuestion(question);
        }
      } catch (err) {
        toast.error('Failed to load question.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionNumber, router]);

  const handleAnswer = async (answer: string) => {
    if (!playerID || !currentQuestion) return;
    setSubmitting(true);

    try {
      await fetch('http://192.168.0.12:8080/trivia/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerID,
          questionID: currentQuestion.id,
          answer,
        }),
      });

      if (questionNumber >= 20) {
        router.push('/trivia/result');
      } else {
        router.push(`/trivia/${questionNumber + 1}`);
      }
    } catch (err) {
      toast.error('Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle className="text-xl">Question {questionNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
  <p className="mb-4 text-lg font-medium">{currentQuestion.text}</p>
  <div className="flex flex-col gap-4">
    {currentQuestion.options.map((option, idx) => (
      <Button
        key={idx}
        variant="secondary"
        onClick={() => handleAnswer(option)}
        disabled={submitting}
        className="w-full"
      >
        {option}
      </Button>
    ))}
  </div>
</CardContent>
      </Card>
    </main>
  );
}
