import Navigation from "@/components/Navigation";

const Vinkallare = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center px-6">
          <h1 className="font-arial text-6xl md:text-8xl font-normal text-brand-primary mb-8 tracking-wide">
            Vinkällare
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Här kommer din digitala vinkällare att ta form.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Vinkallare;