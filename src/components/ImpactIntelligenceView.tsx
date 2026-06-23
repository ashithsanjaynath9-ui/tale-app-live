import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Clock, Award, Target, Zap } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend 
} from 'recharts';
import toast from 'react-hot-toast';

export default function ImpactIntelligenceView() {
  const costData = [
    { name: 'Cost Per Hire', Before: 12500, After: 3200 },
    { name: 'Time to Fill (Days)', Before: 67, After: 23 },
    { name: 'Agency Fees ($k)', Before: 25, After: 4 },
  ];

  const narrativePerformance = [
    { name: 'Innovation-First', applicants: 342, value: 1.2 },
    { name: 'Work-Life Harmony', applicants: 287, value: 0.8 },
    { name: 'Engineering Excellence', applicants: 198, value: 0.6 },
    { name: 'Sustainable Growth', applicants: 156, value: 0.4 },
  ];

  const handleApplyStrategy = () => {
    // Save the strategy to localStorage so NarrativeBuilder can read it
    const strategy = {
      tone: 'creative',
      values: 'Innovation, Disruption, Creative Freedom, Thinking Differently',
      mission: 'To revolutionize the industry through bold, unconventional approaches that challenge the status quo and inspire teams to push boundaries.',
      benefits: 'Unlimited creative sprints, $5000 innovation budget per quarter, 4-day work weeks, flexible remote work, dedicated R&D time',
      targetProfile: 'Senior creative directors, innovation leads, product designers who think outside the box',
      competitors: 'Traditional corporate agencies, risk-averse incumbents'
    };
    
    localStorage.setItem('tale_applied_strategy', JSON.stringify(strategy));
    
    toast.success('🎯 "Innovation-First" strategy saved! Navigate to Narrative Intelligence to apply it.', {
      duration: 4000
    });
  };

  return (
    <div className="space-y-8 relative select-none">
      {/* Header */}
      <div className="border-b border-[#222] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] text-[#d4af37] uppercase font-mono block">HIRING IMPACT INTELLIGENCE</span>
            <h1 className="text-3xl sm:text-4xl font-light font-display serif-italic text-white">ROI Command Center</h1>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              Live Financial Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Hero Metric */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-[#d4af37]/10 to-black border border-[#d4af37]/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] mb-2">TALE ROI MULTIPLIER</p>
            <h2 className="text-5xl font-light text-white mb-2">47.3<span className="text-2xl text-zinc-500">x</span></h2>
            <p className="text-sm text-zinc-400 font-light max-w-md">
              For every $1 spent on TALE, your agency saves $47.30 in recruiting costs and lost productivity.
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-950/20 border border-emerald-900/30 rounded">
            <TrendingUp size={24} className="text-emerald-400" />
            <div>
              <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Projected Annual Savings</p>
              <p className="text-2xl font-light text-white">$4.7M</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-[#0a0a0a] border border-[#222]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d4af37]/10 rounded-full"><DollarSign size={16} className="text-[#d4af37]" /></div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Cost Per Hire</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-light text-white">$3,200</span>
            <span className="text-xs text-emerald-400 font-mono">↓ 74%</span>
          </div>
          <p className="text-[10px] text-zinc-600">Down from $12,500 industry avg</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-[#0a0a0a] border border-[#222]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d4af37]/10 rounded-full"><Clock size={16} className="text-[#d4af37]" /></div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Time to Fill</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-light text-white">23 Days</span>
            <span className="text-xs text-emerald-400 font-mono">↓ 65%</span>
          </div>
          <p className="text-[10px] text-zinc-600">Down from 67 days industry avg</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 bg-[#0a0a0a] border border-[#222]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d4af37]/10 rounded-full"><Award size={16} className="text-[#d4af37]" /></div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Quality of Hire</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-light text-white">9.1<span className="text-lg text-zinc-500">/10</span></span>
            <span className="text-xs text-emerald-400 font-mono">↑ 47%</span>
          </div>
          <p className="text-[10px] text-zinc-600">Retention rate of TALE-sourced hires</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before vs After Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 bg-[#0a0a0a] border border-[#222]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
              <h3 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-semibold">Efficiency Gains</h3>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">Before vs After TALE</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', fontFamily: 'monospace', fontSize: '10px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="Before" fill="#52525b" radius={[0, 4, 4, 0]} maxBarSize={20} />
                <Bar dataKey="After" fill="#d4af37" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Narrative Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-6 bg-[#0a0a0a] border border-[#222]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
              <h3 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-semibold">Narrative Performance</h3>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">Pipeline Value ($M)</span>
          </div>
          <div className="space-y-4">
            {narrativePerformance.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-mono">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500 font-mono">{item.applicants} applicants</span>
                    <span className="text-[#d4af37] font-mono font-semibold">${item.value}M</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 1.2) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#fcd34d]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA / Insight - NOW WITH WORKING BUTTON */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="p-6 bg-gradient-to-r from-emerald-950/20 to-black border border-emerald-900/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-950/30 rounded-full border border-emerald-900/30">
            <Zap size={20} className="text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">AI Insight: Optimize "Innovation-First" Narrative</h4>
            <p className="text-xs text-zinc-400">This narrative is generating 47% more qualified candidates than average. Consider expanding this tone to other client portfolios.</p>
          </div>
        </div>
        <button 
          onClick={handleApplyStrategy}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-mono uppercase tracking-widest font-bold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Target size={12} /> Apply Strategy
        </button>
      </motion.div>
    </div>
  );
}