import React, { useState, useEffect } from 'react';
import { TrendingUp, Bell, Sliders, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TalentInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  trend: string;
  trend_direction: string;
  value: string;
  change: string;
  is_positive: boolean;
  created_at: string;
}

interface CompetitorAlert {
  id: string;
  company_name: string;
  change_type: string;
  description: string;
  source: string;
  days_ago: number;
  created_at: string;
}

export default function TalentIndexView() {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [insights, setInsights] = useState<TalentInsight[]>([]);
  const [alerts, setAlerts] = useState<CompetitorAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch insights
      const { data: insightsData } = await supabase
        .from('talent_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch alerts
      const { data: alertsData } = await supabase
        .from('competitor_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (insightsData) setInsights(insightsData);
      if (alertsData) setAlerts(alertsData);
    } catch (err) {
      console.error('Error fetching talent data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-10 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-charcoal pb-8">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-mono block mb-1">
            QUALITATIVE MARKET TELEMETRY
          </span>
          <h1 className="text-3xl font-light font-display serif-italic text-white">
            Talent Market Intelligence
          </h1>
        </div>

        {/* Date Selector */}
        <div className="flex border border-charcoal bg-[#0a0a0a] p-1 text-[9px] font-mono tracking-widest uppercase">
          {['30d', '7d', '24h'].map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-1.5 transition-colors cursor-pointer ${
                selectedRange === range ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Macro Analytics Grid - bento card elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.slice(0, 3).map((insight, idx) => (
          <div 
            key={insight.id}
            className="p-6 bg-[#0a0a0a] border border-charcoal relative flex flex-col justify-between group hover:border-[#333] transition-all h-60"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/5 tab-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-mono tracking-wider bg-black border border-charcoal px-2.5 py-0.5 text-zinc-400 uppercase">
                {insight.category}
              </span>
              <span className="text-[#d4af37] text-xs font-mono font-semibold flex items-center gap-1">
                <ArrowUpRight size={12} />
                {insight.change}
              </span>
            </div>

            <div>
              <span className="text-4xl font-light font-serif text-white block mb-0.5">
                {insight.value}
              </span>
              <h3 className="text-sm font-light font-display serif-italic text-white tracking-wide mb-2">
                {insight.title}
              </h3>
              <p className="text-xs font-light text-zinc-400 leading-relaxed font-sans">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Market Feed vs Active Category Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Interactive Intelligence Signal Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-charcoal pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              <h2 className="text-xs font-mono tracking-[0.25em] uppercase text-white font-semibold">
                Intelligence Stream Signals
              </h2>
            </div>
            <span className="text-[10px] font-mono opacity-40">Live Feed</span>
          </div>

          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((ins) => {
                const directionUp = ins.trend_direction === 'up';
                return (
                  <div 
                    key={ins.id}
                    className="p-6 bg-[#0a0a0a] border border-charcoal group hover:border-[#333] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="text-[9px] font-mono tracking-widest text-[#d4af37] uppercase border border-gold/10 px-2.5 py-0.5 bg-black">
                        {ins.category.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-mono flex items-center gap-1 ${directionUp ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {directionUp ? <TrendingUp size={11} /> : <Sliders size={11} />}
                        {ins.trend}
                      </span>
                    </div>

                    <h3 className="text-base font-light serif-italic text-white leading-snug mb-2 font-display">
                      {ins.title}
                    </h3>
                    <p className="text-xs font-light text-zinc-400 leading-relaxed font-sans">
                      {ins.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-charcoal text-[8px] font-mono opacity-30 uppercase tracking-widest">
                      Pivoted by sovereign analytica &bull; {new Date(ins.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-[#0a0a0a] border border-charcoal font-mono text-xs text-zinc-500">
                No talent insights yet. Data will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Competitor positioning alerts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-charcoal pb-4">
            <h2 className="text-xs font-mono tracking-[0.25em] uppercase text-white font-semibold">
              Competitor Benefit Tracking
            </h2>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-charcoal space-y-5">
            <p className="text-xs font-light text-zinc-400 leading-relaxed font-sans">
              Dynamic scraping records active competitive repositioning alerts across executive portfolios. Review core strategies:
            </p>

            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-black border border-charcoal space-y-2">
                    <div className="flex justify-between text-[8px] font-mono uppercase text-zinc-500">
                      <span>{alert.source}</span>
                      <span className="text-gold">Pivoted {alert.days_ago}d ago</span>
                    </div>
                    <h4 className="text-xs text-white font-medium">{alert.company_name}</h4>
                    <p className="text-[11px] font-light text-zinc-400 leading-relaxed font-sans">
                      {alert.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-500 font-mono">
                  No competitor alerts yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}