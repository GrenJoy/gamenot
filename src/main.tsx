import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameProvider } from './context/GameContext.tsx';

createRoot(document.getElementById("root")!).render(
    <GameProvider>
        <App />
    </GameProvider>
);

