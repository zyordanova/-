export enum AppView {
  HOME = 'HOME',
  CALCULATION = 'CALCULATION', // Multiply/Divide and Order of Operations
  GEOMETRY = 'GEOMETRY',
  STORY_MODE = 'STORY_MODE', // AI Text Problems
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MULTIPLICATION_TABLE = 'MULTIPLICATION_TABLE',
  HISTORY = 'HISTORY' // New Profile/History View
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string; // Optional explanation for the answer
  type: 'math' | 'geometry' | 'story';
  imageUrl?: string; // For geometry or visual cues
  subjectEmoji?: string; // For story mode visualization (e.g. "🍎")
}

export type MascotAccessory = 'none' | 'glasses' | 'hat' | 'crown' | 'bow';

export interface UserStats {
  points: number;
  stars: number;
  streak: number;
  geometryCorrect: number;
  mascotColor: 'blue' | 'pink' | 'green' | 'purple';
  mascotAccessory: MascotAccessory;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  questionText: string;
  isCorrect: boolean;
  type: 'math' | 'geometry' | 'story';
  difficulty: Difficulty;
}