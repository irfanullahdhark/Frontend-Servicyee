"use client"

import * as React from "react"
import { Calendar, Home, Inbox, Search, Settings, ChevronDown, ChevronRight, Users, Layers, LayoutGrid } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// Dropdown menu data (sample)
const navItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
    isActive: true,
    items: [
      { title: "Overview", url: "#" },
      { title: "Reports", url: "#" },
      { title: "Analytics", url: "#" },
    ],
  },
  {
    title: "Categories",
    url: "#",
    icon: Layers,
    items: [
      { title: "Category", url: "/it-services/admin/categories/" },
      { title: "Sub Categories", url: "/it-services/admin/sub-categories/" },
      { title: "Service-Types", url: "/it-services/admin/service-types" },
    ],
  },
  {
    title: "Employers",
    url: "#",
    icon: Users,
    items: [
      { title: "List", url: "#" },
      { title: "Approvals", url: "#" },
    ],
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
    items: [
      { title: "Messages", url: "#" },
      { title: "Tickets", url: "#" },
    ],
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "General", url: "#" },
      { title: "Users", url: "#" },
      { title: "Billing", url: "#" },
    ],
  },
]

export function AdminSidebar() {
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})
  const { state, isMobile } = useSidebar()

  const toggle = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }))

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="h-screen fixed top-0 left-0 border-r-0 border-r-gray-900">
      <SidebarHeader className="flex items-center justify-center md:justify-start">
        <div className="px-2 py-2 flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 size-6 rounded bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="size-4 text-primary" />
          </div>
          <span className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ${
            isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}>
            IT Services
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden h-full flex flex-col">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide">
            {isCollapsed && !isMobile ? "" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const hasChildren = Array.isArray(item.items) && item.items.length > 0
                const isOpen = !!openMap[item.title]
                const showDropdown = hasChildren && !isCollapsed
                return (
                  <SidebarMenuItem key={item.title}>
                    <div className="flex items-center gap-1">
                      <SidebarMenuButton
                        className="flex-1"
                        isActive={item.isActive}
                        onClick={() => (showDropdown ? toggle(item.title) : undefined)}
                        tooltip={isCollapsed && !isMobile ? item.title : undefined}
                        asChild
                      >
                        <a href={item.url} aria-expanded={hasChildren ? isOpen : undefined}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      {showDropdown && (
                        <button
                          type="button"
                          aria-label="Toggle section"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggle(item.title)
                          }}
                          className="ml-1 size-6 inline-flex items-center justify-center rounded-md hover:bg-sidebar-accent text-sidebar-foreground/80 transition-opacity duration-200"
                        >
                          {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </button>
                      )}
                    </div>
                    {hasChildren && isOpen && !isCollapsed && (
                      <SidebarMenuSub>
                        {item.items!.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton href={sub.url}>
                              <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className={`px-2 py-2 text-xs text-muted-foreground transition-opacity duration-200 ${
          isCollapsed && !isMobile ? "opacity-0 h-0 overflow-hidden p-0" : "opacity-100"
        }`}>
          Signed in as admin
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}