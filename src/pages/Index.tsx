import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import OrderForm from "@/components/OrderForm";

const Index = () => {
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
