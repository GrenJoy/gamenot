import { Button } from "@/components/ui/button";
import logo from "@/assets/gamenot-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="GameNot" className="w-10 h-10" />
          <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            GameNot Studio
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-foreground/80 hover:text-neon-purple transition-colors">О нас</a>
          <a href="#team" className="text-foreground/80 hover:text-neon-purple transition-colors">Команда</a>
          <a href="#portfolio" className="text-foreground/80 hover:text-neon-purple transition-colors">Портфолио</a>
          <a href="#contact" className="text-foreground/80 hover:text-neon-purple transition-colors">Контакты</a>
        </nav>

        <Button variant="cyber" size="sm">
          Заказать игру
        </Button>
      </div>
    </header>
  );
};

export default Header;