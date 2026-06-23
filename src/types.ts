export type Page = 
  | 'landing' 
  | 'login' 
  | 'dashboard' 
  | 'clients' 
  | 'narrative-builder' 
  | 'talent-index' 
  | 'settings' 
  | 'impact-intelligence';

export interface ClientCompany {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  createdAt: string;
}

export interface Narrative {
  id: string;
  clientCompanyId: string;
  title: string;
  content: string;
  matchScore: number;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  status: string;
}

export interface TalentInsight {
  id: string;
  title: string;
  content: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Agency {
  name: string;
  logoUrl?: string;
}