import React, { useState, useEffect } from 'react';
import { Scenario, Choice } from '../types';
import { Sparkles, ArrowRight, Loader2, Tag, Lock } from 'lucide-react';

interface AdventureCardProps {
  scenario: Scenario;
  level: number;
  onChoice: (choice: Choice) => void;
  loading: boolean;
  wallet: number;
}

export const AdventureCard: React.FC<AdventureCardProps> = ({ scenario, level, onChoice, loading, wallet }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loading state when scenario changes
  useEffect(() => {
    setImageLoaded(false);
  }, [scenario.id]);

  const handleSelect = (choice: Choice) => {
    if (loading) return;
    onChoice(choice);
  };

  // Updated Prompt Style: Minimalist flat vector for speed and consistency
  const imageUrl = `https://image.pollinations.ai/prompt/minimalist%20flat%20vector%20art%20childrens%20book%20illustration%20${scenario.imageKeyword}%20pastel%20colors%20white%20background?width=600&height=300&nologo=true&seed=${scenario.id}`;

  // Determine badge color based on category
  const getCategoryColor = (cat: string = "") => {
    const c = cat.toLowerCase();
    if (c.includes("work") || c.includes("earn") || c.includes("trade")) return "bg-blue-100 text-blue-700";
    if (c.includes("spend") || c.includes("need") || c.includes("subs")) return "bg-amber-100 text-amber-700";
    if (c.includes("growth") || c.includes("sav") || c.includes("eid")) return "bg-green-100 text-green-700";
    if (c.includes("charity") || c.includes("give")) return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className='flex flex-col'>
             <h2 className="text-2xl font-extrabold text-slate-800">Adventure #{level}</h2>
             <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider w-fit mt-1 ${getCategoryColor(scenario.category)}`}>
                <Tag size={10} /> Topic: {scenario.category || "General"}
             </div>
        </div>
        
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === (level - 1) % 5 ? 'bg-purple-500 scale-125' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-indigo-50 overflow-hidden flex-1 flex flex-col animate-fade-in relative min-h-[500px]">
        
        {/* Hero Image Area */}
        <div className="relative w-full h-64 bg-gray-50 overflow-hidden group">
           
           {/* Loading Overlay */}
           {loading && (
            <div className="absolute inset-0 z-30 bg-white/90 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                <div className="flex flex-col items-center animate-pulse">
                    <Sparkles className="text-purple-500 w-10 h-10 mb-2 animate-spin-slow" />
                    <span className="text-purple-600 font-bold">Loading next challenge...</span>
                </div>
            </div>
           )}

           {/* Image Fetching Spinner */}
           {!imageLoaded && !loading && (
             <div className="absolute inset-0 z-20 bg-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
             </div>
           )}
           
           <img 
             src={imageUrl} 
             alt={scenario.imageAlt} 
             onLoad={() => setImageLoaded(true)}
             className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
           />
           
           {/* Overlay Title */}
           <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-white text-3xl font-extrabold drop-shadow-md line-clamp-2">{scenario.title}</h3>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 flex-1">
            <p className="text-slate-700 text-lg leading-relaxed font-semibold">
                {scenario.description}
            </p>

            {/* Choices Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-auto">
                {scenario.choices.map((choice, idx) => {
                    const optionNumber = idx + 1;
                    
                    // Calculate affordability
                    const cost = choice.effect.walletChange;
                    // If walletChange is negative (cost), check if we have enough funds
                    const isAffordable = cost >= 0 || (wallet + cost >= 0);
                    
                    // Default Styling
                    let bgClass = "bg-indigo-50 hover:bg-indigo-100 border-indigo-100";
                    let titleColor = "text-indigo-900";
                    let subtextColor = "text-indigo-700/70";
                    let badgeColor = "bg-indigo-200 text-indigo-800";

                    if (!isAffordable) {
                        bgClass = "bg-gray-50 border-gray-200 opacity-70 grayscale cursor-not-allowed";
                        titleColor = "text-gray-500";
                        subtextColor = "text-gray-400";
                        badgeColor = "bg-gray-200 text-gray-500";
                    } else {
                        // Type-based Styling (Only if affordable)
                        if (choice.type === 'saving' || choice.type === 'investing') {
                            bgClass = "bg-emerald-50 hover:bg-emerald-100 border-emerald-100";
                            titleColor = "text-emerald-900";
                            subtextColor = "text-emerald-700/70";
                            badgeColor = "bg-emerald-200 text-emerald-800";
                        } else if (choice.type === 'earning') {
                             bgClass = "bg-sky-50 hover:bg-sky-100 border-sky-100";
                             titleColor = "text-sky-900";
                             subtextColor = "text-sky-700/70";
                             badgeColor = "bg-sky-200 text-sky-800";
                        } else if (choice.type === 'spending') {
                             bgClass = "bg-amber-50 hover:bg-amber-100 border-amber-100";
                             titleColor = "text-amber-900";
                             subtextColor = "text-amber-700/70";
                             badgeColor = "bg-amber-200 text-amber-800";
                        } else if (choice.type === 'charity') {
                             bgClass = "bg-rose-50 hover:bg-rose-100 border-rose-100";
                             titleColor = "text-rose-900";
                             subtextColor = "text-rose-700/70";
                             badgeColor = "bg-rose-200 text-rose-800";
                        }
                    }

                    return (
                        <button
                            key={choice.id}
                            onClick={() => isAffordable && handleSelect(choice)}
                            disabled={loading || !isAffordable}
                            className={`
                                relative p-5 rounded-2xl text-left border-2 transition-all duration-200 group
                                ${bgClass}
                                ${isAffordable ? 'hover:-translate-y-1 hover:shadow-md' : ''}
                                overflow-hidden
                            `}
                        >
                            <div className="absolute top-4 right-4 text-2xl group-hover:scale-110 transition-transform">
                                {isAffordable ? choice.emoji : <Lock size={24} className="text-gray-400" />}
                            </div>
                            
                            <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-2 ${badgeColor}`}>
                                {!isAffordable ? "Too Expensive" : `Option ${optionNumber}`}
                            </div>

                            <div className="flex items-start justify-between mb-1 pr-8">
                                <h4 className={`text-lg font-bold leading-tight ${titleColor} line-clamp-2 break-words`}>
                                    {choice.text}
                                </h4>
                            </div>
                            <p className={`text-xs font-bold uppercase tracking-wider ${subtextColor} line-clamp-2`}>
                                {choice.subtext}
                            </p>
                            
                            {isAffordable && (
                                <div className={`absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity ${titleColor}`}>
                                    <ArrowRight size={18} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};