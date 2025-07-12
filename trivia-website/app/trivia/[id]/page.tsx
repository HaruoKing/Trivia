'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { TriviaAPI } from '@/lib/api';

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'multipleChoice' | 'text';
  hint?: string;
};

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionNumber = Number(params.id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const playerID = typeof window !== 'undefined' ? localStorage.getItem('playerID') : null;
  
  useEffect(() => {
    if (!playerID) {
      router.replace('/');
      return;
    }
    
    const fetchQuestions = async () => {
      try {
        const res = await fetch(TriviaAPI.questions);
        const data: Question[] = await res.json();
        setQuestions(data);
        const question = data[questionNumber - 1];
        
        if (!question) {
          router.push('/trivia/result');
        } else {
          setCurrentQuestion(question);
          // Save next number to use in waiting screen redirect
          localStorage.setItem('nextQuestionNumber', String(questionNumber + 1));
        }
      } catch {
        toast.error('Failed to load question.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [questionNumber, playerID, router]);
  
  const handleAnswer = async (answer: string) => {
    if (!playerID || !currentQuestion) return;
    setIsSubmitting(true);
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setFeedback(isCorrect ? '✅ Correct!' : '❌ Incorrect...');
    
    try {
      await fetch(TriviaAPI.answer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerID,
          questionID: currentQuestion.id,
          answer,
        }),
      });
      
      setTimeout(() => {
        setFeedback(null);
        if (questionNumber >= 20) {
          router.push('/trivia/result');
        } else {
          // ✅ Wait based on question UUID now
          router.push(`/trivia/waiting-for-question/${currentQuestion.id}`);
        }
      }, 1500);
    } catch {
      toast.error('Failed to submit answer.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-lg animate-pulse">Loading question...</p>
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
          <p className="text-lg font-medium">{currentQuestion.text}</p>
          {currentQuestion.hint && (
            <p className="text-sm text-muted-foreground italic">Hint: {currentQuestion.hint}</p>
          )}
          {currentQuestion.type === 'multipleChoice' ? (
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleAnswer(option)}
                  disabled={isSubmitting}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnswer(textAnswer);
              }}
              className="space-y-4"
            >
              <Input
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer"
                disabled={isSubmitting}
                className="w-full"
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Submit Answer
              </Button>
            </form>
          )}
          {feedback && (
            <p className={`text-lg font-semibold ${feedback.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}