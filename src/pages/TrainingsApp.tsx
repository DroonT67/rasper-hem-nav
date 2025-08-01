import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface DayProgress {
  daily: boolean;
  mag: boolean;
  challenge: boolean;
  rest: boolean;
}

interface WeekProgress {
  [key: string]: DayProgress;
}

const TrainingsApp = () => {
  const [weekProgress, setWeekProgress] = useState<{ [week: number]: WeekProgress }>({});
  const [openWeeks, setOpenWeeks] = useState<{ [week: number]: boolean }>({ 1: true });
  const [savedSettings, setSavedSettings] = useState<any>({});

  const days = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
  const weeks = Array.from({ length: 10 }, (_, i) => i + 1);

  // Ladda sparade inställningar från localStorage
  useEffect(() => {
    const saved = localStorage.getItem('training-settings');
    if (saved) {
      try {
        setSavedSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Could not load training settings:', error);
      }
    }
  }, []);

  // Default veckostruktur som fallback
  const getDefaultWeekStructure = () => ({
    måndag: ["daily", "mag"],
    tisdag: ["daily", "challenge"],
    onsdag: ["daily", "mag"],
    torsdag: ["daily", "challenge"],
    fredag: ["daily", "mag"],
    lördag: ["daily"],
    söndag: ["rest"]
  });

  // Hämta veckostruktur från sparade inställningar eller använd default
  const getWeekStructure = (week: number) => {
    const weekData = savedSettings[week];
    if (weekData && weekData.schedule) {
      return weekData.schedule;
    }
    return getDefaultWeekStructure();
  };

  const getIcon = (dayTypes: string[], progress: DayProgress) => {
    if (dayTypes.includes("rest")) return "😴";
    
    const icons = [];
    if (dayTypes.includes("daily") && progress.daily) icons.push("🙌");
    if (dayTypes.includes("mag") && progress.mag) icons.push("💪");
    if (dayTypes.includes("challenge") && progress.challenge) icons.push("🔥");
    
    return icons.length > 0 ? icons.join(" ") : "○";
  };

  const toggleCompleted = (week: number, day: string, type: string) => {
    setWeekProgress(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        [day]: {
          ...prev[week]?.[day],
          [type]: !prev[week]?.[day]?.[type]
        } as DayProgress
      }
    }));
  };

  const getDayProgress = (week: number, day: string): DayProgress => {
    return weekProgress[week]?.[day] || { daily: false, mag: false, challenge: false, rest: false };
  };

  const toggleWeek = (week: number) => {
    setOpenWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary">Träning</h1>
          <Link to="/trainingsapp/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {weeks.map(week => {
              const structure = getWeekStructure(week);
              const isOpen = openWeeks[week];
              
              return (
                <div key={week} className="flex-shrink-0 w-80">
                  <Collapsible open={isOpen} onOpenChange={() => toggleWeek(week)}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between p-4 h-auto"
                      >
                        <span className="text-lg font-semibold">Vecka {week}</span>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-2">
                      <div className="bg-card p-4 rounded-lg border space-y-3">
                        {days.map(day => {
                          const dayTypes = structure[day];
                          const progress = getDayProgress(week, day);
                          
                          return (
                            <div key={day} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                              <div className="flex-1">
                                <span className="font-medium capitalize">{day}</span>
                                <div className="text-sm text-muted-foreground">
                                  {dayTypes.includes("rest") ? "Vilodag" : 
                                   dayTypes.filter(t => t !== "daily").map(t => 
                                     t === "mag" ? "Mage" : t === "challenge" ? "Utmaning" : ""
                                   ).filter(Boolean).join(", ")}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">
                                  {getIcon(dayTypes, progress)}
                                </span>
                                
                {!dayTypes.includes("rest") && (
                  <div className="flex flex-col space-y-1">
                    {dayTypes.includes("daily") && (
                      <Button 
                        size="sm" 
                        variant={progress.daily ? "default" : "outline"}
                        onClick={() => toggleCompleted(week, day, "daily")}
                        className="text-xs px-2 py-1"
                      >
                        Dagligt {progress.daily ? "✓" : "○"}
                      </Button>
                    )}
                    {dayTypes.includes("mag") && (
                      <Button 
                        size="sm" 
                        variant={progress.mag ? "default" : "outline"}
                        onClick={() => toggleCompleted(week, day, "mag")}
                        className="text-xs px-2 py-1"
                      >
                        Mage {progress.mag ? "✓" : "○"}
                      </Button>
                    )}
                    {dayTypes.includes("challenge") && (
                      <Button 
                        size="sm" 
                        variant={progress.challenge ? "default" : "outline"}
                        onClick={() => toggleCompleted(week, day, "challenge")}
                        className="text-xs px-2 py-1"
                      >
                        Utmaning {progress.challenge ? "✓" : "○"}
                      </Button>
                    )}
                  </div>
                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingsApp;