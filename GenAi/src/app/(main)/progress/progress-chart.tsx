'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { ProgressRecord } from '@/lib/types';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  sentiment: {
    label: "Sentiment",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ProgressChart() {
  const [data, setData] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('sindhanaibot-progress');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to read progress from localStorage:", error);
    }
  }, []);

  if (data.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            No progress data yet. Start chatting to see your sentiment history.
        </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={[-1, 1]} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
            content={<ChartTooltipContent />} 
           />
          <Bar dataKey="sentiment" fill="var(--color-sentiment)" radius={4} />
        </BarChart>
    </ChartContainer>
  );
}
