'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  Library,
  Menu,
  Sparkles,
  Coffee,
  MessageSquare,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { BotIcon } from '@/components/icons';

const navItems = [
  { href: '/', icon: MessageSquare, label: 'Chat' },
  { href: '/progress', icon: HeartPulse, label: 'My Progress' },
  { href: '/challenges', icon: Sparkles, label: 'Challenges' },
  { href: '/hope-library', icon: Library, label: 'Hope Library' },
  { href: '/breaks', icon: Coffee, label: 'Micro-Breaks' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-center">
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
              <BotIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-headline font-bold">SindhanaiBot</h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SidebarTrigger>
          <div className="flex items-center gap-2">
            <BotIcon className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold font-headline">SindhanaiBot</h1>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
