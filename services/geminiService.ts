import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, PlayerStats, Choice } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

// Helper to clean text if the model hallucinates JSON syntax inside strings
const cleanText = (text: string): string => {
  if (!text) return "";
  let cleaned = text.replace(/^["']|["']$/g, '');
  if (cleaned.includes('": "')) {
    cleaned = cleaned.split('": "').pop()?.replace('"', '') || cleaned;
  }
  // Remove markdown code block syntax if present
  cleaned = cleaned.replace(/\\/g, '');
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
  return cleaned;
};

const FALLBACK_SCENARIOS = [
  {
    title: "The Lemonade Stand",
    category: "Trade & Profit",
    imageKeyword: "lemonade stand summer drink",
    imageAlt: "A bright yellow lemonade stand",
    description: "It's a hot day! You can buy lemons and sugar to sell lemonade, or just buy a cold drink for yourself.",
    choices: [
      { id: "f1", text: "Start Stand (Cost 10)", subtext: "Invest to earn more.", emoji: "🍋", type: "investing", effect: { walletChange: -10, brainPowerChange: 10, funMeterChange: 5 }, outcomeMessage: "You sold lots of lemonade and made 30 QAR profit!" },
      { id: "f2", text: "Buy a Slushie", subtext: "Cool down instantly.", emoji: "🥤", type: "spending", effect: { walletChange: -5, brainPowerChange: 0, funMeterChange: 10 }, outcomeMessage: "Brain freeze! Yummy but money is gone." }
    ]
  },
  {
    title: "The Toy Sale",
    category: "Smart Saving",
    imageKeyword: "toy store sale price tag",
    imageAlt: "A toy store with a big red sale sign",
    description: "There is a massive sale on toys! 50% off. You don't really need a new toy, but it's cheap.",
    choices: [
      { id: "f3", text: "Buy Toy (Cost 20)", subtext: "It is on sale!", emoji: "robot", type: "spending", effect: { walletChange: -20, brainPowerChange: 0, funMeterChange: 15 }, outcomeMessage: "New toy! But was it a need or a want?" },
      { id: "f4", text: "Walk Away", subtext: "Save your money.", emoji: "zipper_mouth_face", type: "saving", effect: { walletChange: 0, brainPowerChange: 5, funMeterChange: -5 }, outcomeMessage: "You resisted the urge! Your savings are safe." }
    ]
  },
  {
    title: "Charity Drive",
    category: "Charity (Sadaqah)",
    imageKeyword: "donation box helping hands",
    imageAlt: "A charity donation box",
    description: "The school is collecting money for people who need food. You have some pocket money.",
    choices: [
      { id: "f5", text: "Donate 10 QAR", subtext: "Help others.", emoji: "🤝", type: "charity", effect: { walletChange: -10, brainPowerChange: 15, funMeterChange: 20 }, outcomeMessage: "You feel warm inside knowing you helped someone." },
      { id: "f6", text: "Keep Money", subtext: "Maybe next time.", emoji: "😐", type: "saving", effect: { walletChange: 0, brainPowerChange: 0, funMeterChange: 0 }, outcomeMessage: "You kept your money." }
    ]
  }
];

const getFallbackScenario = (level: number, wallet: number) => {
    // If broke, find earning
    if (wallet < 15) {
        return {
            id: level,
            title: "Garage Helper",
            category: "Honest Work",
            imageKeyword: "cleaning garage broom",
            imageAlt: "Cleaning a garage",
            description: "Your neighbor needs help organizing their garage. They will pay you for your time.",
            choices: [
                { id: "bk1", text: "Help Out", subtext: "Earn 20 QAR", emoji: "🧹", type: "earning", effect: { walletChange: 20, brainPowerChange: 5, funMeterChange: -5 }, outcomeMessage: "Hard work pays off! +20 QAR." },
                { id: "bk2", text: "Relax", subtext: "Earn nothing", emoji: "bed", type: "saving", effect: { walletChange: 0, brainPowerChange: 0, funMeterChange: 5 }, outcomeMessage: "You rested, but your wallet is empty." }
            ]
        };
    }
    
    // Random fallback
    const s = FALLBACK_SCENARIOS[Math.floor(Math.random() * FALLBACK_SCENARIOS.length)];
    
    // Ensure affordability in fallback
    const safeChoices = s.choices.map((c: any) => {
        if (c.effect.walletChange < 0 && Math.abs(c.effect.walletChange) > wallet) {
             // If too expensive, change to a generic "Watch" option
             return { ...c, text: "Just Watch", subtext: "Can't afford it yet", type: "saving", effect: { walletChange: 0, brainPowerChange: 0, funMeterChange: 0 }, outcomeMessage: "You watched and saved your money." };
        }
        return c;
    });
    
    return { ...s, id: level, choices: safeChoices };
};

export const generateNextScenario = async (
  currentLevel: number,
  stats: PlayerStats,
  previousDecision?: string
): Promise<Scenario> => {
  
  // Initialize Gemini Client inside the function
  const apiKey = process.env.API_KEY;

  // 1. HARDCODED LEVELS (Zero Load Time)
  if (currentLevel === 1) {
     return {
        id: 2,
        title: "The Subscription Trap",
        category: "Spending",
        imageKeyword: "video game pass subscription",
        imageAlt: "A game screen showing a monthly pass",
        description: "You want a 'Game Pass'. It costs 15 QAR every month. Or you can buy a different game once for 60 QAR. Monthly payments add up!",
        choices: [
             { id: "l2a", text: "Subscribe (15/mo)", subtext: "Looks cheap...", emoji: "📅", type: "spending", effect: { walletChange: -15, brainPowerChange: 0, funMeterChange: 20 }, outcomeMessage: "You paid 15. Next month you pay again... and again." },
             { id: "l2b", text: "Buy Once (60)", subtext: "Expensive but done.", emoji: "💿", type: "investing", effect: { walletChange: -60, brainPowerChange: 20, funMeterChange: 20 }, outcomeMessage: "Ouch! 60 QAR gone. But you own it forever. No more payments!" }
        ]
     };
  } 
  
  if (currentLevel === 2) {
      return {
           id: 3,
           title: "Eidiyah Surprise",
           category: "Eidiyah Windfall",
           imageKeyword: "gift box money celebration",
           imageAlt: "A gift box with money",
           description: "It's Eid! You got 200 QAR from your relatives. That's a lot of money! What is your plan?",
           choices: [
             { id: "l3a", text: "Spend it All!", subtext: "Buy that big toy.", emoji: "🎁", type: "spending", effect: { walletChange: -200, brainPowerChange: 0, funMeterChange: 50 }, outcomeMessage: "It was fun, but now the money is all gone." },
             { id: "l3b", text: "Save & Donate", subtext: "Save 150, Give 50.", emoji: "🕌", type: "charity", effect: { walletChange: -50, brainPowerChange: 20, funMeterChange: 20 }, outcomeMessage: "You feel great helping others and still have savings!" }
           ]
        };
  }

  // 2. DEBT PROTECTION: Broke State
  if (stats.wallet < 20) {
     return getFallbackScenario(currentLevel + 1, stats.wallet);
  }

  // 3. AI GENERATION (With Timeout Fallback)
  try {
      if (!apiKey) throw new Error("No API Key");
      const ai = new GoogleGenAI({ apiKey });
      
      const concept = [
        { topic: "Trade & Profit", guidance: "Buy ingredients for 20, sell cupcakes for 40. Profit = 20. (Business)" },
        { topic: "Smart Spending", guidance: "Needs vs Wants. School shoes vs cool sneakers. (Budgeting)" },
        { topic: "Charity", guidance: "Donate to help others. It brings blessings. (Charity)" },
        { topic: "Patience", guidance: "Wait for a sale vs buy now at full price. (Saving)" }
     ][Math.floor(Math.random() * 4)];

      const prompt = `
        Target: Kids 7-14.
        Scenario: ${concept.topic}.
        Wallet: ${stats.wallet} QAR.
        Guidance: ${concept.guidance}.
        
        RULES:
        1. NO "Finding money". NO Interest.
        2. Choices MUST be affordable (Max cost ${stats.wallet}).
        3. Output JSON. Simple text.
        
        Schema: { title, category, description, imageKeyword, choices: [{id, text, subtext, emoji, type, effect: {walletChange, brainPowerChange, funMeterChange}, outcomeMessage}] }
      `;

      // 4-second timeout for AI
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 4000));
      
      const apiPromise = ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json", 
        }
      });

      const response: any = await Promise.race([apiPromise, timeoutPromise]);
      const text = response.text;
      const data = JSON.parse(cleanText(text));
      
      // 4. SANITIZATION & DEBT CHECK
      let affordableCount = 0;
      const safeChoices = data.choices.map((c: any) => {
         const validTypes = ['spending', 'saving', 'investing', 'earning', 'charity'];
         if (!validTypes.includes(c.type)) c.type = 'spending';

         // If choice puts user in debt, disable it or change it
         if (c.effect.walletChange < 0 && Math.abs(c.effect.walletChange) > stats.wallet) {
            // Mark for disabling in UI, or modify if we need at least one valid option
            return { 
                ...c, 
                text: "Too Expensive", 
                subtext: `Need ${Math.abs(c.effect.walletChange)}`, 
                emoji: "🔒",
                effect: { walletChange: 0, brainPowerChange: 0, funMeterChange: 0 },
                outcomeMessage: "You didn't have enough money."
            };
         } else {
            affordableCount++;
         }
         return c;
      });

      // Prevent soft-lock: If 0 choices are affordable, force one to be free/earning
      if (affordableCount === 0) {
          safeChoices[0] = {
             id: "rescue_opt",
             text: "Do Nothing",
             subtext: "Save your money",
             emoji: "🛑",
             type: "saving",
             effect: { walletChange: 0, brainPowerChange: 0, funMeterChange: -5 },
             outcomeMessage: "You decided not to spend anything."
          };
      }

      return {
          ...data,
          title: cleanText(data.title),
          description: cleanText(data.description),
          category: data.category || concept.topic,
          id: currentLevel + 1,
          choices: safeChoices
      };

  } catch (error) {
      console.log("Using fallback scenario due to:", error);
      return getFallbackScenario(currentLevel + 1, stats.wallet);
  }
};