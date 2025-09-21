'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Wind,
  Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { aiEmpathyInChat } from '@/ai/flows/ai-empathy-in-chat';
import { detectDistress } from '@/ai/flows/distress-detection';
import { moodToMusic } from '@/ai/flows/mood-to-music';
import { improveAIEmpatheticAbility } from '@/ai/flows/improve-ai-empathy';
import type { Message, ProgressRecord } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BotIcon, UserIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const WelcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm SindhanaiBot, your empathetic companion. Feel free to share what's on your mind. I'm here to listen without judgment.",
};

const VentModeMessage: Message = {
    id: 'vent-mode-on',
    role: 'assistant',
    content: "Safe Vent Mode is on. I'm here to listen. Let it all out.",
};

const VentModeOffMessage: Message = {
    id: 'vent-mode-off',
    role: 'assistant',
    content: "Vent Mode is off. I'll respond with more interaction now.",
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([WelcomeMessage]);
  const [input, setInput] = useState('');
  const [isVentMode, setIsVentMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const updateProgress = (sentimentScore: number) => {
    try {
      const key = 'sindhanaibot-progress';
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem(key);
      const records: ProgressRecord[] = storedData ? JSON.parse(storedData) : [];
      
      const todayRecordIndex = records.findIndex(r => r.date === today);

      if (todayRecordIndex > -1) {
        const record = records[todayRecordIndex];
        record.sentiment = (record.sentiment * record.count + sentimentScore) / (record.count + 1);
        record.count += 1;
      } else {
        records.push({ date: today, sentiment: sentimentScore, count: 1 });
      }

      localStorage.setItem(key, JSON.stringify(records));
    } catch (error) {
      console.error("Could not update progress in localStorage:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userInput: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userInput]);
    setInput('');

    startTransition(async () => {
      const typingIndicator: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        isTyping: true,
      };
      setMessages((prev) => [...prev, typingIndicator]);

      if (isVentMode) {
        const ventResponse: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "I hear you. Thank you for sharing that with me."
        };
        setMessages((prev) => prev.filter(m => !m.isTyping).concat(ventResponse));
        return;
      }

      try {
        const historyForAI = messages
            .filter(m => !['welcome', 'vent-mode-on', 'vent-mode-off'].includes(m.id))
            .filter(m => typeof m.content === 'string' && !m.isTyping)
            .map(m => ({
              role: m.role === 'assistant' ? 'bot' : 'user',
              content: m.content as string,
            }));
            
        const [empathyResult, distressResult] = await Promise.allSettled([
          aiEmpathyInChat({ message: userInput.content as string, conversationHistory: historyForAI }),
          detectDistress({ userInput: userInput.content as string }),
        ]);

        const newMessages: Message[] = [];

        if (empathyResult.status === 'fulfilled') {
          newMessages.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: empathyResult.value.response,
          });
        } else {
          console.error('Empathetic response failed:', empathyResult.reason);
          newMessages.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "I'm having a little trouble connecting right now. Please try again in a moment.",
          });
        }

        if (distressResult.status === 'fulfilled') {
          const { isDistressed, suggestedResources, sentimentScore } = distressResult.value;
          updateProgress(sentimentScore);
          if (isDistressed && suggestedResources.length > 0) {
            newMessages.push({
              id: crypto.randomUUID(),
              role: 'assistant',
              content: (
                <Card className="bg-destructive/10 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="text-destructive">It's okay to ask for help</CardTitle>
                        <CardDescription className="text-destructive/80">
                            It sounds like you're going through a lot. If you need to talk to someone, these resources are available.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/90">
                            {suggestedResources.map((resource, i) => <li key={i}>{resource}</li>)}
                        </ul>
                    </CardContent>
                </Card>
              )
            });
          }
        } else {
            console.error('Distress detection failed:', distressResult.reason);
        }

        setMessages((prev) => prev.filter(m => !m.isTyping).concat(newMessages));
      } catch (error) {
        console.error(error);
        setMessages((prev) => prev.filter(m => !m.isTyping).concat({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "I'm sorry, something went wrong on my end.",
        }));
      }
    });
  };

  const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage) return;

    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback } : m));
    
    startTransition(async () => {
      try {
        await improveAIEmpatheticAbility({
          chatbotResponse: originalMessage.content as string,
          userFeedback: feedback,
        });
        toast({
          title: 'Feedback received',
          description: "Thank you for helping me improve!",
        });
      } catch (error) {
        console.error("Failed to submit feedback:", error);
        toast({
            variant: "destructive",
            title: 'Oh no!',
            description: "I couldn't process your feedback right now.",
        });
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback: null } : m));
      }
    });
  };
  
  const handleMoodSuggestion = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage || isPending) {
        toast({
            title: "Share your feelings first",
            description: "Type a message about how you're feeling, then I can give a suggestion.",
        });
        return;
    };

    startTransition(async () => {
        const typingIndicator: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            isTyping: true,
        };
        setMessages((prev) => [...prev, typingIndicator]);

        try {
            const result = await moodToMusic({ mood: lastUserMessage.content as string });
            const suggestionMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: (
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> A little something for you
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-primary/90">Based on what you've shared, you might appreciate this:</p>
                            <p className="font-bold text-primary mt-2 capitalize">{result.suggestionType}:</p>
                            <p className="text-primary/90">{result.suggestion}</p>
                        </CardContent>
                    </Card>
                )
            };
            setMessages((prev) => prev.filter(m => !m.isTyping).concat(suggestionMessage));
        } catch (error) {
            console.error("Mood suggestion failed:", error);
            setMessages((prev) => prev.filter(m => !m.isTyping));
            toast({
                variant: 'destructive',
                title: 'Suggestion failed',
                description: 'I couldn\'t come up with a suggestion right now.'
            });
        }
    });
  }

  const handleVentModeToggle = (checked: boolean) => {
    setIsVentMode(checked);
    setMessages(prev => [...prev, checked ? VentModeMessage : VentModeOffMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            <Label htmlFor="vent-mode" className="flex items-center gap-2 cursor-pointer text-sm">
                <Wind className="w-5 h-5" />
                Safe Vent Mode
            </Label>
            <Switch id="vent-mode" checked={isVentMode} onCheckedChange={handleVentModeToggle} disabled={isPending} />
        </div>
        <Button variant="outline" size="sm" onClick={handleMoodSuggestion} disabled={isPending}>
          <Sparkles className="w-4 h-4 mr-2" />
          Get Suggestion
        </Button>
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <BotIcon className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                  "max-w-md w-fit",
                  message.role === 'user' ? 'order-1' : 'order-2'
              )}>
                {message.isTyping ? (
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3 inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <div className={cn(
                    "rounded-lg p-3 text-sm",
                    message.role === 'user' ? "bg-primary text-primary-foreground" : typeof message.content !== "string" ? "bg-transparent p-0" : "bg-secondary text-secondary-foreground"
                  )}>
                    {typeof message.content === 'string' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                )}
                {message.role === 'assistant' && !message.isTyping && typeof message.content === 'string' && (
                   <div className="mt-2 flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleFeedback(message.id, 'good')} disabled={message.feedback === 'good' || isPending}>
                        <ThumbsUp className={cn("w-4 h-4", message.feedback === 'good' && 'text-primary fill-primary/20')} />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleFeedback(message.id, 'bad')} disabled={message.feedback === 'bad' || isPending}>
                        <ThumbsDown className={cn("w-4 h-4", message.feedback === 'bad' && 'text-destructive fill-destructive/20')} />
                    </Button>
                   </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 border order-2">
                  <AvatarFallback className="bg-muted">
                    <UserIcon className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1"
            autoComplete="off"
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
