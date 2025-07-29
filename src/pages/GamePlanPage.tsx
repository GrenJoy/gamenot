import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import Chat from '@/components/Chat';
import { Separator } from '@/components/ui/separator';

const API_URL = "https://gamenot.onrender.com";

// Новый "умный" компонент для отображения одного поста в ленте
const ProjectUpdateCard = ({ update, title }: { update: any, title: string }) => (
  <Card className="bg-secondary/30">
    <CardHeader>
      <CardTitle className="text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {Object.entries(update).map(([key, value]) => (
        <div key={key}>
          <h3 className="font-bold capitalize text-lg">{key.replace(/_/g, ' ')}:</h3>
          {typeof value === 'string' ? (
            <p className="text-foreground/80 whitespace-pre-wrap">{value}</p>
          ) : (
            <div className="pl-4 border-l-2 border-primary/20 space-y-2 mt-2">
              {Object.entries(value as object).map(([subKey, subValue]) => (
                <div key={subKey}>
                  <h4 className="font-semibold capitalize">{subKey.replace(/_/g, ' ')}</h4>
                  <p className="text-foreground/70 whitespace-pre-wrap">{String(subValue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

const GamePlanPage = () => {
  const { gamePlan, gameHistory, addMessageToHistory, isLoading, setLoading, setError, userName } = useGame();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<'bogdan' | 'olya' | 'felix' | null>(null);

  const handleSendMoney = async () => {
    if (!amount || +amount <= 0) {
      toast({ title: "Ошибка", description: "Введите корректную сумму", variant: "destructive" });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fullHistory = gameHistory.map(m => JSON.stringify(m.content)).join('\n');
      const response = await fetch(`${API_URL}/api/send-money`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, history: fullHistory })
      });
      if (!response.ok) throw new Error('Не удалось отправить деньги. Возможно, наш счет переполнен.');
      
      const update = await response.json();
      addMessageToHistory({ role: 'assistant', content: update });
      setAmount('');
      toast({ title: "Успех!", description: "Ваш взнос получен! Читайте новый отчет в ленте." });
    } catch (error: any) {
      setError(error.message);
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openChat = (person: 'bogdan' | 'olya' | 'felix') => {
    setActiveChat(person);
    setIsChatOpen(true);
  };

  if (!gamePlan) return <div>Загрузка плана...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Левая колонка - Лента новостей */}
        <div className="md:col-span-2 space-y-6">
          <header className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              {gamePlan.title}
            </h1>
            <p className="text-xl mt-2">Дневник разработки для, {userName}</p>
          </header>
          <Separator />
          <div className="space-y-8">
            {gameHistory.map((item, index) => (
               <ProjectUpdateCard 
                  key={index}
                  update={item.content}
                  title={index === 0 ? "Первоначальный план" : `Отчет #${index}`}
               />
            ))}
          </div>
        </div>

        {/* Правая колонка - Управление */}
        <div className="space-y-6">
          <Card className="sticky top-8 bg-secondary/30">
            <CardHeader>
              <CardTitle>Панель инвестора</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">Ускорить разработку</h4>
                <p className="text-sm text-foreground/70 mb-4">Ваш вклад ускорит создание шедевра.</p>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Сумма в $" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  <Button onClick={handleSendMoney} disabled={isLoading}>
                    {isLoading ? '...' : 'Взнос'}
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-bold mb-2">Связаться с командой</h4>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" onClick={() => openChat('bogdan')}>Чат с Богданом (CEO)</Button>
                  <Button variant="outline" onClick={() => openChat('olya')}>Чат с Олей (Арт-директор)</Button>
                  <Button variant="outline" onClick={() => openChat('felix')}>Чат с Феликсом (Разработчик)</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {isChatOpen && activeChat && (
        <Chat person={activeChat} closeChat={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default GamePlanPage;

