import React from 'react';
import { PlayerStats } from '../types';
import { ProgressBar } from './ProgressBar';
import { Wallet, Brain, Zap, Trophy } from 'lucide-react';

interface SidebarProps {
  stats: PlayerStats;
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-6">
      {/* Profile Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-indigo-50 relative overflow-hidden">
        
        {/* Header Background Decor */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
        
        <div className="relative flex flex-col items-center mt-8">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-blue-100 z-10">
             {/* Specific Avatar requested: Cute boy, brown hair, blue shirt */}
             <img 
                src="https://image.pollinations.ai/prompt/cute%20anime%20boy%20avatar%20messy%20brown%20hair%20blue%20t-shirt%20simple%20flat%20white%20background?width=512&height=512&nologo=true&seed=99" 
                alt="Avatar" 
                className="w-full h-full object-cover" 
             />
          </div>
          
          <h2 className="mt-3 text-xl font-bold text-gray-800">Alex</h2>
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-6">Future Millionaire</p>
          
          <div className="w-full space-y-1">
            <ProgressBar 
              label="Wallet" 
              value={stats.wallet} 
              max={1000} 
              unit="QAR"
              colorClass="bg-gradient-to-r from-yellow-400 to-amber-500" 
              icon={<Wallet size={14} className="text-amber-500" />}
            />
            <ProgressBar 
              label="Brain Power" 
              value={stats.brainPower} 
              max={100} 
              unit="XP"
              colorClass="bg-gradient-to-r from-purple-400 to-purple-600" 
              icon={<Brain size={14} className="text-purple-500" />}
            />
             <ProgressBar 
              label="Fun Meter" 
              value={stats.funMeter} 
              max={100} 
              unit="%"
              colorClass="bg-gradient-to-r from-pink-400 to-rose-500" 
              icon={<Zap size={14} className="text-rose-500" />}
            />
          </div>
        </div>
      </div>

      {/* Badges Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-indigo-50 min-h-[200px] flex flex-col">
         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Your Badges <Trophy size={14} />
         </h3>
         <div className="flex-1 flex items-center justify-center text-gray-300 italic text-sm">
            Start playing to win!
         </div>
      </div>
    </div>
  );
};