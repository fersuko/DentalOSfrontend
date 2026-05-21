"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Crown,
  Building2,
  Receipt,
  Settings,
  LogOut,
  ChevronUp,
  Sliders,
  ShieldCheck
} from "lucide-react";

const navItems = [
  {
    title: "Consola General",
    href: "/superadmin",
    icon: Sliders,
  },
  {
    title: "Clínicas & Clientes",
    href: "/superadmin/clinics",
    icon: Building2,
  },
  {
    title: "Planes de Pago",
    href: "/superadmin/plans",
    icon: Crown,
  },
  {
    title: "Facturación SaaS",
    href: "/superadmin/billing",
    icon: Receipt,
  },
];

export function SuperadminSidebar() {
  const pathname = usePathname();
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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/superadmin">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 shadow-md">
                  <Crown className="h-4 w-4 text-slate-950 font-bold" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-black text-amber-500 tracking-wider">DentalOS SaaS</span>
                  <span className="truncate text-xs text-muted-foreground font-semibold">
                    Consola Suprema
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-500/80 font-bold uppercase tracking-wider text-[10px]">Gestión de Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/superadmin"
                        ? pathname === "/superadmin"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                    className="hover:bg-amber-500/5 active:bg-amber-500/10 text-slate-300"
                  >
                    <Link href={item.href}>
                      <item.icon className="text-amber-500" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent border border-amber-500/15"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-amber-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-400 text-xs font-black text-slate-950">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-slate-200">
                      {user?.full_name ?? "Superadmin"}
                    </span>
                    <span className="truncate text-xs text-amber-500/80 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Master Admin
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Consola
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
