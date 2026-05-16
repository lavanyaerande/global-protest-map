"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  ExternalLink,
  Shield,
  ShieldAlert,
  ShieldQuestion,
  Clock,
  Loader2,
  Share2,
  Tag,
} from "lucide-react";
import { fetchProtestById, type Protest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ProtestMap = dynamic(
  () => import("@/components/protest-map").then((mod) => mod.ProtestMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

const statusConfig = {
  active: {
    label: "Active Now",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    dotColor: "bg-red-500",
  },
  planned: {
    label: "Planned",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  past: {
    label: "Concluded",
    className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    dotColor: "bg-gray-500",
  },
};

const verificationConfig = {
  verified: {
    label: "Verified",
    description: "Information confirmed by multiple reliable sources",
    icon: Shield,
    className: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
  },
  partial: {
    label: "Partially Verified",
    description: "Some information has been independently confirmed",
    icon: ShieldAlert,
    className: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  unverified: {
    label: "Unverified",
    description: "Information has not yet been independently verified",
    icon: ShieldQuestion,
    className: "text-gray-500 dark:text-gray-400 bg-gray-500/10 border-gray-500/20",
  },
};

const categoryLabels: Record<string, string> = {
  political: "Political",
  environmental: "Environmental",
  labor: "Labor Rights",
  "civil-rights": "Civil Rights",
  economic: "Economic",
  other: "Other",
};

export default function ProtestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [protest, setProtest] = useState<Protest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (params.id) {
        const data = await fetchProtestById(params.id as string);
        setProtest(data);
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-14 flex items-center justify-center h-[calc(100vh-56px)]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!protest) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-14 flex flex-col items-center justify-center h-[calc(100vh-56px)] gap-4">
          <h1 className="text-2xl font-semibold">Protest Not Found</h1>
          <p className="text-muted-foreground">
            The protest you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Map
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[protest.status];
  const verification = verificationConfig[protest.verification];
  const VerificationIcon = verification.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-14">
        {/* Hero Section */}
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="h-4 w-px bg-border" />
              <Badge variant="outline" className={status.className}>
                <span className={cn("w-2 h-2 rounded-full mr-1.5 animate-pulse", status.dotColor)} />
                {status.label}
              </Badge>
              <Badge variant="outline" className={verification.className}>
                <VerificationIcon className="w-3 h-3 mr-1" />
                {verification.label}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              {protest.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>
                  {protest.location.city}, {protest.location.country}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(protest.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {protest.participantCount && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{protest.participantCount.toLocaleString()} participants</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {categoryLabels[protest.category]}
              </Badge>
              {protest.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About This Protest</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {protest.description}
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              {protest.timeline && protest.timeline.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                      <div className="space-y-6">
                        {protest.timeline.map((event, index) => (
                          <div key={index} className="relative pl-8">
                            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                            <div className="text-xs text-muted-foreground mb-1">
                              {new Date(event.date).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="text-sm text-foreground">
                              {event.event}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Embedded Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg overflow-hidden border border-border">
                    <ProtestMap
                      protests={[protest]}
                      center={[protest.location.lat, protest.location.lng]}
                      zoom={13}
                    />
                  </div>
                  {protest.location.address && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {protest.location.address}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Verification Status */}
              <Card className={cn("border", verification.className.split(" ").slice(2).join(" "))}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", verification.className.split(" ").slice(0, 2).join(" "))}>
                      <VerificationIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {verification.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {verification.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organizers */}
              {protest.organizers && protest.organizers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Organizers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {protest.organizers.map((org, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {org}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Sources */}
              {protest.sources && protest.sources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {protest.sources.map((source, index) => (
                        <li key={index}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {source.name}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Share */}
              <Card>
                <CardContent className="pt-6">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share This Protest
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
