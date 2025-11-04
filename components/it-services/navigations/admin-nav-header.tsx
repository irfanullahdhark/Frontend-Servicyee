"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

const  AdminNavHeader = () =>{
    return <div className="flex items-center gap-3 px-4 py-3 border-b bg-background w-full">
        <SidebarTrigger />
        <div className="font-semibold">IT Services Admin Panel</div>
    </div>
}

export default AdminNavHeader;