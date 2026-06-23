import { Agency, ClientCompany, Narrative, Candidate, TalentInsight } from './types';

// Raw mock narratives for initial seeds
const seedNarrativeVektor = `### VEKTOR AUTOMOTIVE: THE SPEED OF MIND

**THE NARRATIVE ARCHETYPE**
At Vektor, we do not build commuter cars. We engineer high-performance computed systems that happen to have wheels. Founded at the intersection of aerospace computing and luxury design, Vektor is creating the next decade of luxury carbon-fiber electric platforms.

**CORE CULTURE & VALUES**
*   **Bespoke Craftsmanship**: We believe that every line of code, like every stitch of leather, must be deliberate, pristine, and elegant.
*   **Decentralized agency**: We do not have managers who track hours. We have owners who execute with profound architectural responsibility.
*   **Quiet Luxury**: Our workspaces are distraction-free sanctuaries. We choose focus over hype, engineering substance over marketing vanity.

**THE OUTCOMES & IMPACT**
The candidates we seek are not merely searching for a role; they are seeking their life’s masterpiece. As our agency partner, TALE platform predicts that highlighting our custom track-day programs and the custom-machined tooling stipend will elevate candidates' offer acceptance rates by 22% in the Q3 engineering demographic.`;

const seedNarrativeAether = `### AETHER BIO: CLINICAL WISDOM, ACCELERATED

**THE MISSION CONCEPT**
Aether is a molecular machine laboratory developing enzyme-based target therapeutics. We believe that biology is the ultimate coding language, and computational chemistry is the interface.

**CULTURAL SPECIFICS**
*   **Scientific Humility**: We celebrate the hypothesis that failed, provided it was executed with meticulous experimental rigor.
*   **Universal Flexibility**: No core hours, no unnecessary synchronous video calls. We judge our team purely on scientific breakthrough, not virtual attendance.
*   **Deep Research Sabbaticals**: Every 18 months, our engineers take a fully-funded 4-week research deep-dive on any scientific topic of their choosing.

**MARKET POSITION**
By positioning Aether as a quiet research haven rather than a high-pressure commercial biotech, our conversion rate of academic PhDs to commercial scientists has doubled.`;

