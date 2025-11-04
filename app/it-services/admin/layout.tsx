import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/it-services/navigations/admin-sidebar"
import  AdminNavHeader  from "@/components/it-services/navigations/admin-nav-header"
import React from "react"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
      <div >
            <SidebarInset>
              <AdminNavHeader />
              <div className="px-6 py-3">{children}</div>
            </SidebarInset>
          </div>
      </main>
    </SidebarProvider>
  )
}