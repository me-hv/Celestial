"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { ContextBar } from "./ContextBar";
import { GlobalSearchDialog } from "../shared/GlobalSearchDialog";

export interface AppShellProps {
  children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = "celestial-sidebar-state";

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  // Sidebar expanded / collapsed state
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Restore sidebar state from localStorage on client mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (savedState !== null) {
        setIsExpanded(savedState === "expanded");
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  // Automatically close mobile menu on route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "expanded" : "collapsed");
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K and Escape to close drawer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        if (isMobileOpen) {
          setIsMobileOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-celestial-void font-sans text-celestial-starlight antialiased">
      {/* Left Application Sidebar */}
      <AppSidebar
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Viewport Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Contextual Top Bar */}
        <ContextBar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>

      {/* Universal Search Command Modal */}
      <GlobalSearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

