import React from 'react';
import { Achievement, UserStats, MascotAccessory } from '../types';
import { Button } from '../components/Button';

interface AchievementsViewProps {
  achievements: Achievement[];
  onBack: () => void;
  mascotColor?: UserStats['mascotColor'];
  mascotAccessory?: MascotAccessory;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ 
    achievements, 
    onBack,
}) => {
  return (
    <div className="flex flex-col h-full animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          ⬅ Назад
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 fun-font text-center flex-1">
          Моите Постижения
        </h2>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pb-4 px-2 custom-scrollbar">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`
              relative p-4 rounded-2xl border-b-4 shadow-md flex items-center gap-4 transition-all duration-300
              ${ach.unlocked 
                ? 'bg-white border-yellow-400 opacity-100 transform hover:scale-102' 
                : 'bg-gray-100 border-gray-300 opacity-70 grayscale'
              }
            `}
          >
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner
              ${ach.unlocked ? 'bg-yellow-100' : 'bg-gray-200'}
            `}>
              {ach.unlocked ? ach.icon : '🔒'}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${ach.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                {ach.title}
              </h3>
              <p className="text-sm text-gray-600 leading-tight mt-1">
                {ach.description}
              </p>
            </div>

            {ach.unlocked && (
              <div className="absolute top-2 right-2 text-yellow-500 animate-pulse">
                ✨
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};