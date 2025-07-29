import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NeonCard, GameCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface GameProject {
  name: string;
  genre: string;
  description: string;
  aiResponse: {
    title: string;
    message: string;
    timeline: string;
    expectedProfit: string;
    nextStep: string;
  };
  payments: Array<{
    amount: number;
    date: string;
    response: string;
  }>;
  totalPaid: number;
}

const GamePlan = () => {
  const [project, setProject] = useState<GameProject | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProject = localStorage.getItem('gameProject');
    if (!savedProject) {
      navigate('/');
      return;
    }
    setProject(JSON.parse(savedProject));
  }, [navigate]);

  const handlePayment = () => {
    navigate('/payment');
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Ваш план разработки готов!
          </h1>
          <p className="text-xl text-neon-green">
            От лица компании GameNot - Богдан, Генеральный директор
          </p>
        </div>

        <NeonCard className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-neon-purple">
              {project.aiResponse.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {project.aiResponse.message}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GameCard className="text-center">
                <CardHeader>
                  <CardTitle className="text-neon-green">Сроки разработки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neon-green">{project.aiResponse.timeline}</div>
                </CardContent>
              </GameCard>
              
              <GameCard className="text-center">
                <CardHeader>
                  <CardTitle className="text-neon-blue">Ожидаемая прибыль</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neon-blue">{project.aiResponse.expectedProfit}</div>
                </CardContent>
              </GameCard>
            </div>

            <div className="bg-gradient-card border border-neon-purple/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-neon-purple mb-4">Следующий шаг:</h3>
              <p className="text-foreground/90 mb-6">{project.aiResponse.nextStep}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="cyber" size="lg" onClick={handlePayment}>
                  Перевести деньги в компанию GameNot
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Вернуться на главную
                </Button>
              </div>
            </div>
          </CardContent>
        </NeonCard>

        {project.payments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">История платежей</h2>
            {project.payments.map((payment, index) => (
              <GameCard key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-bold text-neon-green">
                        Платеж: ${payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-foreground/70">{payment.date}</div>
                    </div>
                  </div>
                  <div className="text-foreground/90 whitespace-pre-line">
                    {payment.response}
                  </div>
                </CardContent>
              </GameCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlan;