"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "./AppSidebar";
import { ContextBar } from "./ContextBar";
import { GlobalSearchDialog } from "../shared/GlobalSearchDialog";

export interface AppShellProps {
  children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = "celestial-sidebar-state";

export function AppShell({ children }: AppShellProps) {
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

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-celestial-void font-sans text-celestial-starlight">
      {/* Left Application Sidebar */}
      <AppSidebar
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Viewport Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Contextual Top Bar */}
        <ContextBar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>

      {/* Universal Search Command Modal */}
      <GlobalSearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
