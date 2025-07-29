import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const achievements = [
    {
      title: "Инновационные технологии",
      description: "Используем самые обсуждаемые технологии, чтобы ваши деньги были вложены в 'будущее'.",
      icon: "🚀"
    },
    {
      title: "Индивидуальный подход",
      description: "Каждый проект для нас — это новый способ рассказать, почему нам нужно еще немного времени и средств.",
      icon: "🎨"
    },
    {
      title: "Гибкие сроки",
      description: "Мы не верим в дедлайны. Настоящее искусство требует времени. И денег. В основном денег.",
      icon: "⚡"
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            О Студии GameNot
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Мы - легендарная игровая студия из города Днепр. Наша миссия - брать деньги на создание игр. Просто брать деньги.
          </p>
          <div className="text-lg text-foreground/70 max-w-4xl mx-auto">
            За годы нашей работы мы накопили огромный опыт в получении финансирования. Мы знаем, как сделать вашу идею... источником нашего дохода.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <Card key={index} className="text-center hover:border-primary/50 transition-all duration-300 bg-background/50">
              <CardHeader>
                <div className="text-4xl mb-4">{item.icon}</div>
                <CardTitle className="text-xl mb-4 text-primary">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;