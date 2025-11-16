"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, user, sessionId, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    // Wait for component to mount and store to be ready
    if (!isMounted || isLoading) {
      return;
    }

    // Small delay to ensure localStorage is read
    const timer = setTimeout(() => {
      // Check if user is authenticated
      const authenticated = isAuthenticated && user && sessionId;
      
      if (!authenticated) {
        // If not authenticated, redirect to login
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      } else {
        // User is authenticated, stop checking
        setIsCheckingAuth(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted, isAuthenticated, user, sessionId, isLoading, router, pathname]);

  // Show loading state while checking authentication or if not authenticated
  if (isCheckingAuth || isLoading || !isAuthenticated || !user || !sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
