import React, { useState, useCallback } from 'react';
import { Layout, Save, Trophy } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { AdventureCard } from './components/AdventureCard';
import { FeedbackModal } from './components/FeedbackModal';
import { GameState, Choice, Scenario } from './types';
import { generateNextScenario } from './services/geminiService';

// Initial hardcoded scenario
const INITIAL_SCENARIO: Scenario = {
  id: 1,
  title: "The Candy Shop Trap",
  category: "Spending",
  imageKeyword: "candy shop interior colorful sweets",
  imageAlt: "A colorful candy shop filled with sweets",
  description: "You have 500 QAR pocket money. You are in a super cute candy store! There is a box of yummy chocolates for 50 QAR. But... you were saving for a new Gaming PC (1500 QAR). What do you do?",
  choices: [
    {
      id: "c1",
      text: "Buy the Chocolates!",
      subtext: "YUMMY NOW, GONE LATER.",
      emoji: "🍫",
      type: "spending",
      effect: {
        walletChange: -50,
        brainPowerChange: 0,
        funMeterChange: 20
      },
      outcomeMessage: "It was delicious! But that is 50 QAR less for your Gaming PC."
    },
    {
      id: "c2",
      text: "Save for the PC",
      subtext: "PATIENCE PAYS OFF.",
      emoji: "🖥️",
      type: "saving",
      effect: {
        walletChange: 0,
        brainPowerChange: 10,
        funMeterChange: -5
      },
      outcomeMessage: "Smart move! You kept your 500 QAR intact. Closer to the goal!"
    }
  ]
};

const INITIAL_STATE: GameState = {
  level: 1,
  stats: {
    wallet: 500,
    brainPower: 0,
    funMeter: 80
  },
  currentScenario: INITIAL_SCENARIO,
  history: [],
  isLoading: false,
  gameOver: false
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [feedbackChoice, setFeedbackChoice] = useState<Choice | null>(null);

  // Preload image for seamless transition
  const preloadImage = (keyword: string, id: number) => {
    const img = new Image();
    img.src = `https://image.pollinations.ai/prompt/minimalist%20flat%20vector%20art%20childrens%20book%20illustration%20${keyword}%20pastel%20colors%20white%20background?width=600&height=300&nologo=true&seed=${id}`;
  };

  // Handle user choice
  const handleChoice = useCallback((choice: Choice) => {
    // 1. Show Feedback Modal IMMEDIATELY
    setFeedbackChoice(choice);

    // 2. Calculate New Stats
    const newStats = {
      wallet: gameState.stats.wallet + choice.effect.walletChange,
      brainPower: gameState.stats.brainPower + choice.effect.brainPowerChange,
      funMeter: Math.min(100, Math.max(0, gameState.stats.funMeter + choice.effect.funMeterChange))
    };

    // 3. Update State Locally (Behind the modal)
    setGameState(prev => ({
      ...prev,
      stats: newStats,
      isLoading: true, // Show loading state
      history: [...prev.history, choice.text]
    }));

    // 4. Fetch Next Scenario (Background Loading)
    generateNextScenario(gameState.level, newStats, choice.text)
      .then((nextScenario) => {
        // Preload the next image while user is reading
        preloadImage(nextScenario.imageKeyword, nextScenario.id);

        // When data arrives, update the scenario immediately.
        // Since the Modal is covering the screen, the user won't see the swap happen,
        // making it feel "instant" when they close the modal.
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1,
          currentScenario: nextScenario,
          isLoading: false
        }));
      })
      .catch((error) => {
        console.error("Failed to load next level:", error);
        setGameState(prev => ({ ...prev, isLoading: false }));
      });

  }, [gameState.level, gameState.stats, gameState.history]);

  // Close modal to reveal the next level (which should be loaded by now)
  const handleNextChallenge = () => {
    setFeedbackChoice(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Feedback Modal Overlay */}
      {feedbackChoice && (
        <FeedbackModal 
          choice={feedbackChoice} 
          onNext={handleNextChallenge} 
          isLoading={gameState.isLoading} // Pass loading state to modal
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg transform -rotate-6">
                <Layout size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-black text-purple-600 tracking-tight leading-none">MoneyHero</h1>
                <p className="text-[0.65rem] font-bold text-purple-400 uppercase tracking-widest">Level Up Your Life!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm gap-2">
                <Trophy size={16} />
                Level {gameState.level}
             </div>
             <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg">
                <Save size={16} />
                Save Game
             </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <Sidebar stats={gameState.stats} />
            
            {/* Game Area */}
            {gameState.currentScenario && (
                <AdventureCard 
                    scenario={gameState.currentScenario} 
                    level={gameState.level} 
                    onChoice={handleChoice}
                    loading={gameState.isLoading}
                    wallet={gameState.stats.wallet}
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;