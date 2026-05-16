export type ProtestStatus = "active" | "planned" | "past";
export type VerificationStatus = "verified" | "partial" | "unverified";
export type ProtestCategory =
  | "political"
  | "environmental"
  | "labor"
  | "civil-rights"
  | "economic"
  | "other";

export interface Protest {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
    address?: string;
  };
  status: ProtestStatus;
  verification: VerificationStatus;
  category: ProtestCategory;
  startDate: string;
  endDate?: string;
  participantCount?: number;
  organizers?: string[];
  sources?: { name: string; url: string }[];
  timeline?: { date: string; event: string }[];
  tags?: string[];
  imageUrl?: string;
}

export const categories: { value: ProtestCategory; label: string }[] = [
  { value: "political", label: "Political" },
  { value: "environmental", label: "Environmental" },
  { value: "labor", label: "Labor Rights" },
  { value: "civil-rights", label: "Civil Rights" },
  { value: "economic", label: "Economic" },
  { value: "other", label: "Other" },
];

export const countries = [
  "All Countries",
  "United States",
  "France",
  "Germany",
  "Brazil",
  "India",
  "South Korea",
  "United Kingdom",
  "Argentina",
  "Kenya",
  "Australia",
];

export const mockProtests: Protest[] = [
  {
    id: "1",
    title: "Climate Action March",
    description:
      "Thousands gathered in central Paris demanding immediate government action on climate change. The protest is part of a global movement calling for stronger environmental policies and a transition to renewable energy sources.",
    location: {
      lat: 48.8566,
      lng: 2.3522,
      city: "Paris",
      country: "France",
      address: "Place de la République",
    },
    status: "active",
    verification: "verified",
    category: "environmental",
    startDate: "2026-01-25",
    participantCount: 45000,
    organizers: ["Fridays for Future France", "Extinction Rebellion"],
    sources: [
      { name: "Reuters", url: "https://reuters.com" },
      { name: "Le Monde", url: "https://lemonde.fr" },
    ],
    timeline: [
      { date: "2026-01-25 09:00", event: "Protesters begin gathering" },
      { date: "2026-01-25 11:00", event: "March begins from République" },
      { date: "2026-01-25 14:00", event: "Rally at Place de la Bastille" },
    ],
    tags: ["climate", "environment", "youth"],
  },
  {
    id: "2",
    title: "Healthcare Workers Strike",
    description:
      "NHS workers across the UK are striking for better pay and working conditions. The strike affects multiple hospitals and has led to postponement of non-emergency procedures.",
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "United Kingdom",
      address: "Westminster",
    },
    status: "active",
    verification: "verified",
    category: "labor",
    startDate: "2026-01-24",
    endDate: "2026-01-28",
    participantCount: 30000,
    organizers: ["Royal College of Nursing", "Unite the Union"],
    sources: [
      { name: "BBC", url: "https://bbc.com" },
      { name: "The Guardian", url: "https://theguardian.com" },
    ],
    timeline: [
      { date: "2026-01-24 06:00", event: "Strike begins" },
      { date: "2026-01-24 12:00", event: "Emergency talks requested" },
    ],
    tags: ["healthcare", "workers", "nhs"],
  },
  {
    id: "3",
    title: "Pro-Democracy Demonstration",
    description:
      "Large-scale demonstration in Seoul calling for greater government transparency and democratic reforms. Organizers estimate over 100,000 participants gathered peacefully.",
    location: {
      lat: 37.5665,
      lng: 126.978,
      city: "Seoul",
      country: "South Korea",
      address: "Gwanghwamun Square",
    },
    status: "active",
    verification: "partial",
    category: "political",
    startDate: "2026-01-26",
    participantCount: 100000,
    organizers: ["Citizens Coalition for Democracy"],
    sources: [{ name: "Yonhap News", url: "https://en.yna.co.kr" }],
    tags: ["democracy", "transparency"],
  },
  {
    id: "4",
    title: "Education Reform Protest",
    description:
      "Students and teachers protesting proposed education budget cuts in Berlin. The protest highlights concerns about declining education quality.",
    location: {
      lat: 52.52,
      lng: 13.405,
      city: "Berlin",
      country: "Germany",
      address: "Brandenburg Gate",
    },
    status: "planned",
    verification: "verified",
    category: "political",
    startDate: "2026-02-01",
    participantCount: undefined,
    organizers: ["German Teachers Union", "Student Association"],
    tags: ["education", "students", "funding"],
  },
  {
    id: "5",
    title: "Farmers Rights March",
    description:
      "Farmers from across India gathered in New Delhi demanding better crop prices and loan forgiveness. The peaceful march brought agricultural workers from multiple states.",
    location: {
      lat: 28.6139,
      lng: 77.209,
      city: "New Delhi",
      country: "India",
      address: "Jantar Mantar",
    },
    status: "past",
    verification: "verified",
    category: "economic",
    startDate: "2026-01-15",
    endDate: "2026-01-20",
    participantCount: 75000,
    organizers: ["All India Kisan Sabha"],
    sources: [
      { name: "The Hindu", url: "https://thehindu.com" },
      { name: "NDTV", url: "https://ndtv.com" },
    ],
    tags: ["farmers", "agriculture", "economic"],
  },
  {
    id: "6",
    title: "Anti-Corruption Rally",
    description:
      "Citizens gather in Brasília demanding investigation into government corruption allegations. Protesters call for accountability and systemic reform.",
    location: {
      lat: -15.7801,
      lng: -47.9292,
      city: "Brasília",
      country: "Brazil",
      address: "Esplanada dos Ministérios",
    },
    status: "active",
    verification: "partial",
    category: "political",
    startDate: "2026-01-27",
    participantCount: 25000,
    organizers: ["Transparency Brazil"],
    tags: ["corruption", "accountability"],
  },
  {
    id: "7",
    title: "Indigenous Rights Protest",
    description:
      "Indigenous communities protesting against land development projects that threaten ancestral territories. The demonstration calls for recognition of traditional land rights.",
    location: {
      lat: -33.8688,
      lng: 151.2093,
      city: "Sydney",
      country: "Australia",
      address: "Hyde Park",
    },
    status: "past",
    verification: "verified",
    category: "civil-rights",
    startDate: "2026-01-10",
    endDate: "2026-01-10",
    participantCount: 8000,
    organizers: ["First Nations Assembly"],
    sources: [{ name: "ABC News", url: "https://abc.net.au" }],
    tags: ["indigenous", "land-rights"],
  },
  {
    id: "8",
    title: "Tech Workers Walkout",
    description:
      "Employees at major tech companies staging walkout over AI ethics concerns and workplace conditions. The coordinated action affects multiple Silicon Valley firms.",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: "San Francisco",
      country: "United States",
      address: "SOMA District",
    },
    status: "planned",
    verification: "unverified",
    category: "labor",
    startDate: "2026-02-05",
    organizers: ["Tech Workers Coalition"],
    tags: ["tech", "ai-ethics", "workers"],
  },
  {
    id: "9",
    title: "Housing Crisis Demonstration",
    description:
      "Residents protesting skyrocketing rent prices and demanding rent control legislation. The movement has gained momentum across multiple Argentine cities.",
    location: {
      lat: -34.6037,
      lng: -58.3816,
      city: "Buenos Aires",
      country: "Argentina",
      address: "Plaza de Mayo",
    },
    status: "active",
    verification: "verified",
    category: "economic",
    startDate: "2026-01-23",
    participantCount: 15000,
    organizers: ["Housing Rights Coalition"],
    sources: [{ name: "Clarín", url: "https://clarin.com" }],
    tags: ["housing", "rent", "economic"],
  },
  {
    id: "10",
    title: "Women's Rights March",
    description:
      "Annual march demanding gender equality, reproductive rights, and an end to gender-based violence. Participants include activists, students, and community leaders.",
    location: {
      lat: -1.2921,
      lng: 36.8219,
      city: "Nairobi",
      country: "Kenya",
      address: "Uhuru Park",
    },
    status: "planned",
    verification: "verified",
    category: "civil-rights",
    startDate: "2026-03-08",
    organizers: ["Women's Rights Kenya", "Equality Now"],
    tags: ["women", "equality", "rights"],
  },
  {
    id: "11",
    title: "Pension Reform Protest",
    description:
      "Workers and unions protesting proposed changes to the pension system that would raise the retirement age. Nationwide strikes affected transportation and public services.",
    location: {
      lat: 43.2965,
      lng: 5.3698,
      city: "Marseille",
      country: "France",
      address: "Vieux-Port",
    },
    status: "past",
    verification: "verified",
    category: "labor",
    startDate: "2026-01-05",
    endDate: "2026-01-07",
    participantCount: 50000,
    organizers: ["CGT", "CFDT"],
    sources: [{ name: "France 24", url: "https://france24.com" }],
    tags: ["pension", "retirement", "labor"],
  },
  {
    id: "12",
    title: "Water Rights Protest",
    description:
      "Communities affected by industrial pollution demanding clean water access and corporate accountability. Protesters highlight health impacts on local populations.",
    location: {
      lat: 19.4326,
      lng: -99.1332,
      city: "Mexico City",
      country: "Mexico",
      address: "Zócalo",
    },
    status: "active",
    verification: "partial",
    category: "environmental",
    startDate: "2026-01-26",
    participantCount: 12000,
    tags: ["water", "pollution", "health"],
  },
];

