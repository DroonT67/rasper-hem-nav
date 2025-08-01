import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface Exercise {
  id: string;
  name: string;
  icon?: string;
}

const TrainingsSettings = () => {
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([
    { id: "1", name: "Armhävningar", icon: "🙌" },
    { id: "2", name: "Plankan", icon: "🙌" },
    { id: "3", name: "Burpees", icon: "🙌" },
  ]);

  const [magExercises, setMagExercises] = useState<Exercise[]>([
    { id: "1", name: "Sit-ups", icon: "💪" },
    { id: "2", name: "Crunches", icon: "💪" },
    { id: "3", name: "Magcyklar", icon: "💪" },
  ]);

  const [challengeExercises, setChallengeExercises] = useState<Exercise[]>([
    { id: "1", name: "5km löpning", icon: "🔥" },
    { id: "2", name: "100 burpees", icon: "🔥" },
  ]);

  const [newExerciseName, setNewExerciseName] = useState("");

  const addExercise = (type: "daily" | "mag" | "challenge") => {
    if (!newExerciseName.trim()) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName.trim(),
      icon: type === "daily" ? "🙌" : type === "mag" ? "💪" : "🔥"
    };

    if (type === "daily") {
      setDailyExercises(prev => [...prev, newExercise]);
    } else if (type === "mag") {
      setMagExercises(prev => [...prev, newExercise]);
    } else {
      setChallengeExercises(prev => [...prev, newExercise]);
    }

    setNewExerciseName("");
  };

  const removeExercise = (type: "daily" | "mag" | "challenge", id: string) => {
    if (type === "daily") {
      setDailyExercises(prev => prev.filter(ex => ex.id !== id));
    } else if (type === "mag") {
      setMagExercises(prev => prev.filter(ex => ex.id !== id));
    } else {
      setChallengeExercises(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const moveExercise = (type: "daily" | "mag" | "challenge", fromIndex: number, toIndex: number) => {
    const lists = {
      daily: [dailyExercises, setDailyExercises],
      mag: [magExercises, setMagExercises],
      challenge: [challengeExercises, setChallengeExercises]
    };

    const [exercises, setExercises] = lists[type] as [Exercise[], React.Dispatch<React.SetStateAction<Exercise[]>>];
    const newExercises = [...exercises];
    const [movedItem] = newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, movedItem);
    setExercises(newExercises);
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
        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div key={exercise.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <span className="flex-1">{exercise.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeExercise(type, exercise.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Nytt pass..."
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExercise(type)}
          />
          <Button onClick={() => addExercise(type)} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
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

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <ExerciseList
            title="Dagliga pass"
            exercises={dailyExercises}
            type="daily"
            icon="🙌"
          />
          
          <ExerciseList
            title="Magpass"
            exercises={magExercises}
            type="mag"
            icon="💪"
          />
          
          <ExerciseList
            title="Utmaningar"
            exercises={challengeExercises}
            type="challenge"
            icon="🔥"
          />
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Tips: Dra övningarna för att ändra ordning. Lägg till nya pass med +-knappen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingsSettings;