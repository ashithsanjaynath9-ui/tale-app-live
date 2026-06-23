import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Page, ClientCompany, Narrative, Agency } from './types';
import { supabase } from '../lib/supabase';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import NarrativeBuilderView from './components/NarrativeBuilderView';
import TalentIndexView from './components/TalentIndexView';
import SettingsView from './components/SettingsView';
import ImpactIntelligenceView from './components/ImpactIntelligenceView'; // NEW IMPORT

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [authenticatedUser, setAuthenticatedUser] = useState<{ userName: string; agencyName: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tale_theme');
    return saved !== 'light'; 
  });

  const [agency, setAgency] = useState<Agency | null>(null);
  const [clients, setClients] = useState<ClientCompany[]>([]);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const [builderPreselectedClientId, setBuilderPreselectedClientId] = useState<string | undefined>(undefined);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('tale_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const storedActivities = localStorage.getItem('tale_activities');
    if (storedActivities) {
      try { setActivities(JSON.parse(storedActivities)); } catch (err) { console.error(err); }
    }
  }, []);

  const logActivity = (action: string, target: string, status: 'SUCCESS' | 'PENDING' | 'FAILED' = 'SUCCESS') => {
    const newActivity = { id: Date.now().toString(), timestamp: new Date().toISOString(), action, target, status, user: authenticatedUser?.userName || 'System' };
    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 50);
      localStorage.setItem('tale_activities', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchRealData = async () => {
    try {
      const { data: clientsData } = await supabase.from('client_companies').select('*').order('created_at', { ascending: false });
      const { data: narrativesData } = await supabase.from('narratives').select('*').order('created_at', { ascending: false });
      if (clientsData) setClients(clientsData.map((item) => ({ id: item.id, name: item.name, industry: item.industry || 'Technology', employeeCount: item.employee_count || 0, createdAt: item.created_at })) as ClientCompany[]);
      if (narrativesData) setNarratives(narrativesData.map((item) => ({ id: item.id, clientCompanyId: item.client_company_id, title: item.title, content: item.content, matchScore: item.match_score || 0, createdAt: item.created_at })) as Narrative[]);
    } catch (err) { console.error('Error fetching data:', err); } finally { setLoading(false); }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('tale_auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setAuthenticatedUser({ userName: parsed.userName, agencyName: parsed.agencyName });
        setCurrentPage('dashboard');
        fetchRealData();
        const hasLoggedIn = sessionStorage.getItem('tale_has_logged_in');
        if (!hasLoggedIn) { logActivity('SYSTEM_LOGIN', 'Session Initialized', 'SUCCESS'); sessionStorage.setItem('tale_has_logged_in', 'true'); }
      } catch (err) { localStorage.removeItem('tale_auth_user'); setLoading(false); }
    } else { setLoading(false); }
  }, []);

  const handleLoginSuccess = (userName: string, agencyName: string) => {
    setAuthenticatedUser({ userName, agencyName });
    setCurrentPage('dashboard');
    fetchRealData();
    logActivity('SYSTEM_LOGIN', `User: ${userName}`, 'SUCCESS');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('tale_auth_user');
    localStorage.removeItem('tale_activities');
    sessionStorage.removeItem('tale_has_logged_in');
    setAuthenticatedUser(null);
    setCurrentPage('landing');
    setClients([]); setNarratives([]); setActivities([]);
  };

  const handleAddClient = (name: string) => { fetchRealData(); logActivity('CLIENT_CREATED', name, 'SUCCESS'); };
  const handleDeleteClient = (name: string) => { fetchRealData(); logActivity('CLIENT_DELETED', name, 'SUCCESS'); };
  const handleSaveNarrative = (title: string) => { fetchRealData(); logActivity('NARRATIVE_GENERATED', title, 'SUCCESS'); };
  const handleUpdateAgency = (name: string, logoUrl?: string) => { setAgency({ name, logoUrl } as Agency); if (authenticatedUser) setAuthenticatedUser({ ...authenticatedUser, agencyName: name }); };
  const handleRedirectToBuilder = (clientId: string) => { setBuilderPreselectedClientId(clientId); setCurrentPage('narrative-builder'); };
  const handleRequestAccessSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!requestEmail.trim()) return; setRequestSuccess(true); setTimeout(() => { setIsAccessModalOpen(false); setRequestSuccess(false); setRequestEmail(''); setCurrentPage('login'); }, 2200); };

  const renderSidebarItemView = () => {
    if (!agency && authenticatedUser) setAgency({ name: authenticatedUser.agencyName } as Agency);
    switch (currentPage) {
      case 'dashboard': return <DashboardView onNavigateToNarrative={() => setCurrentPage('narrative-builder')} onNavigateToClients={() => setCurrentPage('clients')} clients={clients} narratives={narratives} activities={activities} />;
      case 'clients': return <ClientsView clients={clients} onAddClient={handleAddClient} onDeleteClient={handleDeleteClient} narratives={narratives} onNavigateToBuilder={handleRedirectToBuilder} />;
      case 'narrative-builder': return <NarrativeBuilderView clients={clients} onSaveNarrative={handleSaveNarrative} preselectedClientId={builderPreselectedClientId} />;
      case 'impact-intelligence': return <ImpactIntelligenceView />; // NEW ROUTE
      case 'talent-index': return <TalentIndexView />;
      case 'settings': return <SettingsView agency={agency} onUpdateAgency={handleUpdateAgency} />;
      default: return <DashboardView onNavigateToNarrative={() => setCurrentPage('narrative-builder')} onNavigateToClients={() => setCurrentPage('clients')} clients={clients} narratives={narratives} activities={activities} />;
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent animate-spin rounded-full" /></div>;

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden antialiased flex flex-col relative transition-colors duration-300 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-zinc-900 light-mode'}`}>
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="w-full flex-1">
            <LandingPage onNavigate={(page) => setCurrentPage(page)} onRequestAccess={() => setIsAccessModalOpen(true)} />
          </motion.div>
        )}
        {currentPage === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <LoginPage onBack={() => setCurrentPage('landing')} onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}
        {currentPage !== 'landing' && currentPage !== 'login' && authenticatedUser && (
          <motion.div key="platform" initial={{ opacity: 0, scale: 0.995 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex-1 flex flex-col md:flex-row max-w-full">
            <Sidebar
              currentPage={currentPage}
              onPageChange={(page) => { if (page !== 'narrative-builder') setBuilderPreselectedClientId(undefined); setCurrentPage(page); }}
              agencyName={authenticatedUser.agencyName}
              userName={authenticatedUser.userName}
              onLogout={handleLogout}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
            />
            <main className="flex-1 min-w-0 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto h-screen relative">
              <div className="max-w-7xl mx-auto space-y-12">
                <AnimatePresence mode="wait">
                  <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                    {renderSidebarItemView()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center select-none font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAccessModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xs" />
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full max-w-md bg-[#0a0a0a] border border-[#d4af37]/20 p-8 shadow-2xl z-10 mx-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#d4af37]" /><span className="text-xs font-mono tracking-widest uppercase text-white font-medium">Request TALE Access</span></div>
                <button onClick={() => setIsAccessModalOpen(false)} className="p-1 text-zinc-500 hover:text-white transition-colors"><X size={15} /></button>
              </div>
              {requestSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-950/20 border border-emerald-400/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce"><Check size={20} /></div>
                  <h4 className="text-sm font-semibold tracking-wide text-white">Access Approved</h4>
                </div>
              ) : (
                <form onSubmit={handleRequestAccessSubmit} className="space-y-5 text-left">
                  <p className="text-xs font-light text-zinc-400 leading-relaxed font-sans">TALE operates an exclusive, application-only partner network. Enter your corporate email to fast-track your sandbox credentials.</p>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-wider uppercase font-mono text-zinc-500">Enterprise Email Address</label>
                    <input type="email" required value={requestEmail} onChange={(e) => setRequestEmail(e.target.value)} placeholder="e.g. principal@agency.co" className="w-full px-4 py-3 bg-black border border-white/5 focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#d4af37] hover:brightness-110 text-black font-bold uppercase text-[10px] font-mono tracking-widest cursor-pointer transition-colors">Submit Access Application</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" toastOptions={{ style: { background: isDarkMode ? '#0a0a0a' : '#fff', color: isDarkMode ? '#fff' : '#000', border: `1px solid ${isDarkMode ? '#333' : '#e4e4e7'}`, fontFamily: 'monospace', fontSize: '12px' } }} />
    </div>
  );
}