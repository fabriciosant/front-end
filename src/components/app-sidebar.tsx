"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  CircleUserRound,
  LayoutDashboard,
  Target,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { url } from "inspector";

// This is sample data.
const data = {
  user: {
    name: "POC",
    email: "Fabricio@gmail.com",
  },
  teams: [
    {
      logo: CircleUserRound,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Primeiro",
          url: "#",
        },
        {
          title: "Segundo",
          url: "#",
        },
      ],
    },
    {
      title: "Documentações",
      icon: BookOpen,
      items: [
        {
          title: "Next",
          url: "https://nextjs.org/docs",
        },
        {
          title: "Shadcn ui",
          url: "https://ui.shadcn.com/",
        },
        {
          title: "Icones",
          url: "https://lucide.dev/",
        },
      ],
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
