import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface Exercise {
  id: string;
  name: string;
  content: string;
  rounds: number;
  icon?: string;
}

interface WeekSchedule {
  [day: string]: string[]; // array of exercise types for each day
}

interface WeekData {
  dailyExercises: Exercise[];
  magExercises: Exercise[];
  challengeExercises: Exercise[];
  schedule: WeekSchedule;
}

const TrainingsSettings = () => {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [weekData, setWeekData] = useState<{ [weekNumber: number]: WeekData }>({});
  
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseContent, setNewExerciseContent] = useState("");
  const [newExerciseRounds, setNewExerciseRounds] = useState(1);

  const days = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
  const exerciseTypes = [
    { value: "daily", label: "Dagligt pass", icon: "🙌" },
    { value: "mag", label: "Magepass", icon: "💪" },
    { value: "challenge", label: "Utmaning", icon: "🔥" },
    { value: "rest", label: "Vilodag", icon: "😴" }
  ];

  // Default data för nya veckor
  const getDefaultWeekData = (): WeekData => ({
    dailyExercises: [
      { id: "1", name: "Armhävningar", content: "Armhävningar 3 × 10", rounds: 1, icon: "🙌" },
      { id: "2", name: "Plankan", content: "Plankan 30 sekunder", rounds: 1, icon: "🙌" },
      { id: "3", name: "Burpees", content: "Burpees 3 × 5", rounds: 1, icon: "🙌" },
    ],
    magExercises: [
      { id: "1", name: "Sit-ups", content: "Sit-ups 3 × 15", rounds: 2, icon: "💪" },
      { id: "2", name: "Crunches", content: "Crunches 3 × 12", rounds: 2, icon: "💪" },
      { id: "3", name: "Magcyklar", content: "Magcyklar 3 × 10", rounds: 2, icon: "💪" },
    ],
    challengeExercises: [
      { id: "1", name: "5km löpning", content: "5km löpning i egen takt", rounds: 1, icon: "🔥" },
      { id: "2", name: "100 burpees", content: "100 burpees totalt", rounds: 1, icon: "🔥" },
    ],
    schedule: {
      måndag: ["daily", "mag"],
      tisdag: ["daily", "challenge"],
      onsdag: ["daily", "mag"],
      torsdag: ["daily", "challenge"],
      fredag: ["daily", "mag"],
      lördag: ["daily"],
      söndag: ["rest"]
    }
  });

  // Ladda data från localStorage vid start
  useEffect(() => {
    const saved = localStorage.getItem('training-settings');
    if (saved) {
      try {
        setWeekData(JSON.parse(saved));
      } catch (error) {
        console.error('Could not load training settings:', error);
      }
    }
  }, []);

  // Spara data till localStorage när weekData ändras
  useEffect(() => {
    if (Object.keys(weekData).length > 0) {
      localStorage.setItem('training-settings', JSON.stringify(weekData));
    }
  }, [weekData]);

  // Hämta aktuell veckodata
  const getCurrentWeekData = (): WeekData => {
    return weekData[currentWeek] || getDefaultWeekData();
  };

  // Uppdatera veckodata
  const updateWeekData = (data: Partial<WeekData>) => {
    setWeekData(prev => ({
      ...prev,
      [currentWeek]: {
        ...getCurrentWeekData(),
        ...data
      }
    }));
  };

  const currentData = getCurrentWeekData();

  const addExercise = (type: "daily" | "mag" | "challenge") => {
    if (!newExerciseName.trim() || !newExerciseContent.trim()) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName.trim(),
      content: newExerciseContent.trim(),
      rounds: newExerciseRounds,
      icon: type === "daily" ? "🙌" : type === "mag" ? "💪" : "🔥"
    };

    const currentData = getCurrentWeekData();
    
    if (type === "daily") {
      updateWeekData({ dailyExercises: [...currentData.dailyExercises, newExercise] });
    } else if (type === "mag") {
      updateWeekData({ magExercises: [...currentData.magExercises, newExercise] });
    } else {
      updateWeekData({ challengeExercises: [...currentData.challengeExercises, newExercise] });
    }

    setNewExerciseName("");
    setNewExerciseContent("");
    setNewExerciseRounds(1);
  };

  const removeExercise = (type: "daily" | "mag" | "challenge", id: string) => {
    const currentData = getCurrentWeekData();
    
    if (type === "daily") {
      updateWeekData({ dailyExercises: currentData.dailyExercises.filter(ex => ex.id !== id) });
    } else if (type === "mag") {
      updateWeekData({ magExercises: currentData.magExercises.filter(ex => ex.id !== id) });
    } else {
      updateWeekData({ challengeExercises: currentData.challengeExercises.filter(ex => ex.id !== id) });
    }
  };

  const updateDaySchedule = (day: string, types: string[]) => {
    const currentData = getCurrentWeekData();
    updateWeekData({ 
      schedule: {
        ...currentData.schedule,
        [day]: types
      }
    });
  };

  const toggleDayType = (day: string, type: string) => {
    const currentData = getCurrentWeekData();
    const currentTypes = currentData.schedule[day] || [];
    let newTypes;
    
    if (type === "rest") {
      newTypes = currentTypes.includes("rest") ? [] : ["rest"];
    } else {
      newTypes = currentTypes.filter(t => t !== "rest");
      if (currentTypes.includes(type)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes = [...newTypes, type];
      }
    }
    
    updateDaySchedule(day, newTypes);
  };

  const ExerciseList = ({ 
    title, 
    exercises, 
    type, 
    icon 
  }: { 
    title: string; 
    exercises: Exercise[]; 
    type: "daily" | "mag" | "challenge";
    icon: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <div key={exercise.id} className="p-3 bg-muted/50 rounded border">
              <div className="flex items-start gap-2 mb-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mt-1" />
                <div className="flex-1">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{exercise.content}</div>
                  <div className="text-xs text-muted-foreground mt-1">Varv: {exercise.rounds}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeExercise(type, exercise.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 border-t pt-4">
          <Textarea
            placeholder="Passnamn..."
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            rows={2}
          />
          <Textarea
            placeholder="Innehåll (t.ex. Armhävningar 3 × 10)..."
            value={newExerciseContent}
            onChange={(e) => setNewExerciseContent(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Varv"
              value={newExerciseRounds}
              onChange={(e) => setNewExerciseRounds(Number(e.target.value))}
              min={1}
              className="w-20"
            />
            <Button onClick={() => addExercise(type)} size="sm" className="flex-1">
              <Plus className="h-4 w-4 mr-1" />
              Lägg till
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/trainingsapp">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-brand-primary">Inställningar</h1>
        </div>

        {/* Veckoväljare */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vecka och Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Aktuell vecka</label>
                <Select value={currentWeek.toString()} onValueChange={(value) => setCurrentWeek(Number(value))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(week => (
                      <SelectItem key={week} value={week.toString()}>
                        Vecka {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Schema för vecka {currentWeek}</label>
                <div className="grid gap-2">
                  {days.map(day => (
                    <div key={day} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <span className="w-20 capitalize font-medium">{day}</span>
                      <div className="flex flex-wrap gap-1">
                        {exerciseTypes.map(({ value, label, icon }) => {
                          const isSelected = currentData.schedule[day]?.includes(value);
                          return (
                            <Button
                              key={value}
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => toggleDayType(day, value)}
                              className="h-7 text-xs"
                            >
                              {icon} {label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <ExerciseList
            title="Dagliga pass"
            exercises={currentData.dailyExercises}
            type="daily"
            icon="🙌"
          />
          
          <ExerciseList
            title="Magepass"
            exercises={currentData.magExercises}
            type="mag"
            icon="💪"
          />
          
          <ExerciseList
            title="Utmaningar"
            exercises={currentData.challengeExercises}
            type="challenge"
            icon="🔥"
          />
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Tips: Dra övningarna för att ändra ordning. Specificera antal varv för varje pass.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingsSettings;