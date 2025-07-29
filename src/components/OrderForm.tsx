import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NeonCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
    
    // Симуляция отправки формы
    setTimeout(() => {
      toast({
        title: "Заявка отправлена!",
        description: "Наш менеджер свяжется с вами в ближайшее время",
      });
      
      // Здесь будет логика для отправки в DeepSeek API
      console.log("Form data:", formData);
      setIsSubmitting(false);
    }, 2000);
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
                <Label htmlFor="genre" className="text-foreground">Жанр игры</Label>
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
                <Label htmlFor="description" className="text-foreground">Расскажите об игре</Label>
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
                {isSubmitting ? "Отправляется..." : "Получить план разработки"}
              </Button>
            </form>
          </CardContent>
        </NeonCard>
      </div>
    </section>
  );
};

export default OrderForm;