// Simulated API functions
export async function fetchProtests(filters?: {
  country?: string;
  category?: ProtestCategory;
  status?: ProtestStatus;
  dateRange?: { start: string; end: string };
}): Promise<Protest[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockProtests];

  if (filters?.country && filters.country !== "All Countries") {
    filtered = filtered.filter(
      (p) => p.location.country === filters.country
    );
  }

  if (filters?.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters?.status) {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  if (filters?.dateRange) {
    filtered = filtered.filter((p) => {
      const protestDate = new Date(p.startDate);
      return (
        protestDate >= new Date(filters.dateRange!.start) &&
        protestDate <= new Date(filters.dateRange!.end)
      );
    });
  }

  return filtered;
}

export async function fetchProtestById(id: string): Promise<Protest | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockProtests.find((p) => p.id === id) || null;
}

export async function submitProtest(
  data: Omit<Protest, "id" | "verification">
): Promise<{ success: boolean; id: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would POST to the FastAPI backend
  return { success: true, id: String(Date.now()) };
}

// Historical and Notable Protests Data
export interface HistoricalProtest {
  id: string;
  title: string;
  year: number;
  location: string;
  country: string;
  description: string;
  impact: string;
  participantCount?: string;
  outcome: "success" | "partial" | "ongoing" | "suppressed";
  category: ProtestCategory;
  keyFigures?: string[];
  imageDescription?: string;
}

