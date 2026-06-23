import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Search, Sliders, Activity, ShieldCheck, Clock } from 'lucide-react';
import { ClientCompany, Narrative } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface DashboardViewProps {
  onNavigateToNarrative: () => void;
  onNavigateToClients: () => void;
  clients: ClientCompany[];
  narratives: Narrative[];
  activities: any[]; // NEW: Receive activities
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-[#d4af37]/30 p-3 shadow-2xl">
        <p className="text-[9px] font-mono text-[#d4af37] uppercase tracking-widest mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs font-mono text-white">{entry.name}: <span className="text-[#d4af37] font-semibold">{entry.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardView({ onNavigateToNarrative, onNavigateToClients, clients, narratives, activities }: DashboardViewProps) {
  const [narrativeSearch, setNarrativeSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');

  const totalClients = clients.length;
  const totalNarratives = narratives.length;
  const avgMatchScore = narratives.length > 0 ? Math.round(narratives.reduce((sum, n) => sum + n.matchScore, 0) / narratives.length) : 0;

  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString('en-US', { weekday: 'short' });
  });
  const velocityData = last7Days.map(day => {
    const count = narratives.filter(n => new Date(n.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) === day).length;
    return { name: day, Narratives: count > 0 ? count : 0 };
  });

  const scoreData = clients.map(client => {
    const clientNarratives = narratives.filter(n => n.clientCompanyId === client.id);
    const avg = clientNarratives.length > 0 ? Math.round(clientNarratives.reduce((sum, n) => sum + n.matchScore, 0) / clientNarratives.length) : 0;
    return { name: client.name.split(' ')[0], Score: avg };
  });

  const industryCounts = clients.reduce((acc: any, client) => { acc[client.industry || 'Other'] = (acc[client.industry || 'Other'] || 0) + 1; return acc; }, {});
  const COLORS = ['#d4af37', '#ffffff', '#10b981', '#71717a', '#d4af37'];
  const pieData = Object.keys(industryCounts).map((key, index) => ({ name: key, value: industryCounts[key] }));

  const filteredNarratives = narratives.filter(n => {
    const client = clients.find(c => c.id === n.clientCompanyId);
    const matchesSearch = n.title.toLowerCase().includes(narrativeSearch.toLowerCase()) || (client?.name.toLowerCase().includes(narrativeSearch.toLowerCase()) || false);
    const matchesScore = scoreFilter === 'all' || (scoreFilter === '80' && n.matchScore >= 80) || (scoreFilter === '90' && n.matchScore >= 90);
    return matchesSearch && matchesScore;
  });

  const containerVariants = { animate: { transition: { staggerChildren: 0.05 } } };
  const itemVariants = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#222] pb-8">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Agency Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-light serif-italic text-white">Good morning, <span className="not-italic font-light">Metascent.</span></h1>
        </div>
        <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
          <div className="text-left md:text-right"><p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p><p className="text-xs font-light text-[#d4af37] font-mono tracking-widest uppercase">{totalClients} Clients active</p></div>
          <div className="flex items-center gap-3 mt-4 w-full md:w-auto">
            <button onClick={onNavigateToClients} className="px-4 py-2 border border-[#222] text-[9px] uppercase tracking-[0.2em] bg-black text-white hover:bg-white hover:text-black transition-all cursor-pointer">Add Client</button>
            <button onClick={onNavigateToNarrative} className="px-5 py-2 bg-[#d4af37] border border-[#d4af37] text-black text-[9px] uppercase font-bold tracking-[0.2em] hover:brightness-110 transition-all cursor-pointer">Build Narrative</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="p-6 border border-[#222] bg-[#0a0a0a] transition-all duration-300 hover:border-white/10"><p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Active Clients</p><div className="flex items-baseline gap-2"><span className="text-4xl font-light text-white">{totalClients}</span><span className="text-xs text-emerald-500 opacity-80 font-mono tracking-wide">+14%</span></div></motion.div>
        <motion.div variants={itemVariants} className="p-6 border border-[#222] bg-[#0a0a0a] transition-all duration-300 hover:border-white/10"><p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Narratives</p><div className="flex items-baseline gap-2"><span className="text-4xl font-light text-white">{totalNarratives}</span><span className="text-xs text-[#d4af37] font-mono tracking-wide">Ready</span></div></motion.div>
        <motion.div variants={itemVariants} className="p-6 border border-[#222] bg-[#0a0a0a] transition-all duration-300 hover:border-white/10"><p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Avg. Match Accuracy</p><div className="flex items-baseline gap-2"><span className="text-4xl font-light text-white">{avgMatchScore}<span className="text-xl text-zinc-600">%</span></span><span className="text-xs text-[#d4af37] font-mono tracking-wide">Optimal</span></div></motion.div>
        <motion.div variants={itemVariants} className="p-6 border border-[#222] bg-[#0a0a0a] transition-all duration-300 hover:border-white/10"><p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Estimated Impact</p><div className="flex items-baseline gap-2"><span className="text-4xl font-light text-white font-serif">${(totalNarratives * 0.5 + 2).toFixed(1)}<span className="text-xl text-zinc-600">M</span></span></div></motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 p-6 border border-[#222] bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span><h2 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-semibold">Narrative Velocity</h2></div><span className="text-[9px] font-mono text-zinc-500">Last 7 Days</span></div>
          <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={velocityData}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} /><Line type="monotone" dataKey="Narratives" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#0a0a0a', stroke: '#d4af37', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#d4af37' }} /></LineChart></ResponsiveContainer></div>
        </motion.div>
        <motion.div variants={itemVariants} className="p-6 border border-[#222] bg-[#0a0a0a]">
          <div className="flex items-center gap-2 mb-6"><span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span><h2 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-semibold">Portfolio Sectors</h2></div>
          <div className="h-64 w-full flex items-center justify-center">{pieData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />))}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></ResponsiveContainer>) : (<p className="text-xs text-zinc-600 font-mono">No data</p>)}</div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">{pieData.map((entry, index) => (<div key={entry.name} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div><span className="text-[9px] font-mono text-zinc-400 uppercase">{entry.name}</span></div>))}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-3 p-6 border border-[#222] bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span><h2 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-semibold">Client Alignment Index</h2></div><span className="text-[9px] font-mono text-zinc-500">Match Accuracy %</span></div>
          <div className="h-64 w-full">{scoreData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><BarChart data={scoreData}><CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} /><XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} domain={[0, 100]} /><Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} /><Bar dataKey="Score" fill="#d4af37" radius={[2, 2, 0, 0]} maxBarSize={40} /></BarChart></ResponsiveContainer>) : (<div className="flex items-center justify-center h-full text-xs text-zinc-600 font-mono">Generate narratives to see client scores</div>)}</div>
        </motion.div>
      </div>

      {/* --- NEW: SYSTEM ACTIVITY AUDIT LOG --- */}
      <motion.div variants={itemVariants} className="p-8 bg-[#0a0a0a] border border-[#222]">
        <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full">
              <ShieldCheck size={16} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-xs font-mono tracking-[0.25em] uppercase text-white font-semibold">System Activity Audit Log</h2>
              <p className="text-[9px] font-mono text-zinc-500 mt-0.5">Real-time telemetry of agency operations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            Live Sync Active
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222] text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                <th className="pb-3 font-normal w-24">Timestamp</th>
                <th className="pb-3 font-normal w-32">Action Type</th>
                <th className="pb-3 font-normal">Target Entity</th>
                <th className="pb-3 font-normal w-24">Operator</th>
                <th className="pb-3 font-normal text-right w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {activities.length > 0 ? activities.slice(0, 8).map((act) => (
                <tr key={act.id} className="hover:bg-white/[0.01] transition-colors font-mono text-[11px]">
                  <td className="py-3 text-zinc-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                  <td className="py-3 text-white font-semibold tracking-wide">{act.action}</td>
                  <td className="py-3 text-zinc-300 font-sans">{act.target}</td>
                  <td className="py-3 text-zinc-500">{act.user}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold border ${
                      act.status === 'SUCCESS' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                    }`}>{act.status}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-zinc-500 font-mono">
                    <div className="flex flex-col items-center gap-2">
                      <Activity size={16} className="text-zinc-700" />
                      <span>No recent activity logs detected.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="p-8 bg-[#0a0a0a] border border-[#222]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#222] pb-4 mb-6 gap-4">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span><span className="text-xs font-mono tracking-[0.25em] uppercase text-white font-semibold">Recent Narratives</span></div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64"><Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><input type="text" placeholder="Search narratives..." value={narrativeSearch} onChange={(e) => setNarrativeSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[10px] font-mono text-white placeholder-zinc-600" /></div>
            <div className="relative"><Sliders size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /><select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="pl-9 pr-8 py-2 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[10px] font-mono text-white appearance-none cursor-pointer"><option value="all">All Scores</option><option value="80">Score &gt; 80%</option><option value="90">Score &gt; 90%</option></select></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead><tr className="border-b border-[#222] text-[9px] font-mono tracking-widest text-zinc-500 uppercase"><th className="pb-3 font-normal">Narrative Title</th><th className="pb-3 font-normal">Client</th><th className="pb-3 font-normal text-right">Match Score</th><th className="pb-3 font-normal text-center">Created</th></tr></thead>
            <tbody className="divide-y divide-[#222]">
              {filteredNarratives.length > 0 ? filteredNarratives.slice(0, 5).map((narrative) => {
                const client = clients.find(c => c.id === narrative.clientCompanyId);
                return (
                  <tr key={narrative.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-sans font-medium text-white">{narrative.title}</td>
                    <td className="py-4 font-light text-zinc-400">{client?.name || 'Unknown'}</td>
                    <td className="py-4 font-mono font-semibold text-right text-[#d4af37]">{narrative.matchScore}%</td>
                    <td className="py-4 text-center"><span className="text-[9px] font-mono text-zinc-500">{new Date(narrative.createdAt).toLocaleDateString()}</span></td>
                  </tr>
                );
              }) : (<tr><td colSpan={4} className="py-8 text-center text-xs text-zinc-500 font-mono">No narratives match your search criteria.</td></tr>)}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}