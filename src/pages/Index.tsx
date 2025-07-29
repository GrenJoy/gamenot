import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import OrderForm from "@/components/OrderForm";
import GamePlanPage from "./GamePlanPage"; // Мы создадим этот компонент
import { useGame } from "@/context/GameContext";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { gamePlan, isLoading } = useGame();

  // Пока идет загрузка после отправки формы, показываем скелет
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="space-y-8">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <div className="space-y-4 mt-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если план игры получен, показываем страницу с планом
  if (gamePlan) {
    return <GamePlanPage />;
  }

  // Иначе показываем главную страницу с формой заказа
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <AboutSection />
      <TeamSection />
      <OrderForm />
    </div>
  );
};

export default Index;