export interface ProtestFact {
  id: string;
  title: string;
  content: string;
  source?: string;
  category: "statistic" | "historical" | "impact" | "trend";
}

export interface MovementTimeline {
  id: string;
  movement: string;
  description: string;
  events: {
    year: number;
    event: string;
    significance: string;
  }[];
}

export const historicalProtests: HistoricalProtest[] = [
  {
    id: "h1",
    title: "March on Washington for Jobs and Freedom",
    year: 1963,
    location: "Washington D.C.",
    country: "United States",
    description: "Over 250,000 people gathered at the Lincoln Memorial where Martin Luther King Jr. delivered his iconic 'I Have a Dream' speech. The march was a pivotal moment in the American Civil Rights Movement.",
    impact: "Helped pass the Civil Rights Act of 1964 and the Voting Rights Act of 1965",
    participantCount: "250,000+",
    outcome: "success",
    category: "civil-rights",
    keyFigures: ["Martin Luther King Jr.", "John Lewis", "A. Philip Randolph"],
  },
  {
    id: "h2",
    title: "Tiananmen Square Protests",
    year: 1989,
    location: "Beijing",
    country: "China",
    description: "Student-led demonstrations calling for democracy, freedom of speech, and freedom of the press. The protests lasted seven weeks before being forcibly suppressed.",
    impact: "Became a symbol of pro-democracy movements worldwide despite tragic outcome",
    participantCount: "1 million+ at peak",
    outcome: "suppressed",
    category: "political",
    keyFigures: ["Tank Man (Unknown)", "Wang Weilin"],
  },
  {
    id: "h3",
    title: "Fall of the Berlin Wall",
    year: 1989,
    location: "Berlin",
    country: "Germany",
    description: "Peaceful protests and civil resistance led to the opening of the Berlin Wall checkpoints, marking the beginning of German reunification and the end of the Cold War in Europe.",
    impact: "Led to German reunification and symbolized the end of the Cold War",
    participantCount: "Hundreds of thousands",
    outcome: "success",
    category: "political",
    keyFigures: ["Günter Schabowski"],
  },
  {
    id: "h4",
    title: "Anti-Apartheid Movement - Soweto Uprising",
    year: 1976,
    location: "Soweto, Johannesburg",
    country: "South Africa",
    description: "Student protests against mandatory Afrikaans instruction became a turning point in the struggle against apartheid. Despite violent government response, the uprising galvanized international opposition.",
    impact: "Intensified international pressure against apartheid regime",
    participantCount: "20,000+ students",
    outcome: "partial",
    category: "civil-rights",
    keyFigures: ["Hector Pieterson", "Tsietsi Mashinini"],
  },
  {
    id: "h5",
    title: "Arab Spring - Egyptian Revolution",
    year: 2011,
    location: "Cairo",
    country: "Egypt",
    description: "18 days of sustained protests in Tahrir Square led to the resignation of President Hosni Mubarak after 30 years in power. The movement was part of the broader Arab Spring.",
    impact: "Ended 30 years of authoritarian rule, though followed by political instability",
    participantCount: "2 million+ at peak",
    outcome: "partial",
    category: "political",
    keyFigures: ["Wael Ghonim", "Mohamed ElBaradei"],
  },
  {
    id: "h6",
    title: "Velvet Revolution",
    year: 1989,
    location: "Prague",
    country: "Czechoslovakia",
    description: "Non-violent revolution that overthrew the communist government. Student demonstrations grew into nationwide protests, leading to the end of 41 years of communist rule.",
    impact: "Peaceful transition to democracy; inspired similar movements",
    participantCount: "500,000+ in Prague alone",
    outcome: "success",
    category: "political",
    keyFigures: ["Václav Havel", "Alexander Dubček"],
  },
  {
    id: "h7",
    title: "Climate Strikes (Fridays for Future)",
    year: 2019,
    location: "Global",
    country: "Worldwide",
    description: "Youth-led global movement started by Greta Thunberg. On September 20, 2019, an estimated 4 million people in 161 countries participated in the largest climate strike in history.",
    impact: "Elevated climate change as a top political priority; influenced policy discussions",
    participantCount: "4 million+ globally",
    outcome: "ongoing",
    category: "environmental",
    keyFigures: ["Greta Thunberg", "Vanessa Nakate", "Alexandria Villaseñor"],
  },
  {
    id: "h8",
    title: "Women's Suffrage Movement - UK",
    year: 1913,
    location: "London",
    country: "United Kingdom",
    description: "The suffragette movement's most intense year of direct action, including the death of Emily Davison at the Epsom Derby. Decades of activism culminated in women gaining voting rights.",
    impact: "Women gained limited voting rights in 1918, full equality in 1928",
    participantCount: "Tens of thousands over years",
    outcome: "success",
    category: "civil-rights",
    keyFigures: ["Emmeline Pankhurst", "Emily Davison", "Millicent Fawcett"],
  },
];

