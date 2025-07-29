import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NeonCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const genres = [
    "RPG", "Шутер", "Стратегия", "Платформер", "Головоломка", 
    "Симулятор", "Гонки", "Файтинг", "Хоррор", "Приключения"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.genre || !formData.description) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Генерируем обманчивый ответ от Deepseek
      const response = await generateGamePlan(formData);
      
      // Сохраняем данные в localStorage для следующих страниц
      localStorage.setItem('gameProject', JSON.stringify({
        ...formData,
        aiResponse: response,
        payments: [],
        totalPaid: 0
      }));
      
      // Переходим на страницу результата
      navigate('/game-plan');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обработать заявку. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateGamePlan = async (data: typeof formData) => {
    // Симулируем API вызов к Deepseek
    // В реальной версии здесь будет запрос к Deepseek API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      title: `${data.genre} игра "${data.name} Project"`,
      message: `Дорогой ${data.name}! Спасибо что выбрали нашу компанию GameNot! Ваша ${data.genre.toLowerCase()} игра будет иметь безусловный геймплей и денежный успех! 
      
      Я, Богдан, гендиректор компании, лично контролирую процесс разработки. Наш ведущий разработчик Феликс уже начал работу над архитектурой, а художница Оля создает концепт-арты. 
      
      По нашим расчетам, ваша игра принесет минимум 500% прибыли в первый год! Мы составили детальный план - игра будет готова всего за 1 месяц!`,
      timeline: "1 месяц до релиза",
      expectedProfit: "500%+ прибыли",
      nextStep: "Для начала разработки необходим стартовый взнос в размере $10,000"
    };
  };

  return (
    <section id="order-form" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Создайте игру своей мечты
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Расскажите нам о своей идее, и мы превратим её в невероятную игру
          </p>
        </div>

        <NeonCard className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-neon-purple">
              Заявка на разработку игры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground">Ваше имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Как к вам обращаться?"
                  className="mt-2 bg-secondary/50 border-primary/20 focus:border-neon-purple"
                />
              </div>

              <div>
                <Label htmlFor="genre" className="text-foreground">Игру в каком жанре вы хотите заказать у нашей славной компании?</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
                  <SelectTrigger className="mt-2 bg-secondary/50 border-primary/20 focus:border-neon-purple">
                    <SelectValue placeholder="Выберите жанр вашей будущей игры" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Расскажите немного об игре</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Опишите вашу идею: сюжет, механики, особенности..."
                  rows={4}
                  className="mt-2 bg-secondary/50 border-primary/20 focus:border-neon-purple resize-none"
                />
              </div>

              <Button 
                type="submit" 
                variant="cyber" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Анализируем вашу идею..." : "Получить план разработки"}
              </Button>
            </form>
          </CardContent>
        </NeonCard>
      </div>
    </section>
  );
};

export default OrderForm;