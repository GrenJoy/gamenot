import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGame, IMessage } from '@/context/GameContext';
import { X } from 'lucide-react';

const API_URL = "https://gamenot.onrender.com";

interface ChatProps {
  person: 'bogdan' | 'olya' | 'felix';
  closeChat: () => void;
}

const Chat = ({ person, closeChat }: ChatProps) => {
  const { 
    bogdanChat, olyaChat, felixChat, 
    addMessageToBogdanChat, addMessageToOlyaChat, addMessageToFelixChat,
    setError 
  } = useGame();
  
  const [isChatLoading, setChatLoading] = useState(false);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chats = {
    bogdan: { history: bogdanChat, addMessage: addMessageToBogdanChat, title: "Богдан (CEO)" },
    olya: { history: olyaChat, addMessage: addMessageToOlyaChat, title: "Оля (Арт-директор)" },
    felix: { history: felixChat, addMessage: addMessageToFelixChat, title: "Феликс (Разработчик)" },
  };

  const { history, addMessage, title } = chats[person];

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: IMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');
    setChatLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person, history: [...history, userMessage] })
      });

      if (!response.ok) throw new Error('Собеседник не в настроении... Попробуйте позже.');

      const { reply } = await response.json();
      addMessage({ role: 'assistant', content: reply });

    } catch (error: any) {
      setError(error.message);
      addMessage({ role: 'assistant', content: `[Системная ошибка: ${error.message}]` });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg h-[70vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={closeChat}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {history.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
               {isChatLoading && (
                <div className="flex justify-start">
                    <div className="p-3 rounded-lg bg-secondary">
                        Печатает...
                    </div>
                </div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-full gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ваше сообщение..."
              disabled={isChatLoading}
            />
            <Button onClick={handleSend} disabled={isChatLoading}>
              Отправить
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chat;
