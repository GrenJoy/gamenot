import { GameCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Богдан",
      role: "Генеральный директор",
      description: "Визионер и лидер студии с неограниченными амбициями",
      color: "neon-purple"
    },
    {
      name: "Оля",
      role: "Главный художник",
      description: "Создает невероятные визуальные миры",
      color: "neon-green"
    },
    {
      name: "Феликс",
      role: "Ведущий разработчик",
      description: "Мастер кода и архитектуры игр",
      color: "neon-blue"
    }
  ];

  return (
    <section id="team" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Наша команда
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Профессионалы высочайшего уровня, создающие игры будущего
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <GameCard key={index} className="text-center hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className={`w-20 h-20 rounded-full bg-gradient-hero mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-${member.color}`}>
                  {member.name[0]}
                </div>
                <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                <div className={`text-${member.color} font-semibold mb-4`}>{member.role}</div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{member.description}</p>
              </CardContent>
            </GameCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;