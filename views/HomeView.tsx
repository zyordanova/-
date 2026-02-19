import React from 'react';
import { AppView, Difficulty, UserStats, MascotAccessory } from '../types';
import { Mascot } from '../components/Mascot';

interface HomeViewProps {
  onChangeView: (view: AppView) => void;
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  mascotColor: UserStats['mascotColor'];
  mascotAccessory: MascotAccessory;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
    onChangeView, 
    difficulty, 
    onDifficultyChange, 
    mascotColor,
    mascotAccessory 
}) => {

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-4 animate-fade-in w-full">
      <div className="text-center space-y-2">
        <Mascot mood="happy" color={mascotColor} accessory={mascotAccessory} />
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mt-2 fun-font">
          Здравей, Приятел!
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Избери трудност и започни играта:
        </p>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-200">
        {(Object.values(Difficulty) as Difficulty[]).map((level) => {
          const labels: Record<Difficulty, string> = {
            [Difficulty.EASY]: 'Лесно 🌱',
            [Difficulty.MEDIUM]: 'Средно 🌼',
            [Difficulty.HARD]: 'Трудно 🌳'
          };
          
          const isActive = difficulty === level;
          
          return (
            <button
              key={level}
              onClick={() => onDifficultyChange(level)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-indigo-500 text-white shadow-md transform scale-105' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {labels[level]}
            </button>
          );
        })}
      </div>

      {/* Main Mode Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-2">
        {/* Calculation Mode */}
        <button
          onClick={() => onChangeView(AppView.CALCULATION)}
          className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-b-8 border-cyan-500 hover:-translate-y-1"
        >
          <div className="absolute -top-4 -right-4 bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
            1
          </div>
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧮</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Задачи</h3>
          <p className="text-sm text-gray-500">Умножение и ред на действия</p>
        </button>

        {/* Story Mode */}
        <button
          onClick={() => onChangeView(AppView.STORY_MODE)}
          className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-b-8 border-violet-500 hover:-translate-y-1"
        >
          <div className="absolute -top-4 -right-4 bg-violet-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
            2
          </div>
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🦄</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Истории</h3>
          <p className="text-sm text-gray-500">Текстови задачи с AI</p>
        </button>

        {/* Geometry Mode */}
        <button
          onClick={() => onChangeView(AppView.GEOMETRY)}
          className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-b-8 border-rose-500 hover:-translate-y-1"
        >
          <div className="absolute -top-4 -right-4 bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
            3
          </div>
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔺</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Геометрия</h3>
          <p className="text-sm text-gray-500">Обиколки и фигури</p>
        </button>
      </div>

      {/* Secondary Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl justify-center mt-2">
        <button 
          onClick={() => onChangeView(AppView.MULTIPLICATION_TABLE)}
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-6 py-3 rounded-2xl font-bold border-2 border-emerald-300 shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>🔢</span>
          <span>Таблица</span>
        </button>

        <button 
          onClick={() => onChangeView(AppView.ACHIEVEMENTS)}
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-3 rounded-2xl font-bold border-2 border-amber-300 shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>🏆</span>
          <span>Постижения</span>
        </button>

        <button 
          onClick={() => onChangeView(AppView.HISTORY)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-2xl font-bold border-2 border-blue-300 shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>👤</span>
          <span>Дневник</span>
        </button>
      </div>
    </div>
  );
};