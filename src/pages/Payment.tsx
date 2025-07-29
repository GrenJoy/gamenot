import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeonCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface GameProject {
  name: string;
  genre: string;
  description: string;
  aiResponse: any;
  payments: Array<{
    amount: number;
    date: string;
    response: string;
  }>;
  totalPaid: number;
}

const Payment = () => {
  const [amount, setAmount] = useState("10000");
  const [isProcessing, setIsProcessing] = useState(false);
  const [project, setProject] = useState<GameProject | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedProject = localStorage.getItem('gameProject');
    if (!savedProject) {
      navigate('/');
      return;
    }
    setProject(JSON.parse(savedProject));
  }, [navigate]);

  const generateScamResponse = async (paymentAmount: number, totalPaid: number) => {
    // Симулируем API вызов к Deepseek для генерации обманчивого ответа
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      `Отлично, ${project?.name}! Ваш платеж в размере $${paymentAmount.toLocaleString()} получен! Феликс уже приступил к финальной стадии разработки. Игра почти готова - осталось всего 2 недели! Но для полировки геймплея нам потребуется еще $15,000. Это последний платеж, обещаю!`,
      
      `Спасибо за перевод $${paymentAmount.toLocaleString()}! Оля завершила все арты, выглядит потрясающе! Мы на 95% готовы к релизу. Но возникла небольшая техническая проблема с оптимизацией. Нужно еще $20,000 для финального тестирования. После этого игра точно выйдет!`,
      
      `Превосходно! Ваши $${paymentAmount.toLocaleString()} позволили нам довести игру до состояния альфа-версии! Уже можно играть! Но для выхода в Steam нужна сертификация и маркетинг. Всего $25,000 и через месяц ваша игра будет приносить миллионы!`,
      
      `Замечательно! Благодаря вашему вкладу в $${paymentAmount.toLocaleString()} мы прошли сертификацию! Но издатель требует дополнительные фичи для гарантированного успеха. Инвестируйте еще $30,000 и ваша игра станет хитом года!`,
      
      `Фантастика! С вашими $${paymentAmount.toLocaleString()} мы добавили все фичи! Игра готова на 99.9%! Осталась только локализация на другие языки для мирового релиза. $35,000 и мы завоюем весь мир!`
    ];
    
    const responseIndex = Math.min(project?.payments.length || 0, responses.length - 1);
    return responses[responseIndex];
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentAmount = parseInt(amount);
    if (!paymentAmount || paymentAmount < 1000) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма платежа $1,000",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const scamResponse = await generateScamResponse(paymentAmount, project?.totalPaid || 0);
      
      const newPayment = {
        amount: paymentAmount,
        date: new Date().toLocaleDateString('ru-RU'),
        response: scamResponse
      };

      const updatedProject = {
        ...project!,
        payments: [...(project?.payments || []), newPayment],
        totalPaid: (project?.totalPaid || 0) + paymentAmount
      };

      localStorage.setItem('gameProject', JSON.stringify(updatedProject));
      
      toast({
        title: "Платеж обработан!",
        description: `Успешно переведено $${paymentAmount.toLocaleString()}`,
      });

      navigate('/game-plan');
    } catch (error) {
      toast({
        title: "Ошибка платежа",
        description: "Не удалось обработать платеж. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Перевести деньги в GameNot
          </h1>
          <p className="text-xl text-foreground/80">
            Инвестируйте в будущий хит!
          </p>
        </div>

        <NeonCard>
          <CardHeader>
            <CardTitle className="text-center text-2xl text-neon-purple">
              Платежная форма
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-gradient-card rounded-lg border border-neon-green/30">
              <h3 className="text-lg font-bold text-neon-green mb-2">Ваш проект:</h3>
              <p className="text-foreground/90">{project.aiResponse.title}</p>
              <p className="text-sm text-foreground/70 mt-2">
                Уже инвестировано: ${project.totalPaid.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-foreground">
                  Сумма перевода (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                  min="1000"
                  step="1000"
                  className="mt-2 bg-secondary/50 border-primary/20 focus:border-neon-purple text-lg"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Минимальная сумма: $1,000
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neon-green">
                  Рекомендуемые суммы:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[10000, 15000, 25000, 50000].map((suggested) => (
                    <Button
                      key={suggested}
                      type="button"
                      variant="game"
                      onClick={() => setAmount(suggested.toString())}
                      className="text-sm"
                    >
                      ${suggested.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                variant="cyber" 
                size="lg" 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? "Обрабатываем платеж..." : `Перевести $${parseInt(amount || "0").toLocaleString()}`}
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/game-plan')}
                className="w-full"
              >
                Вернуться к плану
              </Button>
            </form>
          </CardContent>
        </NeonCard>
      </div>
    </div>
  );
};

export default Payment;