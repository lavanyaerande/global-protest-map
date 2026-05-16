"use client";

import { useState } from "react";
import { ChevronDown, Filter, X, Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { categories, countries, type ProtestCategory, type ProtestStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  onFilterChange: (filters: {
    country?: string;
    category?: ProtestCategory;
    status?: ProtestStatus;
    dateRange?: { start: string; end: string };
  }) => void;
  className?: string;
}

export function FilterPanel({ onFilterChange, className }: FilterPanelProps) {
  const [country, setCountry] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isExpanded, setIsExpanded] = useState(true);

  const activeFiltersCount = [
    country && country !== "All Countries",
    category,
    status,
    dateRange.from,
  ].filter(Boolean).length;

  const handleFilterChange = (updates: Partial<{
    country: string;
    category: string;
    status: string;
    dateRange: { from?: Date; to?: Date };
  }>) => {
    const newCountry = updates.country !== undefined ? updates.country : country;
    const newCategory = updates.category !== undefined ? updates.category : category;
    const newStatus = updates.status !== undefined ? updates.status : status;
    const newDateRange = updates.dateRange !== undefined ? updates.dateRange : dateRange;

    if (updates.country !== undefined) setCountry(newCountry);
    if (updates.category !== undefined) setCategory(newCategory);
    if (updates.status !== undefined) setStatus(newStatus);
    if (updates.dateRange !== undefined) setDateRange(newDateRange);

    onFilterChange({
      country: newCountry || undefined,
      category: newCategory as ProtestCategory || undefined,
      status: newStatus as ProtestStatus || undefined,
      dateRange: newDateRange.from && newDateRange.to
        ? {
            start: newDateRange.from.toISOString().split("T")[0],
            end: newDateRange.to.toISOString().split("T")[0],
          }
        : undefined,
    });
  };

  const clearFilters = () => {
    setCountry("");
    setCategory("");
    setStatus("");
    setDateRange({});
    onFilterChange({});
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg shadow-sm", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Country Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Country
              </label>
              <Select
                value={country}
                onValueChange={(value) => handleFilterChange({ country: value })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) => handleFilterChange({ category: value })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <div className="flex gap-2">
                {(["active", "planned", "past"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      handleFilterChange({ status: status === s ? "" : s })
                    }
                    className={cn(
                      "flex-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize",
                      status === s
                        ? s === "active"
                          ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                          : s === "planned"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                          : "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400"
                        : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-9 justify-start text-left text-sm font-normal bg-transparent"
                  >
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} -{" "}
                          {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span className="text-muted-foreground">Select dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) =>
                      handleFilterChange({
                        dateRange: { from: range?.from, to: range?.to },
                      })
                    }
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
