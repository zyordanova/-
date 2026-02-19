import React from 'react';
import { HistoryEntry, UserStats, MascotAccessory } from '../types';
import { Button } from '../components/Button';

interface HistoryViewProps {
  history: HistoryEntry[];
  stats: UserStats;
  onBack: () => void;
  onClearHistory: () => void;
  onUpdateMascotColor: (color: UserStats['mascotColor']) => void;
  onUpdateMascotAccessory: (accessory: MascotAccessory) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  history, 
  stats, 
  onBack, 
  onClearHistory,
  onUpdateMascotColor,
  onUpdateMascotAccessory
}) => {
  const totalQuestions = history.length;
  const correctAnswers = history.filter(h => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const accessories: { id: MascotAccessory, icon: string }[] = [
    { id: 'none', icon: '🚫' },
    { id: 'glasses', icon: '👓' },
    { id: 'hat', icon: '🧢' },
    { id: 'crown', icon: '👑' },
    { id: 'bow', icon: '🎀' },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in w-full max-w-4xl mx-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header & Nav */}
      <div className="flex items-center justify-between mb-6 no-print">
        <Button variant="outline" size="sm" onClick={onBack}>
          ⬅ Назад
        </Button>
        <h2 className="text-2xl font-bold text-indigo-700 fun-font hidden sm:block">
          Дневник на Героя
        </h2>
        <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handlePrint}>
              🖨️ Принтирай
            </Button>
        </div>
      </div>

      <div className="print-area flex flex-col gap-6">
        
        {/* Section 1: Character & Stats */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-b-4 border-indigo-200 flex flex-col md:flex-row gap-8 items-center">
          
          {/* Customization Column */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-gray-500 mb-2 no-print">Твоят Герой</h3>
            
            {/* Color Picker */}
            <div className="flex gap-2 mt-2 no-print mb-3">
              {(['blue', 'pink', 'green', 'purple'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => onUpdateMascotColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${stats.mascotColor === c ? 'border-gray-800 scale-110' : 'border-white'} shadow-sm transition-transform hover:scale-110`}
                  style={{ backgroundColor: c === 'blue' ? '#3B82F6' : c === 'pink' ? '#EC4899' : c === 'green' ? '#10B981' : '#8B5CF6' }}
                  aria-label={`Select ${c}`}
                />
              ))}
            </div>

            {/* Accessory Picker */}
            <div className="flex gap-2 no-print bg-gray-50 p-2 rounded-xl">
              {accessories.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onUpdateMascotAccessory(acc.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    stats.mascotAccessory === acc.id 
                      ? 'bg-white shadow-md border-2 border-indigo-400 scale-110' 
                      : 'hover:bg-gray-200 opacity-70'
                  }`}
                  aria-label={`Select ${acc.id}`}
                >
                  {acc.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Column */}
          <div className="flex-1 w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Статистика</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600">{stats.points}</div>
                <div className="text-sm text-gray-600">Точки</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">{stats.stars}</div>
                <div className="text-sm text-gray-600">Звезди</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Решени задачи</div>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Верни отговори</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: History Log */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-b-4 border-gray-200 flex-1 min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">История на задачите</h3>
            <button 
              onClick={onClearHistory} 
              className="text-red-400 text-sm hover:text-red-600 underline no-print"
            >
              Изчисти историята
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>Все още нямаш решени задачи. Хайде да поиграем!</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
              {[...history].reverse().map((entry) => (
                <div 
                  key={entry.id} 
                  className={`p-3 rounded-xl border-l-4 flex justify-between items-center ${
                    entry.isCorrect 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{entry.questionText}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      <span className="uppercase">{
                        entry.type === 'math' ? '🧮 Математика' : 
                        entry.type === 'geometry' ? '🔺 Геометрия' : '🦄 История'
                      }</span>
                      <span>•</span>
                      <span>{entry.difficulty === 'EASY' ? 'Лесно' : entry.difficulty === 'MEDIUM' ? 'Средно' : 'Трудно'}</span>
                    </div>
                  </div>
                  <div className="text-2xl ml-4">
                    {entry.isCorrect ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center text-gray-400 text-sm mt-4 hidden print:block">
          Отчет генериран от "Математическо Приключение"
        </div>
      </div>
    </div>
  );
};