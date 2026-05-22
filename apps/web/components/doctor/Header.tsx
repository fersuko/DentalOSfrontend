"use client";

import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
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
import { Bell, LogOut, HeartPulse, Building2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function DoctorHeader() {
  const { user, logout } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DR";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb / title area */}
      <div className="flex-1 flex items-center gap-2">
        <HeartPulse className="h-4 w-4 text-purple-500 hidden sm:block" />
        <h2 className="text-sm font-medium text-foreground">
          Portal Clínico · Dra/Dr. {user?.full_name?.split(" ")[0] ?? "Odontólogo"}
        </h2>
        {activeWorkspace && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              {activeWorkspace.name}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Simple Notification indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          </span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-500 text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-xs font-medium leading-none">
                  {user?.full_name ?? "Doctor"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 text-[10px] bg-purple-500/10 text-purple-500 hover:bg-purple-500/15">
                Odontólogo Clínico
              </Badge>
            </div>
            <DropdownMenuSeparator />
            {user?.role !== "superadmin" && (
              <DropdownMenuItem asChild>
                <Link href="/workspaces">
                  <Building2 className="mr-2 h-4 w-4 text-purple-500" />
                  Cambiar Clínica
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
