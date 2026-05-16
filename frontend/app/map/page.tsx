"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { FilterPanel } from "@/components/filter-panel";
import { ProtestCard } from "@/components/protest-card";
import { StatsBar } from "@/components/stats-bar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, List, X, ChevronUp } from "lucide-react";
import { MapLegend } from "@/components/map-legend";
import type {
  Protest,
  ProtestCategory,
  ProtestStatus,
} from "@/lib/mock-data";
import { fetchProtestsFromBackend } from "@/lib/api";

import { cn } from "@/lib/utils";

const ProtestMap = dynamic(
  () => import("@/components/protest-map").then((mod) => mod.ProtestMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

export default function HomePage() {
  const [protests, setProtests] = useState<Protest[]>([]);
  const [selectedProtest, setSelectedProtest] = useState<Protest | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [filters, setFilters] = useState<{
    country?: string;
    category?: ProtestCategory;
    status?: ProtestStatus;
    dateRange?: { start: string; end: string };
  }>({});

  const loadProtests = useCallback(async () => {
    const data = await fetchProtestsFromBackend();
    const normalized = data.map((p: any) => ({
      ...p,
      status: p.status ?? "past",
    }));
    console.log("Backend protests:", data);
    let filtered = [...normalized];

    // COUNTRY FILTER
    if (filters.country && filters.country !== "All Countries") {
      filtered = filtered.filter(
        (p: any) => p.location?.country === filters.country
      );
    }

    // STATUS FILTER
    if (filters.status) {
      filtered = filtered.filter(
        (p: any) => p.status === filters.status
      );
    }

    // DATE FILTER
    if (filters.dateRange) {
      filtered = filtered.filter((p: any) => {
        const protestDate = new Date(p.date);
        return (
          protestDate >= new Date(filters.dateRange!.start) &&
          protestDate <= new Date(filters.dateRange!.end)
        );
      });
    }

    setProtests(filtered);
  }, [filters]);

  useEffect(() => {
    loadProtests();
  }, [loadProtests]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleMarkerClick = (protest: Protest) => {
    setSelectedProtest(protest);
    setMobilePanelOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-14 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-background border-r border-border transition-all duration-300",
            sidebarOpen ? "w-96" : "w-0"
          )}
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <StatsBar protests={protests} />
              </div>

              <div className="p-4 border-b border-border">
                <FilterPanel onFilterChange={handleFilterChange} />
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {loading ? "Loading..." : `${protests.length} protests found`}
                  </span>
                  {selectedProtest && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setSelectedProtest(null)}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="p-4 space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : protests.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">
                          No protests found matching your filters.
                        </p>
                      </div>
                    ) : (
                      protests.map((protest) => (
                        <ProtestCard
                          key={protest.id}
                          protest={protest}
                          isSelected={selectedProtest?.id === protest.id}
                          onClick={() => setSelectedProtest(protest)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-card border border-border rounded-r-lg p-1.5 shadow-sm hover:bg-muted transition-colors"
          style={{ left: sidebarOpen ? "384px" : "0px" }}
        >
          <ChevronUp
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              sidebarOpen ? "-rotate-90" : "rotate-90"
            )}
          />
        </button>

        {/* Map */}
        <div className="flex-1 relative">
          <ProtestMap
            protests={protests}
            onMarkerClick={handleMarkerClick}
            selectedProtest={selectedProtest}
          />

          {/* Map Legend */}
          <MapLegend className="hidden lg:block" />

          {/* Mobile List Toggle */}
          <Button
            className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg"
            onClick={() => setMobilePanelOpen(true)}
          >
            <List className="w-4 h-4 mr-2" />
            View List ({protests.length})
          </Button>
        </div>

        {/* Mobile Panel */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 bottom-0 z-30 bg-background border-t border-border rounded-t-2xl shadow-xl transition-transform duration-300",
            mobilePanelOpen ? "translate-y-0" : "translate-y-full"
          )}
          style={{ maxHeight: "80vh" }}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-medium">
              {selectedProtest ? selectedProtest.title : `${protests.length} Protests`}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => {
                setMobilePanelOpen(false);
                setSelectedProtest(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="p-4">
              {selectedProtest ? (
                <ProtestCard protest={selectedProtest} isSelected />
              ) : (
                <>
                  <div className="mb-4">
                    <FilterPanel onFilterChange={handleFilterChange} />
                  </div>
                  <div className="space-y-3">
                    {protests.map((protest) => (
                      <ProtestCard
                        key={protest.id}
                        protest={protest}
                        compact
                        onClick={() => setSelectedProtest(protest)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}
