import React from 'react';
import { MascotAccessory } from '../types';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'excited';
  color?: 'blue' | 'pink' | 'green' | 'purple';
  accessory?: MascotAccessory;
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy', color = 'blue', accessory = 'none' }) => {
  
  const colors = {
    blue: { main: '#3B82F6', stroke: '#1E40AF', light: '#93C5FD', dark: '#1E3A8A' },
    pink: { main: '#EC4899', stroke: '#BE185D', light: '#FBCFE8', dark: '#831843' },
    green: { main: '#10B981', stroke: '#047857', light: '#6EE7B7', dark: '#064E3B' },
    purple: { main: '#8B5CF6', stroke: '#5B21B6', light: '#C4B5FD', dark: '#4C1D95' },
  };

  const c = colors[color];

  return (
    <div className="w-28 h-28 relative mx-auto mb-4 animate-bounce-slow">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Ears (Large, Alien-like) */}
        <path d="M 10 50 Q 0 100 50 110 L 60 90 Q 30 80 40 50 Z" fill={c.main} stroke={c.stroke} strokeWidth="3" />
        <path d="M 190 50 Q 200 100 150 110 L 140 90 Q 170 80 160 50 Z" fill={c.main} stroke={c.stroke} strokeWidth="3" />
        
        {/* Inner Ears */}
        <path d="M 15 55 Q 10 90 45 100" fill={c.light} opacity="0.7" />
        <path d="M 185 55 Q 190 90 155 100" fill={c.light} opacity="0.7" />

        {/* Head */}
        <path d="M 50 130 C 40 70, 160 70, 150 130 C 150 180, 50 180, 50 130" fill={c.main} stroke={c.stroke} strokeWidth="3" />
        
        {/* Light Patch around Eyes/Belly area if visible */}
        <path d="M 70 100 Q 100 90 130 100 Q 130 140 100 145 Q 70 140 70 100" fill={c.light} opacity="0.6" />

        {/* Nose */}
        <ellipse cx="100" cy="125" rx="12" ry="8" fill={c.dark} />

        {/* Eyes */}
        <ellipse cx="75" cy="110" rx="10" ry="12" fill="#111827" />
        <ellipse cx="125" cy="110" rx="10" ry="12" fill="#111827" />
        
        {/* Highlights */}
        <circle cx="78" cy="106" r="3" fill="white" />
        <circle cx="128" cy="106" r="3" fill="white" />

        {/* Mouth based on mood */}
        {mood === 'happy' && (
           <path d="M 85 145 Q 100 155 115 145" stroke="#111827" strokeWidth="3" fill="transparent" strokeLinecap="round" />
        )}
        {mood === 'thinking' && (
           <path d="M 90 145 Q 100 145 110 145" stroke="#111827" strokeWidth="3" fill="transparent" strokeLinecap="round" />
        )}
        {mood === 'excited' && (
           <path d="M 85 140 Q 100 165 115 140" fill="#F87171" stroke="#111827" strokeWidth="2" />
        )}
        
        {/* Hair Tuft */}
        <path d="M 95 75 L 100 65 L 105 75" fill={c.main} stroke={c.stroke} strokeWidth="2" />

        {/* Accessories */}
        {accessory === 'glasses' && (
          <g>
            <circle cx="75" cy="110" r="20" fill="none" stroke="black" strokeWidth="4" />
            <circle cx="125" cy="110" r="20" fill="none" stroke="black" strokeWidth="4" />
            <line x1="95" y1="110" x2="105" y2="110" stroke="black" strokeWidth="4" />
          </g>
        )}

        {accessory === 'hat' && (
          <g transform="translate(0, -10)">
            <path d="M 60 70 L 140 70 L 130 40 L 70 40 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />
            <rect x="50" y="70" width="100" height="10" rx="5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />
          </g>
        )}

        {accessory === 'crown' && (
          <path d="M 60 75 L 60 40 L 80 60 L 100 30 L 120 60 L 140 40 L 140 75 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        )}

        {accessory === 'bow' && (
           <path d="M 80 165 L 70 155 L 70 175 Z M 120 165 L 130 155 L 130 175 Z M 80 165 L 120 165" fill="#EC4899" stroke="#DB2777" strokeWidth="8" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};