"use client";

import { Activity, Clock, History, Globe2 } from "lucide-react";
// import type { Protest } from "@/lib/mock-data";

interface StatsBarProps {
  protests: {
    id: string;
    name: string;
    city: string;
    country: string;   
    status?: string;
  }[];
}
export function StatsBar({ protests }: StatsBarProps) {
  const activeCount = protests.filter((p) => p.status === "active").length;
  const plannedCount = protests.filter((p) => p.status === "planned").length;
  const pastCount = protests.filter((p) => p.status === "past").length;
  const countries = new Set(protests.map((p) => p.country)).size;
  

  const stats = [
    {
      label: "Active",
      value: activeCount,
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Planned",
      value: plannedCount,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Past",
      value: pastCount,
      icon: History,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
    {
      label: "Countries",
      value: countries,
      icon: Globe2,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-lg p-3 text-center"
        >
          <div
            className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div className="text-xl font-bold text-card-foreground">
            {stat.value}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
