import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain, BatteryCharging } from "lucide-react";

const breakTechniques = [
  {
    icon: Zap,
    title: "The Pomodoro Technique",
    steps: [
      "Choose a task to work on.",
      "Set a timer for 25 minutes.",
      "Work on the task without interruption.",
      "When the timer rings, take a 5-minute break.",
      "After four 'Pomodoros', take a longer 15-30 minute break."
    ],
    benefit: "Maintains high focus while preventing burnout."
  },
  {
    icon: Brain,
    title: "The 50/10 Rule",
    steps: [
      "Work for 50 minutes with focus.",
      "Take a 10-minute break to completely disconnect.",
      "During the break, walk around, stretch, or listen to music.",
      "Repeat the cycle."
    ],
    benefit: "Ideal for tasks that require longer periods of deep concentration."
  },
  {
    icon: BatteryCharging,
    title: "The 'Just 5 Minutes' Rule",
    steps: [
      "Feeling stuck or unmotivated? Commit to working on a task for just 5 minutes.",
      "After 5 minutes, you can stop if you want.",
      "Often, starting is the hardest part, and you'll continue working.",
      "If you stop, you've still made 5 minutes of progress!"
    ],
    benefit: "Excellent for overcoming procrastination and building momentum."
  }
];

export default function BreaksPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Mindful Break Techniques</h1>
        <p className="text-muted-foreground">
          Incorporate these simple break routines into your day to manage stress, stay focused, and prevent burnout.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {breakTechniques.map((technique, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <technique.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{technique.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {technique.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </CardContent>
            <CardFooter>
                <p className="text-sm font-semibold text-primary">{technique.benefit}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
