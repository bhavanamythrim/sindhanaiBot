import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Pencil, Sun } from "lucide-react";

const challenges = [
  {
    icon: Sun,
    title: "Three Good Things",
    description: "At the end of your day, take a moment to write down three things that went well and why. It helps shift focus towards positivity."
  },
  {
    icon: CheckCircle2,
    title: "1-Minute Breathing",
    description: "Feeling overwhelmed? Pause and take one minute to focus on your breath. Inhale for 4 seconds, hold for 4, and exhale for 6. Repeat."
  },
  {
    icon: Pencil,
    title: "Journal a Feeling",
    description: "Pick one emotion you're feeling right now. Write about it for five minutes without judgment. Explore where it comes from and how it feels in your body."
  }
];

export default function ChallengesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Emotional Growth Challenges</h1>
        <p className="text-muted-foreground">
          Small, actionable quests to help you build self-awareness and resilience.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <challenge.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{challenge.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
