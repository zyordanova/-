import React, { useState } from 'react';
import { Button } from '../components/Button';

interface MultiplicationTableViewProps {
  onBack: () => void;
}

export const MultiplicationTableView: React.FC<MultiplicationTableViewProps> = ({ onBack }) => {
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);

  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full animate-fade-in w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          ⬅ Назад
        </Button>
        <h2 className="text-2xl font-bold text-indigo-700 fun-font text-center flex-1">
          Таблица за Умножение
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 border-b-8 border-cyan-200 flex flex-col items-center">
        
        {/* Selected Math Display */}
        <div className="h-16 mb-4 flex items-center justify-center">
          {selectedCell ? (
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 bg-indigo-50 px-8 py-2 rounded-xl animate-bounce-slow shadow-sm border border-indigo-100">
              {selectedCell.r} • {selectedCell.c} = <span className="text-rose-500">{selectedCell.r * selectedCell.c}</span>
            </div>
          ) : (
            <p className="text-gray-400 text-lg">Натисни число от таблицата!</p>
          )}
        </div>

        {/* The Grid */}
        <div className="overflow-x-auto w-full pb-4 custom-scrollbar">
          <div className="inline-block min-w-[600px] w-full">
            {/* Header Row */}
            <div className="flex mb-2">
              <div className="w-12 h-12 flex items-center justify-center font-bold text-gray-400 text-xl">X</div>
              {cols.map(c => (
                <div key={`head-${c}`} className="w-12 h-12 flex items-center justify-center font-bold text-indigo-600 text-lg mx-0.5 bg-indigo-50 rounded-lg">
                  {c}
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map(r => (
              <div key={`row-${r}`} className="flex mb-1">
                {/* Row Label */}
                <div className="w-12 h-12 flex items-center justify-center font-bold text-indigo-600 text-lg mr-2 bg-indigo-50 rounded-lg">
                  {r}
                </div>
                
                {/* Cells */}
                {cols.map(c => {
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const isRowHighlighted = selectedCell?.r === r;
                  const isColHighlighted = selectedCell?.c === c;
                  
                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => setSelectedCell({r, c})}
                      className={`
                        w-12 h-12 mx-0.5 rounded-lg text-sm font-bold transition-all duration-200
                        flex items-center justify-center shadow-sm border
                        ${isSelected 
                          ? 'bg-rose-500 text-white scale-110 border-rose-600 z-10' 
                          : isRowHighlighted || isColHighlighted
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                            : 'bg-white text-gray-600 hover:bg-yellow-100 border-gray-200'
                        }
                      `}
                    >
                      {r * c}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          💡 Съвет: Научи лесните числа първо (1, 2, 5 и 10)!
        </p>
      </div>
    </div>
  );
};