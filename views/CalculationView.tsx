import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { Question, Difficulty, HistoryEntry, UserStats, MascotAccessory } from '../types';
import { getEncouragement } from '../services/geminiService';

interface CalculationViewProps {
  onScoreUpdate: (points: number, stars: number, category?: string, historyItem?: Partial<HistoryEntry>) => void;
  difficulty: Difficulty;
  mascotColor?: UserStats['mascotColor'];
  mascotAccessory?: MascotAccessory;
}

export const CalculationView: React.FC<CalculationViewProps> = ({ 
    onScoreUpdate, 
    difficulty
}) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateOrderOfOperations = useCallback(() => {
    // Generates questions like:
    // 1. A + B * C
    // 2. B * C - A
    // 3. A + B : C
    // 4. B : C - A
    
    const types = ['plus_mult', 'minus_mult', 'plus_div', 'minus_div'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let qText = "";
    let correct = 0;
    
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (type.includes('mult')) {
        const a = rand(1, 20);
        const b = rand(2, 9);
        const c = rand(2, 9);
        
        if (type === 'plus_mult') {
            correct = a + (b * c);
            qText = `${a} + ${b} • ${c} = ?`;
        } else {
             const product = b * c;
             const sub = Math.min(a, product - 1); 
             correct = product - sub;
             qText = `${b} • ${c} - ${sub} = ?`;
        }
    } else {
        const divisor = rand(2, 9); 
        const quotient = rand(2, 9); 
        const dividend = divisor * quotient; 
        const a = rand(1, 20);

        if (type === 'plus_div') {
            correct = a + quotient;
            qText = `${a} + ${dividend} : ${divisor} = ?`;
        } else {
            if (quotient > a) {
                correct = quotient - a;
                qText = `${dividend} : ${divisor} - ${a} = ?`;
            } else {
                const safeA = a <= quotient ? quotient + rand(1, 10) : a;
                correct = safeA - quotient;
                qText = `${safeA} - ${dividend} : ${divisor} = ?`;
            }
        }
    }
    
    return { qText, correct };
  }, []);

  const generateQuestion = useCallback(() => {
    const isOrderOfOps = (difficulty !== Difficulty.EASY) && (Math.random() < 0.3);

    let qText = "";
    let correct = 0;

    if (isOrderOfOps) {
        const oop = generateOrderOfOperations();
        qText = oop.qText;
        correct = oop.correct;
    } else {
        const isMultiplication = Math.random() > 0.5;
        let factorsA: number[] = [];
        let factorsB: number[] = [];

        switch (difficulty) {
        case Difficulty.EASY:
            factorsA = [1, 2, 5, 10]; 
            factorsB = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            break;
        case Difficulty.HARD:
            factorsA = [6, 7, 8, 9];
            factorsB = [2, 3, 4, 5, 6, 7, 8, 9]; 
            break;
        case Difficulty.MEDIUM:
        default:
            factorsA = [2, 3, 4, 5, 6, 7, 8, 9];
            factorsB = [2, 3, 4, 5, 6, 7, 8, 9];
            break;
        }

        const a = factorsA[Math.floor(Math.random() * factorsA.length)];
        const b = factorsB[Math.floor(Math.random() * factorsB.length)];

        if (isMultiplication) {
            correct = a * b;
            qText = `${a} • ${b} = ?`;
        } else {
            const divisor = a;
            const quotient = b;
            const dividend = divisor * quotient;
            correct = quotient;
            qText = `${dividend} : ${divisor} = ?`;
        }
    }

    const optionsSet = new Set<number>();
    optionsSet.add(correct);
    
    const range = difficulty === Difficulty.EASY ? 5 : difficulty === Difficulty.MEDIUM ? 3 : 2;
    
    while (optionsSet.size < 4) {
      let offset = Math.floor(Math.random() * range * 3) + 1; 
      if (Math.random() > 0.5) offset = -offset;
      const wrong = correct + offset;
      if (wrong > 0 && wrong <= 200) optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5).map(String);
    const correctIndex = options.indexOf(String(correct));

    setQuestion({
      id: Date.now().toString(),
      text: qText,
      options,
      correctAnswerIndex: correctIndex,
      type: 'math'
    });
    setFeedback(null);
    setIsCorrect(null);
  }, [difficulty, generateOrderOfOperations]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = async (index: number) => {
    if (!question || feedback) return;

    const correct = index === question.correctAnswerIndex;
    setIsCorrect(correct);

    const historyItem: Partial<HistoryEntry> = {
        questionText: question.text,
        isCorrect: correct,
        type: 'math',
        difficulty: difficulty
    };

    if (correct) {
      const points = difficulty === Difficulty.HARD ? 20 : difficulty === Difficulty.MEDIUM ? 15 : 10;
      onScoreUpdate(points, 1, 'math', historyItem);
      const msg = await getEncouragement(true);
      setFeedback(msg);
      setTimeout(generateQuestion, 2000);
    } else {
      onScoreUpdate(0, 0, 'math', historyItem); 
      setFeedback("Грешка! Опитай пак.");
      setTimeout(generateQuestion, 2000);
    }
  };

  if (!question) return <div>Зареждане...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full text-center relative overflow-hidden border-b-8 border-indigo-200">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-mono tracking-wider mt-4">
          {question.text}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {question.options.map((opt, idx) => (
            <Button
              key={idx}
              variant={
                feedback && idx === question.correctAnswerIndex
                  ? 'success'
                  : feedback && idx !== question.correctAnswerIndex && isCorrect === false
                  ? 'danger'
                  : 'primary'
              }
              size="lg"
              onClick={() => handleAnswer(idx)}
              disabled={!!feedback}
              className="text-2xl"
            >
              {opt}
            </Button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-6 p-3 rounded-xl text-lg font-bold animate-bounce ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};