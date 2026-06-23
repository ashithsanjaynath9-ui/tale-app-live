import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  CreditCard, 
  Users, 
  Link2, 
  Check, 
  Upload, 
  Building2, 
  Mail, 
  Plus, 
  Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SettingsViewProps {
  agency: any;
  onUpdateAgency: (name: string, logoUrl?: string) => void;
}

export default function SettingsView({ agency, onUpdateAgency }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'team' | 'integrations'>('profile');
  
  const [agencyName, setAgencyName] = useState(agency?.name || '');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Ashith Sanjaynath', email: 'ashith@sovereign.agency', role: 'Agency Principal', status: 'Active' },
  ]);

  const [integrations, setIntegrations] = useState([
    { id: 'greenhouse', name: 'Greenhouse ATS', type: 'ATS Provider', desc: 'Sync client openings and candidate pipelines seamlessly.', connected: true },
    { id: 'lever', name: 'Lever Recruiter API', type: 'ATS Provider', desc: 'Instantly pull job details and values rules.', connected: false },
    { id: 'workday', name: 'Workday Enterprise', type: 'Enterprise ERP', desc: 'Secure enterprise scale candidate database indexing.', connected: false },
    { id: 'slack', name: 'Slack Notifications', type: 'Communication', desc: 'Publish telemetry notifications to recruitment channels.', connected: true }
  ]);

  useEffect(() => {
    loadAgencySettings();
  }, []);

  const loadAgencySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agency_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setAgencyName(data.agency_name);
        setAgencyEmail(data.contact_email || '');
        if (data.logo_url) setLogoPreview(data.logo_url);
      } else {
        setAgencyName(agency?.name || 'Sovereign Talent Group');
        setAgencyEmail('concierge@sovereignty.agency');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim()) return;

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in first.');
        setIsSaving(false);
        return;
      }

      // First, check if a record exists for this user
      const { data: existingRecord, error: selectError } = await supabase
        .from('agency_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing record:', selectError);
        toast.error('Failed to check existing settings.');
        setIsSaving(false);
        return;
      }

      let error;

      if (existingRecord) {
        // Record exists - UPDATE it
        const { error: updateError } = await supabase
          .from('agency_settings')
          .update({
            agency_name: agencyName,
            contact_email: agencyEmail,
            logo_url: logoPreview,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        error = updateError;
      } else {
        // Record doesn't exist - INSERT it
        const { error: insertError } = await supabase
          .from('agency_settings')
          .insert([{
            user_id: user.id,
            agency_name: agencyName,
            contact_email: agencyEmail,
            logo_url: logoPreview,
            updated_at: new Date().toISOString()
          }]);
        
        error = insertError;
      }

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Failed to save: ${error.message}`);
        setIsSaving(false);
        return;
      }

      // Success!
      onUpdateAgency(agencyName, logoPreview || undefined);
      setIsProfileSaved(true);
      toast.success('Identity core updated successfully!');
      setTimeout(() => setIsProfileSaved(false), 2000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    );
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      toast.success(`${integration.name} ${integration.connected ? 'disconnected' : 'connected'} successfully!`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none font-sans">
      <div className="border-b border-charcoal pb-8">
        <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-mono block mb-1">
          AGENCY CONFIGURATOR
        </span>
        <h1 className="text-3xl font-light font-display serif-italic text-white">
          System Settings
        </h1>
      </div>

      <div className="flex flex-wrap border-b border-charcoal bg-black/40 p-1 font-mono text-[9px] tracking-widest uppercase text-zinc-400">
        {[
          { id: 'profile', label: 'Agency Profile', icon: Sliders },
          { id: 'billing', label: 'Licensing & Settlement', icon: CreditCard },
          { id: 'team', label: 'Access Control', icon: Users },
          { id: 'integrations', label: 'ATS Pipelines', icon: Link2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 hover:text-white transition-colors cursor-pointer relative ${
                isActive ? 'text-gold font-semibold bg-[#0a0a0a] border-x border-[#1a1a1a]' : 'text-zinc-400'
              }`}
            >
              <Icon size={12} className={isActive ? 'text-gold' : 'text-zinc-500'} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div layoutId="settings-tab-line" className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#d4af37]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-[#0a0a0a] border border-charcoal p-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/5 tab-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-w-xl space-y-6"
            >
              <div>
                <h2 className="text-[10px] font-mono tracking-[0.2em] text-white uppercase mb-1 font-semibold">AGENCY IDENTITY</h2>
                <p className="text-xs text-zinc-400 font-light font-sans">Update primary brand moniker and communications indices.</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wide uppercase font-mono text-zinc-400">Sovereign Brand Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500"><Building2 size={13} /></span>
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-charcoal focus:border-gold/30 focus:outline-none text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wide uppercase font-mono text-zinc-400">Primary Contact Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500"><Mail size={13} /></span>
                    <input
                      type="email"
                      required
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-charcoal focus:border-gold/30 focus:outline-none text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-wide uppercase font-mono text-zinc-400">Agency Monogram Logo (SVG / PNG)</label>
                  <div className="p-8 bg-black border border-dashed border-charcoal flex flex-col items-center justify-center text-center cursor-pointer hover:border-gold/25 transition-colors">
                    <Upload size={16} className="text-[#d4af37] mb-2" />
                    <p className="text-[9px] font-mono tracking-widest text-white uppercase mb-1">Drag and drop vector monogram</p>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase">Max scale: 1MB. Fits square blocks best.</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-3 bg-white text-black hover:bg-gold font-bold uppercase text-[9px] font-mono tracking-widest cursor-pointer transition-colors border border-[#1a1a1a] disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Identity Core'}
                  </button>

                  {isProfileSaved && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-mono text-emerald-400 flex items-center gap-1"
                    >
                      <Check size={14} /> Brand coordinates updated.
                    </motion.span>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-[10px] font-mono tracking-[0.2em] text-white uppercase mb-1 font-semibold">SOVEREIGN SETTLEMENTS</h2>
                <p className="text-xs text-zinc-400 font-light font-sans">Review software lease variables, registered seats, and transaction ledgers.</p>
              </div>

              <div className="p-6 bg-black border border-charcoal max-w-xl relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 bg-gold/10 text-gold text-[8px] font-mono border border-gold/15 uppercase tracking-widest font-semibold">TALE ENTERPRISE</span>
                  <div className="text-base font-light font-display text-white serif-italic">Sovereign Recruiter License Suite</div>
                  <p className="text-xs font-light text-zinc-400 leading-relaxed font-sans mt-1">
                    Includes unrestricted tenant company registries, real-time telemetry indices scraping, and prioritized pipeline queues.
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase block">License Fee</span>
                  <span className="text-2xl font-light font-serif text-white block">$10,000<span className="text-[10px] font-mono text-gold ml-1">/ mo</span></span>
                  <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/20 border border-emerald-400/20 px-2 py-0.5 mt-2 inline-block">Active Lease</span>
                </div>
              </div>

              <div className="max-w-xl space-y-4">
                <h3 className="text-[10px] font-mono tracking-widest text-white uppercase font-semibold">Settlement Mechanism</h3>
                <div className="p-5 bg-black border border-charcoal flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-[#1a1a1a] border border-[#333] flex items-center justify-center font-serif text-[10px] text-zinc-400 italic">VISA</div>
                    <div>
                      <span className="text-xs font-mono text-white block">Sovereign Mastercard ending in 3802</span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Settles automatically on 1st of every month</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-gold uppercase hover:text-white cursor-pointer select-none">Update</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-mono tracking-widest text-white uppercase font-semibold">Historical Settlement Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-charcoal">
                    <thead>
                      <tr className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                        <th className="pb-3">BILLING TIMESTAMP</th>
                        <th className="pb-3">PORTFOLIO STATEMENT</th>
                        <th className="pb-3 text-right">SETTLED AMOUNT</th>
                        <th className="pb-3 text-center">CONTRACT STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal font-mono text-[11px]">
                      <tr>
                        <td className="py-4 text-white">JUNE 01, 2026</td>
                        <td className="py-4 font-sans font-light text-zinc-400">Sovereign Agency License (June Period)</td>
                        <td className="py-4 text-right text-white">$10,000</td>
                        <td className="py-4 text-center"><span className="text-[8px] text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 bg-emerald-950/20 uppercase font-semibold">Settled</span></td>
                      </tr>
                      <tr>
                        <td className="py-4 text-white">MAY 01, 2026</td>
                        <td className="py-4 font-sans font-light text-zinc-400">Sovereign Agency License (May Period)</td>
                        <td className="py-4 text-right text-white">$10,000</td>
                        <td className="py-4 text-center"><span className="text-[8px] text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 bg-emerald-950/20 uppercase font-semibold">Settled</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-[10px] font-mono tracking-[0.2em] text-white uppercase mb-1 font-semibold">ACCESS MANAGEMENT</h2>
                <p className="text-xs text-zinc-400 font-light font-sans">Delegate licensed seats to executive partner recruiters and tech search consultants.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-mono tracking-widest text-white uppercase font-semibold">Registered Access Seats ({teamMembers.length} / 5 slots)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-charcoal">
                    <thead>
                      <tr className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                        <th className="pb-3">Individual Partner</th>
                        <th className="pb-3">Communications Node</th>
                        <th className="pb-3">Functional Role</th>
                        <th className="pb-3 text-center">Seat Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal font-mono text-[11px]">
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-white/[0.01]">
                          <td className="py-4 font-sans font-medium text-white">{member.name}</td>
                          <td className="py-4 font-sans font-light text-zinc-400">{member.email}</td>
                          <td className="py-4 text-[#d4af37] uppercase tracking-wider text-[9px]">{member.role}</td>
                          <td className="py-4 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-none text-[8px] uppercase tracking-widest border font-semibold ${
                              member.status === 'Active' 
                                ? 'bg-emerald-950/20 text-[#00E396] border-emerald-500/20' 
                                : 'bg-amber-950/25 text-amber-400 border-amber-400/20'
                            }`}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-[10px] font-mono tracking-[0.2em] text-white uppercase mb-1 font-semibold">ATS DATA PIPELINES</h2>
                <p className="text-xs text-zinc-400 font-light font-sans">Synchronize values parameters, benefits rules, and job descriptions out of your active systems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                {integrations.map((item) => (
                  <div 
                    key={item.id}
                    className="p-6 bg-black border border-charcoal flex flex-col justify-between group hover:border-[#333] transition-all h-52 text-left"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono tracking-widest bg-[#0a0a0a] border border-charcoal px-2.5 py-0.5 text-zinc-400 uppercase">
                          {item.type}
                        </span>
                        
                        <button
                          onClick={() => toggleIntegration(item.id)}
                          className={`
                            w-10 h-5 p-0.5 rounded-full transition-colors cursor-pointer outline-none relative flex items-center
                            ${item.connected ? 'bg-gold' : 'bg-[#1a1a1a]'}
                          `}
                        >
                          <motion.div
                            layout
                            className="w-4 h-4 bg-black rounded-full"
                            animate={{ x: item.connected ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>

                      <h3 className="text-sm font-light font-display text-white tracking-wide mb-1.5 serif-italic">
                        {item.name}
                      </h3>
                      <p className="text-xs font-light text-zinc-400 leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-charcoal flex justify-between items-center text-[9px] font-mono">
                      <span className="text-zinc-500">Pipeline Link</span>
                      <span className={item.connected ? 'text-emerald-400 uppercase tracking-widest font-semibold' : 'text-zinc-400 uppercase tracking-widest'}>
                        {item.connected ? 'SYNCHRONISED' : 'DISCONNECTED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}