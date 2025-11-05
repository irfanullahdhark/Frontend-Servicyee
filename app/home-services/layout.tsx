"use client";

import { useSidebar } from "@/components/providers/context/SidebarContext";
import AppHeader from "@/components/navigation/ProfessionalLayout/AppHeader";
const AppSidebar = dynamic(() => import("@/components/navigation/ProfessionalLayout/AppSidebar"), { ssr: false });
import Header from "@/components/navigation/header";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/navigation/Footer";
import dynamic from "next/dynamic";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen } = useSidebar();

  // Check if the pathname starts with the desired route
  const isDashboardRoute = pathname.startsWith("/home-services/dashboard");

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // Apply theme to root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-light", "theme-dark");
  }, []);

  // Return the special HomeLayout if route matches
  if (isDashboardRoute) {
    return (
      <div className="xl:flex  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Sidebar and Backdrop */}
        <AppSidebar isServiceProvider />

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />

          {/* Page Content */}
          <div className="p-4 mx-auto max-w-[var(--breakpoint-2xl)] md:p-6">
            <div className=" transition-all duration-300">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout (fallback)
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
