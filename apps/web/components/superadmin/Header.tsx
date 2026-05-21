"use client";

import { useAuth } from "@/context/AuthContext";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Bell, LogOut, Crown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function SuperadminHeader() {
  const { user, logout } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1 text-amber-500" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb / title area */}
      <div className="flex-1 flex items-center gap-2">
        <Crown className="h-4 w-4 text-amber-500 hidden sm:block animate-bounce" />
        <h2 className="text-sm font-black tracking-wider text-slate-100 uppercase">
          Consola General de Control · DentalOS SaaS
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Simple Notification indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-amber-500 hover:text-amber-400"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          </span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="h-7 w-7 ring-1 ring-amber-500/30">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-400 text-xs font-black text-slate-950">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-xs font-bold leading-none text-slate-200">
                  {user?.full_name ?? "Superadmin"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/15 font-bold">
                Master Administrator
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Consola
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
