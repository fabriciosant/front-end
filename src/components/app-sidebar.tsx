"use client";

import * as React from "react";
import {
  BookOpen,
  CircleUserRound,
  LayoutDashboard,
  Home,
  DollarSign,
  PieChart,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Dados CORRETOS para o TeamSwitcher - incluindo name e plan
const data = {
  user: {
    name: "POC",
    email: "Fabricio@gmail.com",
  },
  teams: [
    {
      name: "Controle Financeiro", // ADICIONADO: nome obrigatório
      logo: CircleUserRound,
      plan: "Pro", // ADICIONADO: plano obrigatório
    },
    // Opcional: adicionar mais times se quiser
    {
      name: "Contas Pessoais",
      logo: Home,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true, // Adicionado para destacar item ativo
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard",
        },
        {
          title: "Resumo",
          url: "/dashboard/summary",
        },
      ],
    },
    {
      title: "Transações",
      url: "/transactions",
      icon: DollarSign,
      items: [
        {
          title: "Todas as Transações",
          url: "/transactions",
        },
        {
          title: "Nova Transação",
          url: "/transactions/new",
        },
        {
          title: "Categorias",
          url: "/transactions/categories",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: PieChart,
      items: [
        {
          title: "Análise Mensal",
          url: "/reports/monthly",
        },
        {
          title: "Gráficos",
          url: "/reports/charts",
        },
        {
          title: "Exportar Dados",
          url: "/reports/export",
        },
      ],
    },
    {
      title: "Documentação",
      url: "/docs",
      icon: BookOpen,
      items: [
        {
          title: "Next.js",
          url: "https://nextjs.org/docs",
          external: true,
        },
        {
          title: "Shadcn UI",
          url: "https://ui.shadcn.com/",
          external: true,
        },
        {
          title: "Ícones Lucide",
          url: "https://lucide.dev/",
          external: true,
        },
      ],
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "",
            email: "",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
