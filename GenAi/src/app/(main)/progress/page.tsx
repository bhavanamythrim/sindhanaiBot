import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressChart } from "./progress-chart";

export default function ProgressPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
        <header>
            <h1 className="text-3xl font-bold font-headline">My Progress</h1>
            <p className="text-muted-foreground">
                Track your emotional state over time. Data is stored only on your device.
            </p>
        </header>
        <Card>
            <CardHeader>
                <CardTitle>Sentiment History</CardTitle>
                <CardDescription>
                    This chart shows your average sentiment score for each day you've chatted.
                    Scores range from -1 (more negative) to 1 (more positive).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <ProgressChart />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
