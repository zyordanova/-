import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { CalculationView } from './views/CalculationView';
import { GeometryView } from './views/GeometryView';
import { StoryModeView } from './views/StoryModeView';
import { AchievementsView } from './views/AchievementsView';
import { MultiplicationTableView } from './views/MultiplicationTableView';
import { HistoryView } from './views/HistoryView';
import { AppView, UserStats, Difficulty, Achievement, HistoryEntry } from './types';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Първа Звезда', description: 'Спечели 1 звезда', icon: '⭐', unlocked: false },
  { id: '2', title: 'Математик', description: 'Събери 100 точки', icon: '🧮', unlocked: false },
  { id: '3', title: 'Геометрия Гуру', description: 'Познай 5 геометрични фигури', icon: '🔺', unlocked: false },
  { id: '4', title: 'Неуморим', description: 'Направи серия от 5 верни отговора', icon: '🔥', unlocked: false },
];

const INITIAL_STATS: UserStats = {
  points: 0,
  stars: 0,
  streak: 0,
  geometryCorrect: 0,
  mascotColor: 'blue',
  mascotAccessory: 'none'
};

const App: React.FC = () => {
  // Load state from local storage or use defaults
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new fields exist for legacy data
        return { ...INITIAL_STATS, ...parsed };
    }
    return INITIAL_STATS;
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('userHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Stats & History updates
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('userHistory', JSON.stringify(history));
  }, [history]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleScoreUpdate = (points: number, stars: number, category?: string, historyItem?: Partial<HistoryEntry>) => {
    setStats(prev => {
      const newStreak = points > 0 ? prev.streak + 1 : 0;
      const newStats = {
        ...prev,
        points: prev.points + points,
        stars: prev.stars + stars,
        streak: newStreak,
        geometryCorrect: (category === 'geometry' && points > 0) ? prev.geometryCorrect + 1 : prev.geometryCorrect
      };
      
      checkAchievements(newStats);
      return newStats;
    });

    if (historyItem && historyItem.questionText) {
        const newEntry: HistoryEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            questionText: historyItem.questionText,
            isCorrect: historyItem.isCorrect || false,
            type: historyItem.type || 'math',
            difficulty: historyItem.difficulty || Difficulty.EASY
        };
        // Keep only last 50 entries to save space
        setHistory(prev => [...prev, newEntry].slice(-50));
    }
  };

  const checkAchievements = (newStats: UserStats) => {
    setAchievements(prevAchievements => {
      let hasUpdates = false;
      const updated = prevAchievements.map(ach => {
        if (ach.unlocked) return ach; // Already unlocked

        let shouldUnlock = false;
        switch (ach.id) {
          case '1': // First Star
            shouldUnlock = newStats.stars >= 1;
            break;
          case '2': // 100 Points
            shouldUnlock = newStats.points >= 100;
            break;
          case '3': // Geometry Guru
            shouldUnlock = newStats.geometryCorrect >= 5;
            break;
          case '4': // Streak
            shouldUnlock = newStats.streak >= 5;
            break;
        }

        if (shouldUnlock) {
          hasUpdates = true;
          setNotification(`Отключено постижение: ${ach.title}! 🎉`);
          return { ...ach, unlocked: true };
        }
        return ach;
      });

      return hasUpdates ? updated : prevAchievements;
    });
  };

  const handleClearHistory = () => {
    if (window.confirm("Сигурен ли си, че искаш да изтриеш историята?")) {
        setHistory([]);
        setStats(INITIAL_STATS);
        localStorage.removeItem('userHistory');
        localStorage.removeItem('userStats');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <HomeView 
            onChangeView={setCurrentView} 
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            mascotColor={stats.mascotColor}
            mascotAccessory={stats.mascotAccessory}
          />
        );
      case AppView.CALCULATION:
        return (
            <CalculationView 
                onScoreUpdate={handleScoreUpdate} 
                difficulty={difficulty} 
                mascotColor={stats.mascotColor}
                mascotAccessory={stats.mascotAccessory}
            />
        );
      case AppView.GEOMETRY:
        return (
            <GeometryView 
                onScoreUpdate={handleScoreUpdate} 
                difficulty={difficulty} 
                mascotColor={stats.mascotColor}
                mascotAccessory={stats.mascotAccessory}
            />
        );
      case AppView.STORY_MODE:
        return (
            <StoryModeView 
                onScoreUpdate={handleScoreUpdate} 
                difficulty={difficulty} 
                mascotColor={stats.mascotColor}
                mascotAccessory={stats.mascotAccessory}
            />
        );
      case AppView.ACHIEVEMENTS:
        return (
            <AchievementsView 
                achievements={achievements} 
                onBack={() => setCurrentView(AppView.HOME)} 
                mascotColor={stats.mascotColor}
                mascotAccessory={stats.mascotAccessory}
            />
        );
      case AppView.MULTIPLICATION_TABLE:
        return <MultiplicationTableView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.HISTORY:
        return (
          <HistoryView 
            history={history} 
            stats={stats} 
            onBack={() => setCurrentView(AppView.HOME)} 
            onClearHistory={handleClearHistory}
            onUpdateMascotColor={(color) => setStats(prev => ({ ...prev, mascotColor: color }))}
            onUpdateMascotAccessory={(acc) => setStats(prev => ({ ...prev, mascotAccessory: acc }))}
          />
        );
      default:
        return (
          <HomeView 
            onChangeView={setCurrentView} 
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            mascotColor={stats.mascotColor}
            mascotAccessory={stats.mascotAccessory}
          />
        );
    }
  };

  return (
    <Layout 
      stats={stats} 
      currentView={currentView} 
      onHome={() => setCurrentView(AppView.HOME)}
    >
      {renderView()}
      
      {/* Achievement Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce-slow">
          <div className="bg-white border-l-4 border-yellow-500 shadow-xl rounded-r-lg p-4 flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div className="font-bold text-gray-800">{notification}</div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;