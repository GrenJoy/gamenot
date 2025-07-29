import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- TypeScript Types ---

// The structure of the initial game plan received from the AI
export interface IGamePlan {
  title: string;
  game_plan: string;
  financial_outlook: string;
  team_update: string;
}

// A single message in any chat
export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}

// The main state of our application
interface IGameState {
  userName: string;
  gameDescription: string;
  gamePlan: IGamePlan | null;
  gameHistory: IMessage[]; // General history including money updates
  bogdanChat: IMessage[];
  olyaChat: IMessage[];
  felixChat: IMessage[];
  isLoading: boolean;
  error: string | null;
}

// --- Context Definition ---

interface IGameContext extends IGameState {
  setUserName: (name: string) => void;
  setGameDescription: (description: string) => void;
  setGamePlan: (plan: IGamePlan) => void;
  addMessageToHistory: (message: IMessage) => void;
  addMessageToBogdanChat: (message: IMessage) => void;
  addMessageToOlyaChat: (message: IMessage) => void;
  addMessageToFelixChat: (message: IMessage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

// --- Provider Component ---

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [gamePlan, setGamePlan] = useState<IGamePlan | null>(null);
  const [gameHistory, setGameHistory] = useState<IMessage[]>([]);
  const [bogdanChat, setBogdanChat] = useState<IMessage[]>([]);
  const [olyaChat, setOlyaChat] = useState<IMessage[]>([]);
  const [felixChat, setFelixChat] = useState<IMessage[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessageToHistory = (message: IMessage) => setGameHistory(prev => [...prev, message]);
  const addMessageToBogdanChat = (message: IMessage) => setBogdanChat(prev => [...prev, message]);
  const addMessageToOlyaChat = (message: IMessage) => setOlyaChat(prev => [...prev, message]);
  const addMessageToFelixChat = (message: IMessage) => setFelixChat(prev => [...prev, message]);

  return (
    <GameContext.Provider value={{
      userName, setUserName,
      gameDescription, setGameDescription,
      gamePlan, setGamePlan,
      gameHistory, addMessageToHistory,
      bogdanChat, addMessageToBogdanChat,
      olyaChat, addMessageToOlyaChat,
      felixChat, addMessageToFelixChat,
      isLoading, setLoading,
      error, setError
    }}>
      {children}
    </GameContext.Provider>
  );
};

// --- Custom Hook ---

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
