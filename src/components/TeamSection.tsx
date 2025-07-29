import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Богдан",
      role: "Генеральный директор",
      description: "Гений финансовых потоков и мастер убеждения. Умеет говорить со спонсорами и всегда знает, как 'оптимизировать' бюджет.",
      color: "primary"
    },
    {
      name: "Оля",
      role: "Главный художник",
      description: "Ее вдохновение так же непредсказуемо, как и погода. Может неделями играть в LoL, а потом за ночь нарисовать шедевр.",
      color: "accent"
    },
    {
      name: "Феликс",
      role: "Ведущий разработчик",
      description: "Мастер кода, который ненавидит, когда его отвлекают. Предпочитает общению с людьми многочасовые рейды в MMO.",
      color: "secondary-foreground"
    }
  ];

  return (
    <section id="team" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Наша Команда
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Люди, которые превратят ваши деньги... в игру. Наверное.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:scale-105 transition-transform duration-300 bg-secondary/30">
              <CardHeader>
                <div className={`w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-${member.color}`}>
                  {member.name[0]}
                </div>
                <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                <div className={`text-${member.color} font-semibold mb-4`}>{member.role}</div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;