import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { Difficulty, HistoryEntry, UserStats, MascotAccessory } from '../types';

interface GeometryViewProps {
  onScoreUpdate: (points: number, stars: number, category?: string, historyItem?: Partial<HistoryEntry>) => void;
  difficulty: Difficulty;
  mascotColor?: UserStats['mascotColor'];
  mascotAccessory?: MascotAccessory;
}

type GeoTaskType = 'perimeter' | 'find_side' | 'triangle_type';

interface GeoQuestion {
  id: string;
  type: GeoTaskType;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  visualData: any; // Data needed to render SVG
  explanation: string;
}

export const GeometryView: React.FC<GeometryViewProps> = ({ 
    onScoreUpdate, 
    difficulty
}) => {
  const [question, setQuestion] = useState<GeoQuestion | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateQuestion = useCallback(() => {
    // 3 Task Types:
    // 1. Calculate Perimeter (Square, Rectangle, Triangle)
    // 2. Find Side given Perimeter (Square, Equilateral Triangle)
    // 3. Identify Triangle Type (Equilateral, Isosceles, Scalene)

    const tasks: GeoTaskType[] = ['perimeter', 'find_side', 'triangle_type'];
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    
    // Random number helpers
    const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    let q: GeoQuestion;

    if (task === 'perimeter') {
        const shapes = ['square', 'rectangle', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        let sideA = r(2, 10);
        let sideB = r(2, 10);
        let sideC = r(2, 10);
        let perimeter = 0;
        let text = "";
        
        if (shape === 'square') {
            perimeter = 4 * sideA;
            text = `Намери обиколката на квадрата със страна ${sideA} см.`;
        } else if (shape === 'rectangle') {
            if (sideA === sideB) sideB += 2; // Make sure it's a rectangle
            perimeter = 2 * (sideA + sideB);
            text = `Намери обиколката на правоъгълника със страни ${sideA} см и ${sideB} см.`;
        } else {
            // Triangle validity check
            sideA = r(3, 9);
            sideB = r(3, 9);
            sideC = r(Math.abs(sideA - sideB) + 1, sideA + sideB - 1); // Triangle inequality
            perimeter = sideA + sideB + sideC;
            text = `Намери обиколката на триъгълника със страни ${sideA} см, ${sideB} см и ${sideC} см.`;
        }

        const options = [
            perimeter.toString() + ' см', 
            (perimeter - r(1, 3)).toString() + ' см', 
            (perimeter + r(1, 3)).toString() + ' см'
        ].sort(() => Math.random() - 0.5);

        q = {
            id: Date.now().toString(),
            type: 'perimeter',
            text,
            options,
            correctAnswerIndex: options.indexOf(perimeter.toString() + ' см'),
            visualData: { shape, sideA, sideB, sideC },
            explanation: shape === 'square' ? `P = 4 • ${sideA} = ${perimeter} см` : shape === 'rectangle' ? `P = 2 • (${sideA} + ${sideB}) = ${perimeter} см` : `P = ${sideA} + ${sideB} + ${sideC} = ${perimeter} см`
        };

    } else if (task === 'find_side') {
        // Only Square and Equilateral Triangle for 2nd grade division
        const shapes = ['square', 'equilateral_triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        let side = r(2, 9);
        let perimeter = 0;
        let text = "";

        if (shape === 'square') {
            perimeter = side * 4;
            text = `Обиколката на квадрат е ${perimeter} см. Намери страната му.`;
        } else {
            side = r(2, 8) * (Math.random() > 0.5 ? 3 : 1); // Ensure divisibility sometimes, though for equilateral side is int
            side = r(2, 9);
            perimeter = side * 3;
            text = `Обиколката на равностранен триъгълник е ${perimeter} см. Намери страната му.`;
        }

        const options = [
            side.toString() + ' см',
            (side + 1).toString() + ' см',
            (side - 1 > 0 ? side - 1 : side + 2).toString() + ' см'
        ].sort(() => Math.random() - 0.5);

        q = {
             id: Date.now().toString(),
             type: 'find_side',
             text,
             options,
             correctAnswerIndex: options.indexOf(side.toString() + ' см'),
             visualData: { shape, perimeter }, // Draw generic shape with P=?
             explanation: shape === 'square' ? `Страната = ${perimeter} : 4 = ${side} см` : `Страната = ${perimeter} : 3 = ${side} см`
        };

    } else {
        // Triangle Types
        const types = ['equilateral', 'isosceles', 'scalene'];
        const triType = types[Math.floor(Math.random() * types.length)];
        
        let a=0, b=0, c=0;
        let correctLabel = "";

        if (triType === 'equilateral') {
            a = b = c = r(3, 8);
            correctLabel = "Равностранен";
        } else if (triType === 'isosceles') {
            a = b = r(4, 9);
            c = r(3, a + b - 2);
            if (c === a) c -= 1; // Prevent accidental equilateral
            correctLabel = "Равнобедрен";
        } else {
            a = r(3, 7);
            b = a + r(1, 2);
            c = b + r(1, 2); // Ensure strict inequality
            // check valid triangle
            if (a+b <= c) c = a+b-1;
            correctLabel = "Разностранен";
        }

        const options = ["Равностранен", "Равнобедрен", "Разностранен"];
        
        q = {
            id: Date.now().toString(),
            type: 'triangle_type',
            text: `Какъв е този триъгълник според страните? (${a} см, ${b} см, ${c} см)`,
            options,
            correctAnswerIndex: options.indexOf(correctLabel),
            visualData: { shape: 'triangle', sideA: a, sideB: b, sideC: c, subType: triType },
            explanation: triType === 'equilateral' ? "Всички страни са равни." : triType === 'isosceles' ? "Две страни са равни." : "Всички страни са различни."
        };
    }

    setQuestion(q);
    setFeedback(null);
    setIsCorrect(null);

  }, [difficulty]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (answer: string) => {
    if (!question || feedback) return;

    const correct = question.options[question.correctAnswerIndex] === answer;
    
    const historyItem: Partial<HistoryEntry> = {
        questionText: question.text,
        isCorrect: correct,
        type: 'geometry',
        difficulty: difficulty
    };

    if (correct) {
      setFeedback("Поздравления! " + question.explanation);
      setIsCorrect(true);
      onScoreUpdate(15, 1, 'geometry', historyItem);
      setTimeout(generateQuestion, 3000);
    } else {
      setIsCorrect(false);
      setFeedback("Не е това отговорът. " + question.explanation);
      onScoreUpdate(0, 0, 'geometry', historyItem);
      // Wait longer on error to read
      setTimeout(generateQuestion, 4000);
    }
  };

  const renderVisual = (data: any) => {
    if (!data) return null;

    // Common Styles
    const strokeStyle = "#4F46E5"; // Indigo 600
    const fillStyle = "#E0E7FF";   // Indigo 100
    const textStyle = { fontSize: '14px', fontWeight: 'bold', fill: '#1F2937' };

    if (data.shape === 'square') {
        return (
            <svg viewBox="0 0 150 150" className="w-48 h-48 mx-auto drop-shadow-md">
                <rect x="35" y="35" width="80" height="80" fill={fillStyle} stroke={strokeStyle} strokeWidth="3" />
                {data.sideA && (
                    <>
                        <text x="75" y="30" textAnchor="middle" style={textStyle}>{data.sideA} см</text>
                        <text x="120" y="80" style={textStyle}>{data.sideA} см</text>
                    </>
                )}
                 {data.perimeter && (
                    <text x="75" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">P = {data.perimeter} см</text>
                )}
            </svg>
        );
    } else if (data.shape === 'rectangle') {
         return (
            <svg viewBox="0 0 160 120" className="w-52 h-40 mx-auto drop-shadow-md">
                <rect x="20" y="30" width="120" height="60" fill={fillStyle} stroke={strokeStyle} strokeWidth="3" />
                <text x="80" y="25" textAnchor="middle" style={textStyle}>{data.sideA} см</text>
                <text x="145" y="65" style={textStyle}>{data.sideB} см</text>
            </svg>
        );
    } else if (data.shape === 'triangle' || data.shape === 'equilateral_triangle') {
        // Draw a generic triangle, labels matter more
        // Points: Top(75, 20), Left(20, 100), Right(130, 100)
        return (
            <svg viewBox="0 0 150 120" className="w-52 h-40 mx-auto drop-shadow-md">
                <polygon points="75,20 20,100 130,100" fill={fillStyle} stroke={strokeStyle} strokeWidth="3" />
                {/* Labels */}
                {data.sideA && (
                    <>
                        <text x="40" y="60" textAnchor="end" style={textStyle}>{data.sideA} см</text>
                        <text x="110" y="60" textAnchor="start" style={textStyle}>{data.sideB || data.sideA} см</text>
                        <text x="75" y="115" textAnchor="middle" style={textStyle}>{data.sideC || data.sideA} см</text>
                    </>
                )}
                {data.perimeter && (
                    <text x="75" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">P = {data.perimeter} см</text>
                )}
            </svg>
        );
    }
  };

  if (!question) return <div>Зареждане...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border-b-8 border-rose-200 relative">
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4 fun-font">{question.text}</h2>
        
        <div className="mb-6">
          {renderVisual(question.visualData)}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt) => (
            <Button 
              key={opt} 
              variant="secondary" 
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              className="text-lg"
            >
              {opt}
            </Button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-6 p-4 rounded-xl text-lg font-bold animate-fade-in ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};