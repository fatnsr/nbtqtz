export interface PlayerStats {
  wallet: number;
  brainPower: number;
  funMeter: number;
}

export interface ChoiceEffect {
  walletChange: number;
  brainPowerChange: number;
  funMeterChange: number;
}

export interface Choice {
  id: string;
  text: string;
  subtext: string;
  emoji: string;
  type: 'spending' | 'saving' | 'investing' | 'earning' | 'charity';
  effect: ChoiceEffect;
  outcomeMessage: string; // Message shown after picking this choice
}

export interface Scenario {
  id: number;
  title: string;
  category: string; // New field for educational topic (Income, Spending, etc.)
  imageKeyword: string; // For fetching relevant images
  imageAlt: string;
  description: string;
  choices: Choice[];
}

export interface GameState {
  level: number;
  stats: PlayerStats;
  currentScenario: Scenario | null;
  history: string[];
  isLoading: boolean;
  gameOver: boolean;
}