const INITIAL_AGENCIES: Agency[] = [
  {
    id: 'agency-1',
    name: 'Sovereign Talent Group',
    slug: 'sovereign-talent',
    subscriptionTier: 'Enterprise Suite',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_CLIENTS: ClientCompany[] = [
  {
    id: 'client-1',
    agencyId: 'agency-1',
    name: 'Vektor Automotive',
    industry: 'Automotive Tech',
    employeeCount: 340,
    logoUrl: 'V',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'client-2',
    agencyId: 'agency-1',
    name: 'Aether Bio',
    industry: 'Biotechnology',
    employeeCount: 85,
    logoUrl: 'A',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'client-3',
    agencyId: 'agency-1',
    name: 'Helix Product Design',
    industry: 'Luxury Hardware & Design',
    employeeCount: 45,
    logoUrl: 'H',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_NARRATIVES: Narrative[] = [
  {
    id: 'narrative-1',
    clientCompanyId: 'client-1',
    title: 'Vektor Automotive: Built for Acceleration',
    values: 'Bespoke Craftsmanship, Decentralized Agency, Quiet Luxury',
    benefits: 'Track-day programs, Custom physical machine tools, Family medical coverage, Distraction-free space',
    mission: 'To transition automotive dynamics into calculated masterpieces.',
    competitorLandscape: 'Competitors focus on massive scale and mass-production velocity.',
    targetCandidateProfile: 'Hardware engineers seeking deep, uninterrupted technical authorship.',
    content: seedNarrativeVektor,
    matchScore: 92,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'narrative-2',
    clientCompanyId: 'client-2',
    title: 'Aether Bio: Scientific Wisdom, Accelerated',
    values: 'Scientific Humility, Universal Flexibility, Deep Sabbaticals',
    benefits: 'Asynchronous work, Research deep dive sponsorships, Premium laboratory tools',
    mission: 'To write molecules the way developers write software.',
    competitorLandscape: 'Biotech giants with rigid corporate structures and hierarchy.',
    targetCandidateProfile: 'Academic PhD scientists looking for deep intellectual freedom.',
    content: seedNarrativeAether,
    matchScore: 84,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    agencyId: 'agency-1',
    clientCompanyId: 'client-1',
    name: 'Sarah Lin',
    matchScore: 94,
    role: 'Senior Battery Systems Architect',
    status: 'interviewing',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cand-2',
    agencyId: 'agency-1',
    clientCompanyId: 'client-3',
    name: 'Marcus Vance',
    matchScore: 88,
    role: 'Principal Interaction Designer',
    status: 'offered',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cand-3',
    agencyId: 'agency-1',
    clientCompanyId: 'client-2',
    name: 'Dr. Elena Rostova',
    matchScore: 91,
    role: 'Lead Computational Geneticist',
    status: 'interviewing',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cand-4',
    agencyId: 'agency-1',
    clientCompanyId: 'client-1',
    name: 'Julian Drake',
    matchScore: 82,
    role: 'Principal ML Thermal Controller',
    status: 'hired',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cand-5',
    agencyId: 'agency-1',
    clientCompanyId: 'client-2',
    name: 'Aris Thorne',
    matchScore: 78,
    role: 'Senior Enzyme Synthesist',
    status: 'rejected',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_INSIGHTS: TalentInsight[] = [
  {
    id: 'insight-1',
    category: 'Competitor Activity',
    insight: 'Competitor V announced a 4-day work week program',
    description: 'This operational shift led to a 40% increase in senior mobile engineer applications for their teams. Consider advising client companies in corresponding sectors to highlight asynchronous flexibility or quiet focus hours to retain competitive edge.',
    trend: '+40% application surge',
    trendDirection: 'up',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'insight-2',
    category: 'Talent Sentiment',
    insight: 'Rise in demand for "Inward-Facing Workspaces"',
    description: 'Our indexes show high-tier engineers are increasingly rejecting traditional hyper-social office layouts. Narratives that explicitly mention "distraction-free, quiet, dedicated team labs" see an 18% lift in engagement.',
    trend: '+18% client engagement lift',
    trendDirection: 'up',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'insight-3',
    category: 'Compensation Intelligence',
    insight: 'Stock liquidity transparency preferred over higher paper value',
    description: 'Candidates are heavily discounting non-liquid private options in the current climate. Outlining clear secondary sale schedules or liquid compensation buffers in narratives has shown a 12% rise in final offer completions.',
    trend: '+12% offer conversions',
    trendDirection: 'up',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export interface ActivityLog {
  id: string;
  agencyId: string;
  text: string;
  timestamp: string;
  type: 'narrative' | 'client' | 'candidate' | 'system';
}

const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    agencyId: 'agency-1',
    text: 'Client Vektor Automotive: New deep employer narrative published',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    type: 'narrative'
  },
  {
    id: 'act-2',
    agencyId: 'agency-1',
    text: 'Candidate Marcus Vance: Recieved offer from Helix Product Design (Match: 88%)',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'candidate'
  },
  {
    id: 'act-3',
    agencyId: 'agency-1',
    text: 'Client Helix Product Design: Added to portfolio',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'client'
  },
  {
    id: 'act-4',
    agencyId: 'agency-1',
    text: 'Client Aether Bio: Updated cultural values core guidelines',
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'client'
  },
  {
    id: 'act-5',
    agencyId: 'agency-1',
    text: 'System: Intelligence indexes updated',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'system'
  }
];

export const getStoredData = <T>(key: string, initial: T): T => {
  const value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(value);
  } catch {
    return initial;
  }
};

export const saveStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export class AgencyDatabase {
  static getAgency(): Agency {
    const agencies = getStoredData<Agency[]>('tale_agencies', INITIAL_AGENCIES);
    return agencies[0];
  }

  static updateAgency(name: string, logoUrl?: string): Agency {
    const agencies = getStoredData<Agency[]>('tale_agencies', INITIAL_AGENCIES);
    agencies[0].name = name;
    if (logoUrl) agencies[0].logoUrl = logoUrl;
    saveStoredData('tale_agencies', agencies);
    this.addLog(`Agency settings updated: Name changed to "${name}"`, 'system');
    return agencies[0];
  }

  static getClients(): ClientCompany[] {
    return getStoredData<ClientCompany[]>('tale_clients', INITIAL_CLIENTS);
  }

  static addClient(client: Omit<ClientCompany, 'id' | 'agencyId' | 'createdAt'>): ClientCompany {
    const clients = this.getClients();
    const newClient: ClientCompany = {
      ...client,
      id: `client-${Date.now()}`,
      agencyId: 'agency-1',
      createdAt: new Date().toISOString()
    };
    clients.unshift(newClient);
    saveStoredData('tale_clients', clients);
    this.addLog(`Client "${newClient.name}" added to agency portfolio`, 'client');
    return newClient;
  }

  static getNarratives(): Narrative[] {
    return getStoredData<Narrative[]>('tale_narratives', INITIAL_NARRATIVES);
  }

  static addNarrative(narrative: Omit<Narrative, 'id' | 'createdAt'>): Narrative {
    const narratives = this.getNarratives();
    const newNarrative: Narrative = {
      ...narrative,
      id: `narrative-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    narratives.unshift(newNarrative);
    saveStoredData('tale_narratives', narratives);

    // Also update activities
    const client = this.getClients().find(c => c.id === narrative.clientCompanyId);
    if (client) {
      this.addLog(`New Narrative built for "${client.name}" with dynamic score of ${narrative.matchScore}%`, 'narrative');
    }

    return newNarrative;
  }

  static getCandidates(): Candidate[] {
    return getStoredData<Candidate[]>('tale_candidates', INITIAL_CANDIDATES);
  }

  static getInsights(): TalentInsight[] {
    return getStoredData<TalentInsight[]>('tale_insights', INITIAL_INSIGHTS);
  }

  static getActivities(): ActivityLog[] {
    return getStoredData<ActivityLog[]>('tale_activities', INITIAL_ACTIVITIES);
  }

  static addLog(text: string, type: ActivityLog['type']): void {
    const activities = this.getActivities();
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      agencyId: 'agency-1',
      text,
      timestamp: new Date().toISOString(),
      type
    };
    activities.unshift(newActivity);
    // Keep last 30 logs
    saveStoredData('tale_activities', activities.slice(0, 30));
  }

  static resetDatabase(): void {
    localStorage.removeItem('tale_agencies');
    localStorage.removeItem('tale_clients');
    localStorage.removeItem('tale_narratives');
    localStorage.removeItem('tale_candidates');
    localStorage.removeItem('tale_insights');
    localStorage.removeItem('tale_activities');
    localStorage.removeItem('tale_auth_user');
  }
}
