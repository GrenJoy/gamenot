import { GameCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const achievements = [
    {
      title: "Инновационные технологии",
      description: "Используем передовые движки и собственные разработки для создания уникального геймплея",
      icon: "🚀"
    },
    {
      title: "Индивидуальный подход",
      description: "Каждый проект - это уникальное произведение искусства, созданное специально для вас",
      icon: "🎨"
    },
    {
      title: "Быстрая разработка",
      description: "Благодаря нашему опыту мы можем создать игру вашей мечты в кратчайшие сроки",
      icon: "⚡"
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-secondary/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            О студии GameNot
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Мы - ведущая игровая студия из Днепро, которая революционизирует индустрию разработки игр. 
            Наша миссия - создавать игры, которые меняют жизни и приносят невероятную прибыль.
          </p>
          <div className="text-lg text-foreground/70 max-w-4xl mx-auto">
            За годы нашей работы мы накопили огромный опыт в создании самых разнообразных игровых проектов. 
            От мобильных казуальных игр до масштабных AAA-проектов - мы знаем, как сделать вашу игру успешной.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <GameCard key={index} className="text-center hover:border-neon-green/50 transition-all duration-300">
              <CardHeader>
                <div className="text-4xl mb-4">{item.icon}</div>
                <CardTitle className="text-xl mb-4 text-neon-green">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{item.description}</p>
              </CardContent>
            </GameCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;