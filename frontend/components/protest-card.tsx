"use client";

import Link from "next/link";
import { MapPin, Users, Calendar, ArrowRight, Shield, ShieldAlert, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import type { Protest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// interface ProtestCardProps {
//   protest: Protest;
//   isSelected?: boolean;
//   onClick?: () => void;
//   compact?: boolean;
// }
interface ProtestCardProps {
  protest: {
    id: string;
    name: string;
    city: string;
    description?: string;
    status?: string;
  };
}
const statusConfig = {
  active: {
    label: "Active",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  planned: {
    label: "Planned",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  past: {
    label: "Past",
    className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  },
};

const verificationConfig = {
  verified: {
    label: "Verified",
    icon: Shield,
    className: "text-green-600 dark:text-green-400",
  },
  partial: {
    label: "Partially Verified",
    icon: ShieldAlert,
    className: "text-amber-600 dark:text-amber-400",
  },
  unverified: {
    label: "Unverified",
    icon: ShieldQuestion,
    className: "text-gray-500 dark:text-gray-400",
  },
};

export function ProtestCard({
  protest,
  isSelected,
  onClick,
  compact = false,
}: ProtestCardProps) {
  const status = statusConfig[protest.status ?? "planned"];
  const verification = verificationConfig[protest.verification ?? "unverified"];

  const VerificationIcon = verification.icon;

  const content = (
    <div
      className={cn(
        "group bg-card border border-border rounded-lg transition-all cursor-pointer",
        "hover:border-primary/30 hover:shadow-md",
        isSelected && "border-primary ring-1 ring-primary/20",
        compact ? "p-3" : "p-4"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          className={cn(
            "font-semibold text-card-foreground leading-tight line-clamp-2",
            compact ? "text-sm" : "text-base"
          )}
        >
          {protest.title}
        </h3>
        <Badge
          variant="outline"
          className={cn("shrink-0 text-[10px] font-medium", status.className)}
        >
          {status.label}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
        <MapPin className="w-3 h-3 shrink-0" />
        <span className="text-xs truncate">
          {protest.city}
        </span>
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {protest.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(protest.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {protest.participantCount && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{protest.participantCount.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <VerificationIcon className={cn("w-3.5 h-3.5", verification.className)} />
          <span className={cn("text-[10px] font-medium", verification.className)}>
            {verification.label}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {protest.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/protest/${protest.id}`}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Details
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );

  return content;
}
