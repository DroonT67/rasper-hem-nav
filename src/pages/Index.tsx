import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center px-6">
          <img 
            src="/lovable-uploads/96fea96a-f4ad-4429-abab-b36bdd0926bd.png" 
            alt="Rasper" 
            className="mx-auto mb-8 h-64 w-auto"
          />
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Välkommen till Rasper - din plattform för träning, vinkällare och mycket mer.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
