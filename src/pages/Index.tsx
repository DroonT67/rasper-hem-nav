import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center px-6">
          <h1 className="font-arial text-6xl md:text-8xl font-normal text-brand-primary mb-8 tracking-wide">
            Rasper
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Välkommen till Rasper - din plattform för träning, vinkällare och mycket mer.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
