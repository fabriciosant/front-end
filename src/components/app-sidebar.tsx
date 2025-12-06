"use client";

import * as React from "react";
import { LayoutDashboard, DollarSign, PieChart } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "POC",
    email: "Fabricio@gmail.com",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarTrigger className="m-2 cursor-pointer" />

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
