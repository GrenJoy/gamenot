import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/context/GameContext";

// В будущем вы замените это на URL вашего развернутого бэкенда на Render
const API_URL = "https://gamenot.onrender.com"; 

const OrderForm = () => {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const { setGamePlan, setLoading, setError, setUserName, setGameDescription, addMessageToHistory, isLoading } = useGame();
  const { toast } = useToast();

  const genres = [
    "RPG", "Шутер", "Стратегия", "Платформер", "Головоломка", 
    "Симулятор", "Гонки", "Файтинг", "Хоррор", "Приключения"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !genre || !description) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, genre, description })
      });

      if (!response.ok) {
        throw new Error('Не удалось получить ответ от нашего гениального гендиректора.');
      }

      const plan = await response.json();
      
      // Сохраняем все в нашем глобальном состоянии
      setUserName(name);
      setGameDescription(`Жанр: ${genre}. Описание: ${description}`);
      setGamePlan(plan);
      // Добавляем ответ Богдана в общую историю как чистый объект
      addMessageToHistory({ role: 'assistant', content: plan });

    } catch (error: any) {
      const errorMessage = error.message || "Что-то пошло не так. Возможно, наши сервера сейчас отдыхают.";
      setError(errorMessage);
      toast({
        title: "Произошла ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order-form" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Создайте Игру Вашей Мечты
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Доверьтесь профессионалам из GameNot. Мы знаем, как делать хиты.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-secondary/30 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-primary">
              Заявка на разработку
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Ваше имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться?"
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="genre">Жанр будущей игры</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="mt-2 bg-background/50 border-primary/20 focus:border-primary">
                    <SelectValue placeholder="Выберите жанр" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Расскажите немного об игре</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите вашу идею: сюжет, механики, особенности..."
                  rows={4}
                  className="mt-2 bg-background/50 border-primary/20 focus:border-primary resize-none"
                />
              </div>

              <Button 
                type="submit" 
                variant="default" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Анализируем вашу гениальную идею..." : "Получить план разработки"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderForm;