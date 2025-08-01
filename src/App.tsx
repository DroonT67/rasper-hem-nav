import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrainingsApp from "./pages/TrainingsApp";
import TrainingsSettings from "./pages/TrainingsSettings";
import Vinkallare from "./pages/Vinkallare";
import Anmalan from "./pages/Anmalan";
import KnappN from "./pages/KnappN";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trainingsapp" element={<TrainingsApp />} />
          <Route path="/trainingsapp/settings" element={<TrainingsSettings />} />
          <Route path="/vinkallare" element={<Vinkallare />} />
          <Route path="/anmalan" element={<Anmalan />} />
          <Route path="/knapp-n" element={<KnappN />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
