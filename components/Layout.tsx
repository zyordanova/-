import React from 'react';
import { UserStats, AppView } from '../types';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
  stats: UserStats;
  currentView: AppView;
  onHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, stats, currentView, onHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b-2 border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentView !== AppView.HOME && (
              <Button variant="outline" size="sm" onClick={onHome} className="mr-2">
                🏠
              </Button>
            )}
            <h1 className="text-lg md:text-2xl font-bold text-indigo-600 fun-font hidden sm:block">
              Математическо Приключение
            </h1>
            <h1 className="text-lg md:text-2xl font-bold text-indigo-600 fun-font sm:hidden">
              Мат Приключение
            </h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm md:text-base font-bold">
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
              <span>⭐</span>
              <span>{stats.stars}</span>
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
              <span>🏆</span>
              <span>{stats.points}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-xs">
        <p>Създадено за ученици от 2-ри клас ❤️</p>
      </footer>
    </div>
  );
};