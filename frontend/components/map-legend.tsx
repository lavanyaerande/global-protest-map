"use client";

import { cn } from "@/lib/utils";

interface MapLegendProps {
  className?: string;
}

export function MapLegend({ className }: MapLegendProps) {
  const items = [
    { label: "Active", color: "bg-red-500" },
    { label: "Planned", color: "bg-blue-500" },
    { label: "Past", color: "bg-gray-500" },
  ];

  return (
    <div
      className={cn(
        "absolute bottom-4 right-4 z-10 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg",
        className
      )}
    >
      <p className="text-xs font-medium text-foreground mb-2">Legend</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", item.color)} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
