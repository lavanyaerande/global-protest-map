"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Globe,
  Map,
  History,
  Plus,
  ArrowRight,
  Users,
  MapPin,
  TrendingUp,
  Shield,
  Moon,
  Sun,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fetchProtests,
  fetchProtestFacts,
  type Protest,
  type ProtestFact,
  getProtestStats,
} from "@/lib/mock-data";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function HomePage() {
  const [protests, setProtests] = useState<Protest[]>([]);
  const [facts, setFacts] = useState<ProtestFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [protestsData, factsData] = await Promise.all([
          fetchProtests({}),
          fetchProtestFacts(),
        ]);
        setProtests(protestsData);
        console.log("Loaded protests:", protestsData);
        setFacts(factsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = getProtestStats(protests);
  const recentProtests = protests
    .filter((p) => p.status === "active")
    .slice(0, 3);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-red-500",
          label: "Active",
          icon: AlertCircle,
        };
      case "planned":
        return {
          color: "bg-blue-500",
          label: "Planned",
          icon: Clock,
        };
      default:
        return {
          color: "bg-muted-foreground",
          label: "Past",
          icon: CheckCircle,
        };
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      political: "Political",
      environmental: "Environmental",
      labor: "Labor Rights",
      "civil-rights": "Civil Rights",
      economic: "Economic",
      other: "Other",
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">
              Global Protest Map
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/map">
              <Button variant="ghost" size="sm">
                <Map className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Live Map</span>
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Submit</span>
              </Button>
            </Link>
            <div className="w-px h-5 bg-border mx-1" />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Real-time global coverage
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight text-balance">
              Track protests and civil movements worldwide
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              An open-source platform documenting active, planned, and
              historical protests across the globe. Verified data, transparent
              sourcing, and real-time updates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/map">
                <Button size="lg" className="gap-2">
                  <Map className="w-4 h-4" />
                  Explore Live Map
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/history">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <History className="w-4 h-4" />
                  View History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/10">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {loading ? "-" : stats.active}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Active Protests
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/10">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {loading ? "-" : stats.planned}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Planned Events
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {loading ? "-" : stats.countries}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Countries Tracked
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/10">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {loading
                  ? "-"
                  : stats.totalParticipants > 1000000
                    ? `${(stats.totalParticipants / 1000000).toFixed(1)}M`
                    : `${Math.round(stats.totalParticipants / 1000)}K`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total Participants
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Protests Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Active Protests
              </h2>
              <p className="text-muted-foreground mt-1">
                Currently ongoing demonstrations worldwide
              </p>
            </div>
            <Link href="/map">
              <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-5">
                      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                      <div className="h-16 bg-muted rounded mb-4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </CardContent>
                  </Card>
                ))
              : recentProtests.map((protest) => {
                  const statusConfig = getStatusConfig(protest.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <Link href={`/protest/${protest.id}`} key={protest.id}>
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
                              {protest.title}
                            </h3>
                            <div
                              className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 ${statusConfig.color} animate-pulse`}
                            />
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>
                              {protest.location.city},{" "}
                              {protest.location.country}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {protest.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(protest.category)}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span>{statusConfig.label}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Key Facts Section */}
      <section className="py-16 px-4 sm:px-6 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Key Insights
              </h2>
              <p className="text-muted-foreground mt-1">
                Research-backed facts about global protests
              </p>
            </div>
            <Link href="/history">
              <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
                More Facts
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {facts.slice(0, 4).map((fact) => (
              <Card key={fact.id} className="bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1.5">
                        {fact.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {fact.content}
                      </p>
                      {fact.source && (
                        <p className="text-xs text-muted-foreground mt-2 opacity-70">
                          Source: {fact.source}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">
              Why Use Global Protest Map?
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              A comprehensive platform for tracking and understanding civil
              movements
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Interactive Map
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore protests on a full-screen map with marker clustering,
                color-coded by status and category.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Verified Data
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each protest is verified with clear status badges and
                transparent source attribution.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <History className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Historical Context
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn about landmark protests and movement timelines that shaped
                history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 border-t border-border bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Contribute to the Map
          </h2>
          <p className="text-muted-foreground mb-6">
            Know about a protest that is not on our map? Help us document civil
            movements by submitting verified information.
          </p>
          <Link href="/submit">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Submit a Protest
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              Global Protest Map
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Open-source project. Data provided for informational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
