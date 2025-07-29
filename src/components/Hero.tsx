import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToForm = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
      <div className="absolute inset-0 bg-gradient-glow" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
          GameNot Studio
        </h1>
        <h2 className="text-2xl md:text-3xl mb-4 text-neon-green font-semibold">
          Днепро • Украина
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
          Ведущая студия разработки игр с революционным подходом к созданию 
          незабываемых игровых миров
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="cyber" size="hero" onClick={scrollToForm}>
            Создать свою игру
          </Button>
          <Button variant="neon" size="hero">
            Посмотреть портфолио
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-purple mb-2">50+</div>
            <div className="text-foreground/70">Проектов в разработке</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-green mb-2">8 лет</div>
            <div className="text-foreground/70">Опыта на рынке</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-blue mb-2">100%</div>
            <div className="text-foreground/70">Гарантия качества</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;