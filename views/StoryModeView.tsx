import React, { useState, useEffect } from 'react';
import { generateStoryProblem } from '../services/geminiService';
import { Question, Difficulty, HistoryEntry, UserStats, MascotAccessory } from '../types';
import { Button } from '../components/Button';
import { DrawingCanvas } from '../components/DrawingCanvas';

interface StoryModeViewProps {
  onScoreUpdate: (points: number, stars: number, category?: string, historyItem?: Partial<HistoryEntry>) => void;
  difficulty: Difficulty;
  mascotColor?: UserStats['mascotColor'];
  mascotAccessory?: MascotAccessory;
}

export const StoryModeView: React.FC<StoryModeViewProps> = ({ 
    onScoreUpdate, 
    difficulty
}) => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const loadNewProblem = async () => {
    setLoading(true);
    setFeedback(null);
    setIsCorrect(null);
    setQuestion(null);
    const q = await generateStoryProblem(difficulty);
    setQuestion(q);
    setLoading(false);
  };

  useEffect(() => {
    loadNewProblem();
  }, [difficulty]); 

  const handleAnswer = (index: number) => {
    if (!question || feedback) return;

    const correct = index === question.correctAnswerIndex;
    setIsCorrect(correct);

    const historyItem: Partial<HistoryEntry> = {
        questionText: question.text.substring(0, 50) + (question.text.length > 50 ? '...' : ''), // Truncate long stories for history log
        isCorrect: correct,
        type: 'story',
        difficulty: difficulty
    };

    if (correct) {
      setFeedback(`Поздравления! ${question.explanation || ""}`);
      const points = difficulty === Difficulty.HARD ? 25 : difficulty === Difficulty.MEDIUM ? 20 : 15;
      onScoreUpdate(points, 2, 'story', historyItem); 
    } else {
      setFeedback("Отговорът не е верен. Прочети условието отново.");
      onScoreUpdate(0, 0, 'story', historyItem);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-6xl animate-bounce">🧙‍♂️</div>
        <p className="text-xl text-indigo-600 font-bold animate-pulse">
          Вълшебникът мисли задача...
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Ох, нещо се обърка с магията.</p>
        <Button onClick={loadNewProblem}>Опитай пак</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8 max-w-2xl mx-auto w-full border-b-8 border-violet-200">
      
      {/* Question Text */}
      <div className="mb-4">
           <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed text-center">
            {question.text}
          </h3>
      </div>

      {/* Drawing Area for Visualization */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2 font-bold text-center">✏️ Нарисувай условието тук:</p>
        <DrawingCanvas />
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <Button
            key={idx}
            variant={
              feedback && idx === question.correctAnswerIndex
                ? 'success'
                : feedback && idx !== question.correctAnswerIndex && isCorrect === false
                ? 'danger'
                : 'outline'
            }
            className="w-full text-left text-lg flex items-center gap-3"
            onClick={() => handleAnswer(idx)}
          >
             <span className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
               {String.fromCharCode(65 + idx)}
             </span>
             {opt}
          </Button>
        ))}
      </div>

      {feedback && (
        <div className={`mt-6 p-4 rounded-xl text-lg flex flex-col md:flex-row items-center justify-between gap-4 ${isCorrect ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          <p>{feedback}</p>
          {isCorrect && (
             <Button size="sm" onClick={loadNewProblem}>Следваща</Button>
          )}
        </div>
      )}
    </div>
  );
};