export const protestFacts: ProtestFact[] = [
  {
    id: "f1",
    title: "Global Protest Surge",
    content: "Between 2017 and 2022, the world experienced the largest wave of protests in human history, with over 900 significant protest movements recorded across 100+ countries.",
    source: "Carnegie Endowment for International Peace",
    category: "trend",
  },
  {
    id: "f2",
    title: "Nonviolent Success Rate",
    content: "Nonviolent protest movements are twice as likely to succeed as violent ones. Research shows that campaigns achieving participation of just 3.5% of the population have never failed.",
    source: "Erica Chenoweth, Harvard Kennedy School",
    category: "statistic",
  },
  {
    id: "f3",
    title: "Youth Leadership",
    content: "Over 60% of recent global protest movements have been initiated or significantly driven by people under 35 years old, marking a generational shift in civic activism.",
    source: "Global Protest Tracker",
    category: "trend",
  },
  {
    id: "f4",
    title: "Digital Mobilization",
    content: "Social media has reduced protest organization time from months to days. The 2011 Egyptian revolution was organized in just 18 days, largely through Facebook and Twitter.",
    category: "impact",
  },
  {
    id: "f5",
    title: "Economic Protests Rising",
    content: "Cost-of-living protests have increased by 400% since 2020, with inflation and economic inequality becoming the leading causes of civil unrest globally.",
    source: "Armed Conflict Location & Event Data Project",
    category: "trend",
  },
  {
    id: "f6",
    title: "Longest Continuous Protest",
    content: "The Greenham Common Women's Peace Camp protested nuclear weapons for 19 years (1981-2000), becoming the longest continuous protest camp in history.",
    category: "historical",
  },
  {
    id: "f7",
    title: "Climate Activism Growth",
    content: "Environmental protests increased by 300% between 2010 and 2020, with climate change becoming one of the top three causes for global demonstrations.",
    source: "Global Nonviolent Action Database",
    category: "statistic",
  },
  {
    id: "f8",
    title: "Women-Led Movements",
    content: "Movements with significant female participation are 4% more likely to achieve their goals and tend to be more nonviolent in their approach.",
    source: "Journal of Peace Research",
    category: "statistic",
  },
];

