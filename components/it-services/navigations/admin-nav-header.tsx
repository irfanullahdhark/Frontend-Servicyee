"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

const  AdminNavHeader = () =>{
    return (
        <div className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 bg-background w-full border-b-1 border-b-gray-600">
            <SidebarTrigger />
            <div className="font-semibold text-sm md:text-base truncate">
                IT Services Admin Panel
            </div>
        </div>
    )
}

export default AdminNavHeader;