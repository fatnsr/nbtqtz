import React from 'react';
import { Choice } from '../types';
import { Wallet, Brain, Zap, ArrowRight, Shield, Star, Briefcase, ShoppingBag, Heart, Loader2 } from 'lucide-react';

interface FeedbackModalProps {
  choice: Choice | null;
  onNext: () => void;
  isLoading: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ choice, onNext, isLoading }) => {
  if (!choice) return null;

  // Dynamic styling based on choice type
  const getTheme = () => {
    switch (choice.type) {
      case 'saving':
        return {
          title: "Future Hero",
          icon: <Shield size={48} className="text-emerald-400" />,
          bg: "bg-emerald-500/20",
          text: "text-emerald-400",
          button: "bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50"
        };
      case 'spending':
        return {
          title: "Big Spender",
          icon: <ShoppingBag size={48} className="text-amber-400" />,
          bg: "bg-amber-500/20",
          text: "text-amber-400",
          button: "bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50"
        };
      case 'earning':
        return {
          title: "Hard Worker",
          icon: <Briefcase size={48} className="text-blue-400" />,
          bg: "bg-blue-500/20",
          text: "text-blue-400",
          button: "bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50"
        };
      case 'charity':
        return {
          title: "Generous Soul",
          icon: <Heart size={48} className="text-rose-400" />,
          bg: "bg-rose-500/20",
          text: "text-rose-400",
          button: "bg-rose-500 hover:bg-rose-400 disabled:bg-rose-500/50"
        };
      default:
        return {
          title: "Life Chooser",
          icon: <Star size={48} className="text-purple-400" />,
          bg: "bg-purple-500/20",
          text: "text-purple-400",
          button: "bg-purple-500 hover:bg-purple-400 disabled:bg-purple-500/50"
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl p-8 text-center shadow-2xl transform transition-all scale-100">
        
        {/* Icon Bubble */}
        <div className="mx-auto w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mb-6 shadow-inner relative">
           <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
             {choice.emoji}
           </div>
           {theme.icon}
        </div>

        <h2 className={`text-3xl font-black mb-2 ${theme.text}`}>
          {theme.title}
        </h2>

        <p className="text-slate-300 text-lg mb-8 font-medium leading-relaxed">
          {choice.outcomeMessage}
        </p>

        {/* Stats Impact Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           {choice.effect.walletChange !== 0 && (
               <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Wallet</div>
                  <div className={`text-xl font-black flex items-center justify-center gap-1 ${choice.effect.walletChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {choice.effect.walletChange > 0 ? '+' : ''}{choice.effect.walletChange}
                    <Wallet size={16} />
                  </div>
               </div>
           )}
           {choice.effect.brainPowerChange !== 0 && (
               <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Brain Power</div>
                  <div className="text-xl font-black text-purple-400 flex items-center justify-center gap-1">
                    +{choice.effect.brainPowerChange}
                    <Brain size={16} />
                  </div>
               </div>
           )}
           {choice.effect.funMeterChange !== 0 && (
               <div className={`bg-slate-700/50 p-4 rounded-2xl border border-slate-600 ${choice.effect.walletChange === 0 ? 'col-span-2' : ''}`}>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Fun</div>
                  <div className={`text-xl font-black flex items-center justify-center gap-1 ${choice.effect.funMeterChange > 0 ? 'text-pink-400' : 'text-slate-400'}`}>
                    {choice.effect.funMeterChange > 0 ? '+' : ''}{choice.effect.funMeterChange}%
                    <Zap size={16} />
                  </div>
               </div>
           )}
        </div>

        <button 
          onClick={onNext}
          disabled={isLoading}
          className={`w-full py-4 rounded-full font-black text-white text-lg shadow-lg transform transition flex items-center justify-center gap-2 ${theme.button} ${isLoading ? 'cursor-not-allowed opacity-90' : 'hover:scale-105 active:scale-95'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Preparing Next Level...
            </>
          ) : (
            <>
              Next Challenge <ArrowRight size={20} />
            </>
          )}
        </button>

      </div>
    </div>
  );
};