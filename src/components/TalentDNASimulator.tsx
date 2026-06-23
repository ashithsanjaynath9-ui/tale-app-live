import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Zap, Target } from 'lucide-react';

interface TalentDNASimulatorProps {
  clientName: string;
  narrativeTone: string;
}

export default function TalentDNASimulator({ clientName, narrativeTone }: TalentDNASimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [showProjection, setShowProjection] = useState(false);

  // Base data representing current employer brand perception
  const currentData = [
    { subject: 'Innovation', A: 65, fullMark: 100 },
    { subject: 'Work-Life Balance', A: 40, fullMark: 100 },
    { subject: 'Career Growth', A: 55, fullMark: 100 },
    { subject: 'Compensation', A: 70, fullMark: 100 },
    { subject: 'Culture & Values', A: 50, fullMark: 100 },
    { subject: 'Diversity & Inclusion', A: 45, fullMark: 100 },
  ];

  // Projected data after AI narrative is applied (The "Magic")
  const projectedData = [
    { subject: 'Innovation', A: 65, B: 92, fullMark: 100 },
    { subject: 'Work-Life Balance', A: 40, B: 88, fullMark: 100 },
    { subject: 'Career Growth', A: 55, B: 95, fullMark: 100 },
    { subject: 'Compensation', A: 70, B: 85, fullMark: 100 },
    { subject: 'Culture & Values', A: 50, B: 94, fullMark: 100 },
    { subject: 'Diversity & Inclusion', A: 45, B: 90, fullMark: 100 },
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setShowProjection(true);
      setIsSimulating(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setShowProjection(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[#222] rounded-lg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] mb-1 flex items-center gap-2">
            <Zap size={12} /> Predictive Talent Impact
          </h3>
          <p className="text-lg font-light text-white">Talent DNA Simulator: {clientName}</p>
        </div>
        <div className="flex gap-2">
          {!showProjection ? (
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="px-4 py-2 bg-[#d4af37] text-black text-[9px] font-mono uppercase tracking-widest font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full" />
                  Calculating...
                </>
              ) : (
                <>
                  <Target size={12} /> Simulate Narrative Impact
                </>
              )}
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              className="px-4 py-2 border border-[#222] text-zinc-400 text-[9px] font-mono uppercase tracking-widest hover:border-white hover:text-white transition-all"
            >
              Reset View
            </button>
          )}
        </div>
      </div>

      {/* The Chart */}
      <div className="h-[350px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={showProjection ? projectedData : currentData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#555', fontSize: 9 }} stroke="#333" />
            
            {/* Current State */}
            <Radar
              name="Current DNA"
              dataKey="A"
              stroke="#71717a"
              fill="#71717a"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            {/* Projected State (Only shows after simulation) */}
            {showProjection && (
              <Radar
                name="Projected DNA"
                dataKey="B"
                stroke="#d4af37"
                fill="#d4af37"
                fillOpacity={0.4}
                strokeWidth={2}
                animationDuration={1500}
              />
            )}
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', fontFamily: 'monospace', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Impact Metrics */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-500"></div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase">Current Perception</span>
          </div>
          {showProjection && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>
              <span className="text-[9px] font-mono text-[#d4af37] uppercase">Projected with AI Narrative</span>
            </motion.div>
          )}
        </div>

        {showProjection && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-4 py-2 bg-emerald-950/20 border border-emerald-900/30 rounded"
          >
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">+47% Qualified Applicants Predicted</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}