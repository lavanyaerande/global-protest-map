"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  History,
  TrendingUp,
  Users,
  Globe,
  Calendar,
  ArrowRight,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  fetchHistoricalProtests,
  fetchProtestFacts,
  fetchMovementTimelines,
  fetchProtests,
  getProtestStats,
  type HistoricalProtest,
  type ProtestFact,
  type MovementTimeline,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function OutcomeIcon({ outcome }: { outcome: HistoricalProtest["outcome"] }) {
  switch (outcome) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "partial":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "ongoing":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "suppressed":
      return <XCircle className="w-4 h-4 text-red-500" />;
  }
}

function OutcomeBadge({ outcome }: { outcome: HistoricalProtest["outcome"] }) {
  const styles = {
    success: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    partial: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    ongoing: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    suppressed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const labels = {
    success: "Successful",
    partial: "Partial Success",
    ongoing: "Ongoing",
    suppressed: "Suppressed",
  };

  return (
    <Badge variant="outline" className={cn("gap-1", styles[outcome])}>
      <OutcomeIcon outcome={outcome} />
      {labels[outcome]}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    "civil-rights": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    political: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    environmental: "bg-green-500/10 text-green-600 dark:text-green-400",
    labor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    economic: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };

  const labels: Record<string, string> = {
    "civil-rights": "Civil Rights",
    political: "Political",
    environmental: "Environmental",
    labor: "Labor",
    economic: "Economic",
    other: "Other",
  };

  return (
    <Badge variant="secondary" className={colors[category] || colors.other}>
      {labels[category] || category}
    </Badge>
  );
}

function FactCard({ fact }: { fact: ProtestFact }) {
  const icons = {
    statistic: <BarChart3 className="w-5 h-5" />,
    historical: <History className="w-5 h-5" />,
    impact: <TrendingUp className="w-5 h-5" />,
    trend: <TrendingUp className="w-5 h-5" />,
  };

  const colors = {
    statistic: "border-l-blue-500",
    historical: "border-l-amber-500",
    impact: "border-l-green-500",
    trend: "border-l-purple-500",
  };

  return (
    <Card className={cn("border-l-4", colors[fact.category])}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted text-muted-foreground">
            {icons[fact.category]}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">{fact.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {fact.content}
            </p>
            {fact.source && (
              <p className="text-xs text-muted-foreground mt-3 italic">
                Source: {fact.source}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoricalProtestCard({ protest }: { protest: HistoricalProtest }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              {protest.year}
              <span className="mx-1">·</span>
              <Globe className="w-4 h-4" />
              {protest.location}, {protest.country}
            </div>
            <CardTitle className="text-lg leading-tight">{protest.title}</CardTitle>
          </div>
          <OutcomeBadge outcome={protest.outcome} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {protest.description}
        </p>
        
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-1">Impact</p>
          <p className="text-sm font-medium">{protest.impact}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={protest.category} />
          {protest.participantCount && (
            <Badge variant="outline" className="gap-1">
              <Users className="w-3 h-3" />
              {protest.participantCount}
            </Badge>
          )}
        </div>

        {protest.keyFigures && protest.keyFigures.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Key Figures</p>
            <div className="flex flex-wrap gap-1.5">
              {protest.keyFigures.map((figure) => (
                <Badge key={figure} variant="secondary" className="text-xs">
                  {figure}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MovementTimelineCard({ timeline }: { timeline: MovementTimeline }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {timeline.movement}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{timeline.description}</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {timeline.events.map((event, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-primary">
                      {event.year}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{event.event}</h4>
                  <p className="text-xs text-muted-foreground">{event.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [historicalProtests, setHistoricalProtests] = useState<HistoricalProtest[]>([]);
  const [facts, setFacts] = useState<ProtestFact[]>([]);
  const [timelines, setTimelines] = useState<MovementTimeline[]>([]);
  const [currentStats, setCurrentStats] = useState({
    active: 0,
    planned: 0,
    past: 0,
    verified: 0,
    totalParticipants: 0,
    countries: 0,
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [historicalData, factsData, timelinesData, currentProtests] = await Promise.all([
          fetchHistoricalProtests(),
          fetchProtestFacts(),
          fetchMovementTimelines(),
          fetchProtests(),
        ]);
        setHistoricalProtests(historicalData);
        setFacts(factsData);
        setTimelines(timelinesData);
        setCurrentStats(getProtestStats(currentProtests));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] pt-14">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading history...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-14">
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-2 text-primary mb-4">
              <History className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                History & Insights
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
              Understanding the Power of Protest
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Explore the history of social movements, discover key facts about 
              collective action, and understand how protests have shaped our world.
            </p>
          </div>
        </section>

        {/* Current Stats */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Current Global Activity
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold text-red-500">{currentStats.active}</div>
                <div className="text-sm text-muted-foreground">Active Protests</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold text-blue-500">{currentStats.planned}</div>
                <div className="text-sm text-muted-foreground">Planned</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold text-muted-foreground">{currentStats.past}</div>
                <div className="text-sm text-muted-foreground">Concluded</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold text-green-500">{currentStats.verified}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold">{currentStats.totalParticipants.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold">{currentStats.countries}</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View live map
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <Tabs defaultValue="facts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="facts" className="gap-2">
                <BarChart3 className="w-4 h-4 hidden sm:block" />
                Key Facts
              </TabsTrigger>
              <TabsTrigger value="historical" className="gap-2">
                <History className="w-4 h-4 hidden sm:block" />
                Historic Events
              </TabsTrigger>
              <TabsTrigger value="movements" className="gap-2">
                <BookOpen className="w-4 h-4 hidden sm:block" />
                Movements
              </TabsTrigger>
            </TabsList>

            {/* Key Facts Tab */}
            <TabsContent value="facts" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {facts.map((fact) => (
                  <FactCard key={fact.id} fact={fact} />
                ))}
              </div>
            </TabsContent>

            {/* Historical Events Tab */}
            <TabsContent value="historical" className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {historicalProtests.length} significant protests that changed history
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {historicalProtests.map((protest) => (
                  <HistoricalProtestCard key={protest.id} protest={protest} />
                ))}
              </div>
            </TabsContent>

            {/* Movements Tab */}
            <TabsContent value="movements" className="space-y-6">
              <p className="text-sm text-muted-foreground mb-4">
                Explore the evolution of major social movements through time
              </p>
              <div className="grid lg:grid-cols-2 gap-6">
                {timelines.map((timeline) => (
                  <MovementTimelineCard key={timeline.id} timeline={timeline} />
                ))}
              </div>

              {/* FAQ Section */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What makes a protest successful?</AccordionTrigger>
                      <AccordionContent>
                        Research shows that nonviolent protests that achieve participation 
                        of at least 3.5% of the population have historically always succeeded. 
                        Key factors include clear goals, sustained organization, diverse 
                        participation, and strategic timing.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do we verify protest information?</AccordionTrigger>
                      <AccordionContent>
                        Our verification process involves cross-referencing multiple news 
                        sources, official statements, and on-the-ground reports. Protests 
                        are marked as "Verified" when confirmed by at least two independent 
                        sources, "Partially Verified" when from a single reliable source, 
                        and "Unverified" for user submissions pending review.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How can I contribute to this project?</AccordionTrigger>
                      <AccordionContent>
                        You can submit protest information through our Submit page. 
                        We welcome reports from journalists, activists, and citizens 
                        on the ground. All submissions go through our verification 
                        process before being added to the map.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>What data sources do you use?</AccordionTrigger>
                      <AccordionContent>
                        We aggregate data from major news agencies (Reuters, AP, AFP), 
                        regional news outlets, academic databases like ACLED, and 
                        verified social media reports. Our goal is to provide accurate, 
                        timely information about protests worldwide.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Global Protest Map - Tracking civil movements worldwide
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Map
              </Link>
              <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground">
                Submit
              </Link>
              <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground">
                History
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
