"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeaderLess from "@/layout/AppHeaderLess";
import AppSidebarLess from "@/layout/AppSidebarLess";
import AppFooterLess from "@/layout/AppFooterLess";
import Backdrop from "@/layout/Backdrop";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // If login page, render without header and sidebar
  if (isLoginPage) {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            {children}
          </div>
          {/* Footer */}
          <AppFooterLess />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebarLess />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeaderLess />
        {/* Page Content */}
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1 p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
          {/* Footer */}
          <AppFooterLess />
        </div>
      </div>
    </div>
  );
}
