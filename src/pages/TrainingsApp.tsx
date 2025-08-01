import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
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

  const days = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
  const weeks = Array.from({ length: 10 }, (_, i) => i + 1);

  // Exempel på veckostruktur - kan göras mer avancerad senare
  const getWeekStructure = (week: number) => {
    const structure: { [key: string]: string[] } = {};
    days.forEach((day, index) => {
      const dayTypes = ["daily"];
      
      // Vilodag varje söndag
      if (index === 6) {
        dayTypes.splice(0, 1, "rest");
      }
      
      // Magpass 3 gånger/vecka (måndag, onsdag, fredag)
      if (index === 0 || index === 2 || index === 4) {
        dayTypes.push("mag");
      }
      
      // Utmaningar 2 gånger/vecka (tisdag, torsdag)
      if (index === 1 || index === 3) {
        dayTypes.push("challenge");
      }
      
      structure[day] = dayTypes;
    });
    return structure;
  };

  const getIcon = (dayTypes: string[], progress: DayProgress) => {
    if (dayTypes.includes("rest")) return "😴";
    
    const icons = [];
    if (dayTypes.includes("daily") && progress.daily) icons.push("🙌");
    if (dayTypes.includes("mag") && progress.mag) icons.push("💪");
    if (dayTypes.includes("challenge") && progress.challenge) icons.push("🔥");
    
    return icons.length > 0 ? icons.join(" ") : "○";
  };

  const markCompleted = (week: number, day: string, type: string) => {
    setWeekProgress(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        [day]: {
          ...prev[week]?.[day],
          [type]: true
        } as DayProgress
      }
    }));
  };

  const getDayProgress = (week: number, day: string): DayProgress => {
    return weekProgress[week]?.[day] || { daily: false, mag: false, challenge: false, rest: false };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary">Träningsschema</h1>
          <Link to="/trainingsapp/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-8 min-w-max">
            {weeks.map(week => {
              const structure = getWeekStructure(week);
              return (
                <div key={week} className="bg-card p-6 rounded-lg border min-w-[300px]">
                  <h2 className="text-xl font-semibold mb-4 text-center">Vecka {week}</h2>
                  <div className="space-y-3">
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
                                 t === "mag" ? "Mag" : t === "challenge" ? "Utmaning" : ""
                               ).filter(Boolean).join(", ")}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                              {getIcon(dayTypes, progress)}
                            </span>
                            
                            {!dayTypes.includes("rest") && (
                              <div className="flex flex-col space-y-1">
                                {dayTypes.includes("daily") && !progress.daily && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => markCompleted(week, day, "daily")}
                                    className="text-xs px-2 py-1"
                                  >
                                    Dagligt ✓
                                  </Button>
                                )}
                                {dayTypes.includes("mag") && !progress.mag && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => markCompleted(week, day, "mag")}
                                    className="text-xs px-2 py-1"
                                  >
                                    Mag ✓
                                  </Button>
                                )}
                                {dayTypes.includes("challenge") && !progress.challenge && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => markCompleted(week, day, "challenge")}
                                    className="text-xs px-2 py-1"
                                  >
                                    Utmaning ✓
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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