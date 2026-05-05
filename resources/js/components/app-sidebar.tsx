"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame, Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavTeams } from "@/components/nav-teams"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

const data = {
  user: {
    name: "Admin CRM",
    email: "admin@kita.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Admin CRM",
      logo: Command,
      plan: "Project Kita",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: route('dashboard'),
      icon: Home,
      isActive: true,
    },
    {
      title: "Customers",
      url: route('customers.index'),
      icon: SquareTerminal,
    },
    {
      title: "Projects",
      url: route('projects.index'),
      icon: Frame,
    },
    {
      title: "Transactions",
      url: route('transactions.index'),
      icon: PieChart,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;

    return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavTeams teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
