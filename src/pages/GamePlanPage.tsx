import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import Chat from '@/components/Chat'; // Мы создадим этот компонент

const API_URL = "https://gamenot.onrender.com";

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
      const fullHistory = gameHistory.map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await fetch(`${API_URL}/api/send-money`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, history: fullHistory })
      });
      if (!response.ok) throw new Error('Не удалось отправить деньги. Возможно, наш счет переполнен.');
      
      const { reply } = await response.json();
      addMessageToHistory({ role: 'assistant', content: `**Отчет после взноса $${amount}:**\n\n${reply}` });
      setAmount('');
      toast({ title: "Успех!", description: "Ваш взнос получен! Разработка ускорилась!" });
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
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Ваш Проект с GameNot
          </h1>
          <p className="text-xl mt-4">Добро пожаловать в будущее, {userName}!</p>
        </header>

        <Card className="mb-8 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-primary">{gamePlan.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold">План Разработки:</h3>
              <p>{gamePlan.game_plan}</p>
            </div>
            <div>
              <h3 className="font-bold">Финансовые Перспективы:</h3>
              <p>{gamePlan.financial_outlook}</p>
            </div>
            <div>
              <h3 className="font-bold">Отчет от Команды:</h3>
              <p>{gamePlan.team_update}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-secondary/30">
          <CardHeader>
            <CardTitle>История Проекта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {gameHistory.map((msg, index) => (
              <div key={index} className="p-3 rounded-md bg-background/50 whitespace-pre-wrap">
                {msg.content}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-8 bg-secondary/30">
          <CardHeader>
            <CardTitle>Ускорить Разработку</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Наши гении требуют больше ресурсов! Ваш вклад ускорит создание шедевра.</p>
            <div className="flex gap-4">
              <Input 
                type="number" 
                placeholder="Сумма в $" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleSendMoney} disabled={isLoading}>
                {isLoading ? 'Отправка...' : 'Сделать взнос'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Связаться с Командой</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => openChat('bogdan')}>Чат с Богданом (CEO)</Button>
            <Button variant="outline" onClick={() => openChat('olya')}>Чат с Олей (Арт-директор)</Button>
            <Button variant="outline" onClick={() => openChat('felix')}>Чат с Феликсом (Разработчик)</Button>
          </CardContent>
        </Card>
      </div>

      {isChatOpen && activeChat && (
        <Chat person={activeChat} closeChat={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default GamePlanPage;
