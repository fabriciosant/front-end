// src/components/team-switcher.tsx (versão flexível)
"use client";

import * as React from "react";
import { Home } from "lucide-react"; // Ícone padrão
import { SidebarMenu } from "@/components/ui/sidebar";

interface Team {
  name?: string;
  logo?: React.ElementType;
  plan?: string;
}

interface TeamSwitcherProps {
  teams?: Team[];
}

export function TeamSwitcher({ teams = [] }: TeamSwitcherProps) {
  const [activeTeam] = React.useState(
    teams[0] || {
      name: "Controle Financeiro",
      logo: Home,
      plan: "Pro",
    }
  );

  const LogoComponent = activeTeam.logo || Home;

  return (
    <SidebarMenu>
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <LogoComponent className="size-5" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="font-semibold">
            {activeTeam.name || "Controle Financeiro"}
          </span>
          <span className="text-xs text-muted-foreground">
            {activeTeam.plan || "Pro"}
          </span>
        </div>
      </div>
    </SidebarMenu>
  );
}
