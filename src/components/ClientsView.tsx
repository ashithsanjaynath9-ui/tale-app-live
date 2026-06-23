import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Eye, Filter, Users, FolderOpen, X, Trash2, AlertTriangle, Sparkles } from 'lucide-react';
import { ClientCompany, Narrative } from '../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import AutomatedAnalysisView from './AutomatedAnalysisView';

interface ClientsViewProps {
  clients: ClientCompany[];
  onAddClient: (name: string) => void;
  onDeleteClient: (name: string) => void;
  narratives: Narrative[];
  onNavigateToBuilder: (clientId: string) => void;
}

export default function ClientsView({ clients, onAddClient, onDeleteClient, narratives, onNavigateToBuilder }: ClientsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientIndustry, setNewClientIndustry] = useState('');
  const [newClientEmployees, setNewClientEmployees] = useState('');
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for automated analysis
  const [analyzingClient, setAnalyzingClient] = useState<{ id: string; name: string; industry: string } | null>(null);

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('client_companies')
        .insert([{
          user_id: '00000000-0000-0000-0000-000000000001',
          name: newClientName,
          industry: newClientIndustry || 'Technology',
          employee_count: parseInt(newClientEmployees) || 0
        }])
        .select();

      if (error) throw error;

      const newClientId = data?.[0]?.id || Date.now().toString();
      
      toast.success('Client added! Starting automated analysis...');
      
      setAnalyzingClient({
        id: newClientId,
        name: newClientName,
        industry: newClientIndustry || 'Technology'
      });
      
      setNewClientName('');
      setNewClientIndustry('');
      setNewClientEmployees('');
      setIsAddingClient(false);
    } catch (err: any) {
      console.error('Full error:', err);
      toast.error(`Failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);

    try {
      await supabase.from('narratives').delete().eq('client_company_id', clientToDelete.id);
      const { error } = await supabase.from('client_companies').delete().eq('id', clientToDelete.id);
      if (error) throw error;
      
      toast.success(`"${clientToDelete.name}" deleted successfully.`);
      onDeleteClient(clientToDelete.name);
      setClientToDelete(null);
      setIsDeleting(false);
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
      setIsDeleting(false);
    }
  };

  const handleAnalysisComplete = () => {
    setAnalyzingClient(null);
    onAddClient(analyzingClient?.name || 'New Client');
    window.location.reload();
  };

  const uniqueIndustries = Array.from(new Set(clients.map(c => c.industry || 'Technology')));
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (industryFilter === 'all' || client.industry === industryFilter);
  });

  // --- SHOW AUTOMATED ANALYSIS VIEW ---
  if (analyzingClient) {
    return (
      <AutomatedAnalysisView
        clientId={analyzingClient.id}
        clientName={analyzingClient.name}
        clientIndustry={analyzingClient.industry}
        onComplete={handleAnalysisComplete}
      />
    );
  }

  // --- EMPTY STATE: NO CLIENTS ---
  if (clients.length === 0) {
    return (
      <div className="space-y-8 select-none">
        <div className="border-b border-[#222] pb-8">
          <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-mono block mb-1">CLIENT ENTERPRISES</span>
          <h1 className="text-3xl font-light font-display serif-italic text-white">Portfolio Companies</h1>
        </div>
        {!isAddingClient ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-[400px] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-12">
              <div className="w-24 h-24 bg-[#1a1a1a] border border-[#222] rounded-full flex items-center justify-center mx-auto mb-6"><Users size={40} className="text-zinc-600" /></div>
              <h3 className="text-2xl font-light serif-italic text-white mb-3">No Portfolio Companies</h3>
              <p className="text-sm text-zinc-500 font-light mb-8 leading-relaxed">Your agency portfolio is empty. Add your first client to start managing narratives.</p>
              <button onClick={() => setIsAddingClient(true)} className="px-6 py-3 bg-[#d4af37] text-black font-bold uppercase text-[9px] font-mono tracking-widest hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"><Plus size={14} /> Add Your First Client</button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-[#0a0a0a] border border-[#d4af37]/20 max-w-3xl mx-auto">
            <h3 className="text-xs font-mono tracking-widest text-white uppercase mb-4">Add Your First Portfolio Company</h3>
            <form onSubmit={handleAddClientSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">Company Name</label><input type="text" required value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="w-full px-3 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" /></div>
              <div><label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">Industry</label><input type="text" value={newClientIndustry} onChange={(e) => setNewClientIndustry(e.target.value)} className="w-full px-3 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" /></div>
              <div><label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">Employee Count</label><input type="number" value={newClientEmployees} onChange={(e) => setNewClientEmployees(e.target.value)} className="w-full px-3 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" /></div>
              <div className="flex items-end gap-2"><button type="submit" className="flex-1 py-2 bg-[#d4af37] text-black font-bold uppercase text-[9px] font-mono tracking-widest cursor-pointer hover:brightness-110 transition-colors">Add Client</button><button type="button" onClick={() => setIsAddingClient(false)} className="px-4 py-2 border border-[#222] text-[9px] uppercase tracking-widest cursor-pointer hover:border-white transition-colors">Cancel</button></div>
            </form>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      <div className="border-b border-[#222] pb-8">
        <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-mono block mb-1">CLIENT ENTERPRISES</span>
        <h1 className="text-3xl font-light font-display serif-italic text-white">Portfolio Companies</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500"><Search size={14} /></span>
            <input type="text" placeholder="FILTER BRANDS OR SECTORS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white placeholder-zinc-600" />
          </div>
          <div className="relative">
            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="pl-9 pr-8 py-2.5 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white appearance-none cursor-pointer">
              <option value="all">All Industries</option>
              {uniqueIndustries.map(ind => (<option key={ind} value={ind}>{ind}</option>))}
            </select>
          </div>
        </div>
        <button onClick={() => setIsAddingClient(true)} className="px-5 py-2.5 bg-white text-black hover:bg-[#d4af37] font-bold uppercase text-[9px] font-mono tracking-widest cursor-pointer transition-colors flex items-center gap-2"><Plus size={12} /> Add Client</button>
      </div>

      {isAddingClient && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-[#0a0a0a] border border-[#d4af37]/20">
          <h3 className="text-xs font-mono tracking-widest text-white uppercase mb-4">Add New Portfolio Company</h3>
          <form onSubmit={handleAddClientSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">Company Name</label><input type="text" required value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="w-full px-3 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" /></div>
            <div><label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">Industry</label><input type="text" value={newClientIndustry} onChange={(e) => setNewClientIndustry(e.target.value)} className="w-full px-3 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" /></div>
            <div><label className="text-[9px] font-mono uppercase text-zinc-400 block mb-1">Employee Count</label><input type="number" value={newClientEmployees} onChange={(e) => setNewClientEmployees(e.target.value)} className="w-full px-3 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" /></div>
            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 py-2 bg-[#d4af37] text-black font-bold uppercase text-[9px] font-mono tracking-widest cursor-pointer hover:brightness-110 transition-colors">Add</button>
              <button type="button" onClick={() => setIsAddingClient(false)} className="px-4 py-2 border border-[#222] text-[9px] uppercase tracking-widest cursor-pointer hover:border-white transition-colors">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-[#0a0a0a] border border-[#222] hover:border-white/10 transition-all group relative">
            <button onClick={() => setClientToDelete({ id: client.id, name: client.name })} className="absolute top-3 right-3 p-1.5 bg-red-950/30 border border-red-900/30 rounded opacity-0 group-hover:opacity-100 hover:bg-red-900/50 transition-all cursor-pointer"><Trash2 size={12} className="text-red-400" /></button>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span><span className="text-[9px] font-mono tracking-widest text-[#d4af37] uppercase">Active Partner</span></div>
              <div className="w-8 h-8 bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-xs font-serif text-white">{client.name.charAt(0).toUpperCase()}</div>
            </div>
            <h3 className="text-lg font-light font-display serif-italic text-white mb-2">{client.name}</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 border border-[#222] px-2 py-0.5">{client.industry}</span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 border border-[#222] px-2 py-0.5">{client.employeeCount} Headspace</span>
            </div>
            
            {/* UPDATED FOOTER WITH AI ANALYZE BUTTON */}
            <div className="flex items-center justify-between pt-4 border-t border-[#222]">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase text-zinc-500">Narratives:</span>
                <span className="text-[10px] font-mono text-white font-semibold">{narratives.filter(n => n.clientCompanyId === client.id).length}</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setAnalyzingClient({ id: client.id, name: client.name, industry: client.industry })} 
                  className="flex items-center gap-1 text-[9px] font-mono tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors uppercase cursor-pointer"
                >
                  <Sparkles size={11} /> AI Analyze
                </button>
                <button onClick={() => onNavigateToBuilder(client.id)} className="flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#d4af37] hover:text-white transition-colors uppercase cursor-pointer">
                  <Eye size={11} /> Inspect
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[#222]">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4"><FolderOpen size={28} className="text-zinc-600" /></div>
          <p className="text-sm text-zinc-500 font-light mb-4">No clients found matching your filters.</p>
          <button onClick={() => { setSearchTerm(''); setIndustryFilter('all'); }} className="text-[9px] font-mono tracking-widest text-[#d4af37] hover:text-white transition-colors uppercase cursor-pointer">Clear All Filters</button>
        </div>
      )}

      <AnimatePresence>
        {clientToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isDeleting && setClientToDelete(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a0a] border border-red-900/30 shadow-2xl z-10 mx-4">
              <div className="flex items-center gap-3 p-6 border-b border-[#222]">
                <div className="w-10 h-10 bg-red-950/30 border border-red-900/30 rounded-full flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
                <div className="flex-1"><h3 className="text-sm font-mono tracking-widest text-white uppercase font-semibold">Confirm Deletion</h3><p className="text-[10px] font-mono text-zinc-500 mt-0.5">This action cannot be undone</p></div>
                <button onClick={() => !isDeleting && setClientToDelete(null)} disabled={isDeleting} className="p-1 text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4"><p className="text-sm text-zinc-300 font-light leading-relaxed">Are you sure you want to permanently delete <span className="text-white font-medium">"{clientToDelete.name}"</span>?</p><div className="p-4 bg-red-950/20 border border-red-900/20 rounded"><p className="text-xs text-red-300 font-mono leading-relaxed">⚠ This will also delete all associated narratives.</p></div></div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[#222] bg-[#050505]">
                <button onClick={() => setClientToDelete(null)} disabled={isDeleting} className="px-5 py-2.5 border border-[#222] text-[9px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-all disabled:opacity-50">Cancel</button>
                <button onClick={handleDeleteClient} disabled={isDeleting} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-mono uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center gap-2">{isDeleting ? (<><div className="w-3 h-3 border border-white border-t-transparent animate-spin rounded-full" /><span>Deleting...</span></>) : (<><Trash2 size={11} /><span>Delete Permanently</span></>)}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}