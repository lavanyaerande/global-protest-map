"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Globe, Moon, Sun, Plus, Menu, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight tracking-tight">
              Global Protest Map
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              Real-time tracking worldwide
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/map">
            <Button variant="ghost" size="sm" className="text-sm">
              Map
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-sm">
              <History className="w-4 h-4 mr-1" />
              History
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant="ghost" size="sm" className="text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Submit
            </Button>
          </Link>
          <div className="w-px h-5 bg-border mx-2" />
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden w-8 h-8"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border transition-all duration-200",
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-4 gap-2">
          <Link href="/map" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Map
            </Button>
          </Link>
          <Link href="/history" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <History className="w-4 h-4 mr-2" />
              History & Insights
            </Button>
          </Link>
          <Link href="/submit" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Submit Protest
            </Button>
          </Link>
          <div className="h-px bg-border my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 ml-0 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            <span className="ml-6">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