export const movementTimelines: MovementTimeline[] = [
  {
    id: "t1",
    movement: "Civil Rights Movement",
    description: "The American Civil Rights Movement fought for equal rights for African Americans, dismantling legal segregation and securing voting rights.",
    events: [
      { year: 1955, event: "Montgomery Bus Boycott begins", significance: "First major nonviolent resistance; lasted 381 days" },
      { year: 1960, event: "Greensboro sit-ins", significance: "Sparked sit-in movement across the South" },
      { year: 1963, event: "March on Washington", significance: "250,000+ attend; King delivers 'I Have a Dream'" },
      { year: 1964, event: "Civil Rights Act signed", significance: "Outlawed discrimination based on race, color, religion, sex, or national origin" },
      { year: 1965, event: "Selma to Montgomery marches", significance: "Led directly to Voting Rights Act" },
    ],
  },
  {
    id: "t2",
    movement: "Labor Rights Movement",
    description: "The global labor movement has fought for workers' rights, fair wages, and safe working conditions for over two centuries.",
    events: [
      { year: 1886, event: "Haymarket Affair, Chicago", significance: "Led to international May Day celebrations" },
      { year: 1911, event: "Triangle Shirtwaist Factory Fire", significance: "Spurred workplace safety legislation" },
      { year: 1936, event: "Flint Sit-Down Strike", significance: "Established UAW power; legitimized sit-down strikes" },
      { year: 1968, event: "Memphis Sanitation Strike", significance: "Where MLK delivered final speech; workers won recognition" },
      { year: 2021, event: "Great Resignation / Labor revival", significance: "Renewed worker organizing across industries" },
    ],
  },
  {
    id: "t3",
    movement: "Environmental Movement",
    description: "From conservation to climate activism, the environmental movement has evolved to address the planet's most pressing ecological challenges.",
    events: [
      { year: 1962, event: "Silent Spring published", significance: "Sparked modern environmental movement" },
      { year: 1970, event: "First Earth Day", significance: "20 million Americans participated; led to EPA creation" },
      { year: 1997, event: "Kyoto Protocol adopted", significance: "First international climate treaty with binding targets" },
      { year: 2018, event: "Greta Thunberg begins school strikes", significance: "Launched global youth climate movement" },
      { year: 2019, event: "Global Climate Strike", significance: "4 million+ participants across 161 countries" },
    ],
  },
];

export async function fetchHistoricalProtests(): Promise<HistoricalProtest[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return historicalProtests;
}

export async function fetchProtestFacts(): Promise<ProtestFact[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return protestFacts;
}

export async function fetchMovementTimelines(): Promise<MovementTimeline[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return movementTimelines;
}

export function getProtestStats(protests: Protest[]) {
  const active = protests.filter(p => p.status === "active").length;
  const planned = protests.filter(p => p.status === "planned").length;
  const past = protests.filter(p => p.status === "past").length;
  const verified = protests.filter(p => p.verification === "verified").length;
  const totalParticipants = protests.reduce((sum, p) => sum + (p.participantCount || 0), 0);
  const countries = new Set(protests.map(p => p.location.country)).size;
  
  return { active, planned, past, verified, totalParticipants, countries };
}
