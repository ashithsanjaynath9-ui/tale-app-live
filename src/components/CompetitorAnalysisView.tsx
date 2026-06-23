import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, AlertCircle, CheckCircle, Target, BarChart3, Shield, Sparkles, Globe, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface CompetitorAnalysisViewProps {
  clientId: string;
  clientName: string;
  clientIndustry: string;
}

export default function CompetitorAnalysisView({ clientId, clientName, clientIndustry }: CompetitorAnalysisViewProps) {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [myCompany, setMyCompany] = useState('');
  const [competitors, setCompetitors] = useState<string[]>(['', '', '']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleCompetitorChange = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const analyzeCompetitors = async () => {
    setIsAnalyzing(true);
    
    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
        throw new Error('Groq API key not configured');
      }

      let prompt = '';
      const companyName = myCompany || clientName || 'Company';
      const industry = clientIndustry || 'Technology';
      
      if (mode === 'auto') {
        prompt = `You are an employer branding and talent intelligence analyst.

Company: ${companyName}
Industry: ${industry}

TASK: Analyze the EMPLOYER BRANDING and TALENT POSITIONING of top competitors.

For each competitor, analyze:
1. Their Employer Value Proposition (EVP) - what do they promise to employees?
2. Culture messaging - how do they describe their work environment?
3. Benefits & perks emphasis - what do they highlight? (flexibility, growth, compensation, etc.)
4. Diversity & inclusion messaging
5. Career development positioning
6. Work-life balance claims
7. Target candidate personas they attract
8. Their employer brand weaknesses or gaps

Then provide:
- What employer branding themes are OVERSATURATED (everyone saying "we're innovative", "fast-paced", etc.)
- What talent messaging is UNDERSERVED (white space opportunities)
- What NO ONE is saying about their culture/benefits
- Recommended employer branding differentiation strategy for ${companyName}
- 3-5 specific narrative angles that would make ${companyName} stand out as an employer

Return JSON:
{
  "discoveredCompetitors": [
    {
      "name": "Company",
      "evp": "Their employer value proposition",
      "cultureMessaging": "How they describe culture",
      "benefitsEmphasis": ["benefit1", "benefit2"],
      "targetTalent": "Who they're trying to attract",
      "strengths": ["employer branding strength"],
      "weaknesses": ["employer branding gap"],
      "positioning": "Their talent positioning statement"
    }
  ],
  "marketAnalysis": {
    "oversaturatedThemes": ["everyone says this"],
    "whiteSpace": "What no one is saying",
    "untappedOpportunities": ["opportunity1"]
  },
  "differentiationStrategy": "How ${companyName} should position itself as employer",
  "recommendedNarratives": [
    {"angle": "narrative angle", "reasoning": "why it works", "targetAudience": "specific talent pool"}
  ],
  "competitiveAdvantage": "Unique employer branding advantage"
}`;
      } else {
        const validCompetitors = competitors.filter(c => c.trim());
        if (validCompetitors.length < 2) {
          toast.error('Enter at least 2 competitors');
          setIsAnalyzing(false);
          return;
        }
        
        prompt = `Analyze the EMPLOYER BRANDING and TALENT POSITIONING of these companies competing with ${companyName}: ${validCompetitors.join(', ')}.

For each company, analyze:
1. Their Employer Value Proposition (EVP)
2. Culture and work environment messaging
3. Benefits & perks they emphasize
4. Diversity & inclusion claims
5. Career development positioning
6. What makes them attractive to talent
7. Employer brand weaknesses

Return JSON:
{
  "competitors": [
    {
      "name": "Company",
      "evp": "Their employer value proposition",
      "cultureMessaging": "How they describe culture",
      "benefitsEmphasis": ["benefit1", "benefit2"],
      "targetTalent": "Who they attract",
      "strengths": ["employer branding strength"],
      "weaknesses": ["employer branding gap"],
      "positioning": "Their talent positioning"
    }
  ],
  "marketAnalysis": {
    "oversaturatedThemes": ["everyone says this"],
    "whiteSpace": "What no one is saying",
    "untappedOpportunities": ["opportunity1"]
  },
  "differentiationStrategy": "How ${companyName} should differentiate as employer",
  "recommendedNarratives": [
    {"angle": "narrative angle", "reasoning": "why it works", "targetAudience": "talent pool"}
  ],
  "competitiveAdvantage": "Unique employer branding advantage"
}`;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Return ONLY valid JSON, no markdown.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      let content = data.choices[0].message.content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      const analysis = JSON.parse(content);
      setAnalysisResults(analysis);
      
      // Save to DB
      try {
        const competitorsToSave = mode === 'auto' ? analysis.discoveredCompetitors || [] : analysis.competitors || [];
        if (competitorsToSave.length > 0 && clientId) {
          await supabase.from('competitors').insert(
            competitorsToSave.map((comp: any) => ({
              user_id: '00000000-0000-0000-0000-000000000001',
              client_company_id: clientId,
              name: comp.name,
              analysis_data: analysis
            }))
          );
        }
      } catch (e) { console.warn('DB save failed:', e); }
      
      toast.success('Analysis complete!');
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.message || 'Failed to analyze');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const competitorsData = analysisResults ? (mode === 'auto' ? analysisResults.discoveredCompetitors : analysisResults.competitors) || [] : [];

  return (
    <div className="space-y-8">
      <div className="border-b border-[#222] pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={24} className="text-[#d4af37]" />
          <h2 className="text-2xl font-light font-display serif-italic text-white">Competitor Intelligence Engine</h2>
        </div>
        <p className="text-sm text-zinc-400 font-light">Let AI discover your competitors or manually select them.</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setMode('auto')} className={`p-6 border-2 rounded-lg transition-all text-left ${mode === 'auto' ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-[#222] hover:border-zinc-600 bg-[#0a0a0a]'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-full ${mode === 'auto' ? 'bg-[#d4af37] text-black' : 'bg-zinc-800 text-zinc-400'}`}><Sparkles size={18} /></div>
            <div><h3 className={`text-sm font-semibold ${mode === 'auto' ? 'text-white' : 'text-zinc-400'}`}>AI Auto-Discovery</h3><p className="text-[10px] text-zinc-500">Let AI find your competitors</p></div>
          </div>
        </button>
        <button onClick={() => setMode('manual')} className={`p-6 border-2 rounded-lg transition-all text-left ${mode === 'manual' ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-[#222] hover:border-zinc-600 bg-[#0a0a0a]'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-full ${mode === 'manual' ? 'bg-[#d4af37] text-black' : 'bg-zinc-800 text-zinc-400'}`}><Search size={18} /></div>
            <div><h3 className={`text-sm font-semibold ${mode === 'manual' ? 'text-white' : 'text-zinc-400'}`}>Manual Selection</h3><p className="text-[10px] text-zinc-500">Choose specific competitors</p></div>
          </div>
        </button>
      </div>

      {/* Input Section */}
      <div className="p-6 bg-[#0a0a0a] border border-[#222]">
        {mode === 'auto' ? (
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2"><Globe size={14} className="text-[#d4af37]" /> AI Auto-Discovery Mode</h3>
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase text-zinc-400">Your Company Name</label>
              <input type="text" value={myCompany} onChange={(e) => setMyCompany(e.target.value)} placeholder={clientName || 'Your Company'} className="w-full px-4 py-3 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2"><Search size={14} className="text-[#d4af37]" /> Manual Entry</h3>
            <div className="space-y-3">
              {competitors.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-500 w-6">{i + 1}.</span>
                  <input type="text" value={c} onChange={(e) => handleCompetitorChange(i, e.target.value)} placeholder={`Competitor ${i + 1}`} className="flex-1 px-4 py-2.5 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-xs text-white" />
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={analyzeCompetitors} disabled={isAnalyzing} className="mt-6 w-full py-4 bg-[#d4af37] text-black font-bold uppercase text-[10px] font-mono tracking-widest hover:brightness-110 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isAnalyzing ? (<><div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" /> Analyzing...</>) : (<><BarChart3 size={16} /> Generate Report</>)}
        </button>
      </div>

      {/* RESULTS DISPLAY */}
      <AnimatePresence>
        {analysisResults && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Competitive Advantage */}
            {analysisResults.competitiveAdvantage && (
              <div className="p-6 bg-gradient-to-br from-[#d4af37]/20 to-black border border-[#d4af37]/30">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] mb-3 flex items-center gap-2"><Target size={14} /> Your Employer Branding Advantage</h3>
                <p className="text-sm text-zinc-300 font-light">{analysisResults.competitiveAdvantage}</p>
              </div>
            )}

            {/* Competitors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitorsData.map((comp: any, idx: number) => (
                <div key={idx} className="p-6 bg-[#0a0a0a] border border-[#222]">
                  <h4 className="text-sm font-semibold text-white mb-2">{comp.name}</h4>
                  {comp.evp && <p className="text-[10px] text-zinc-400 mb-3 italic">"{comp.evp}"</p>}
                  {comp.cultureMessaging && <p className="text-[10px] text-zinc-500 mb-3"><span className="text-zinc-600">Culture:</span> {comp.cultureMessaging}</p>}
                  {comp.targetTalent && <p className="text-[10px] text-zinc-500 mb-3"><span className="text-zinc-600">Targets:</span> {comp.targetTalent}</p>}
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1"><CheckCircle size={10} /> Employer Brand Strengths</p>
                      <ul className="space-y-1">{comp.strengths?.map((s: string, i: number) => (<li key={i} className="text-xs text-zinc-400">• {s}</li>))}</ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase text-red-400 mb-1 flex items-center gap-1"><AlertCircle size={10} /> Employer Brand Gaps</p>
                      <ul className="space-y-1">{comp.weaknesses?.map((w: string, i: number) => (<li key={i} className="text-xs text-zinc-400">• {w}</li>))}</ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Analysis */}
            {analysisResults.marketAnalysis && (
              <div className="p-6 bg-[#0a0a0a] border border-[#222]">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-4">Employer Branding Market Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] font-mono uppercase text-red-400 mb-2">Oversaturated Themes</p>
                    <div className="space-y-2">{analysisResults.marketAnalysis.oversaturatedThemes?.map((theme: string, i: number) => (<div key={i} className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>{theme}</div>))}</div>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-emerald-400 mb-2">Untapped Opportunities</p>
                    <div className="space-y-2">{analysisResults.marketAnalysis.untappedOpportunities?.map((opp: string, i: number) => (<div key={i} className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>{opp}</div>))}</div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded">
                  <p className="text-[9px] font-mono uppercase text-emerald-400 mb-2">White Space Opportunity</p>
                  <p className="text-sm text-zinc-300 font-light">{analysisResults.marketAnalysis.whiteSpace}</p>
                </div>
              </div>
            )}

            {/* Recommended Narratives */}
            {analysisResults.recommendedNarratives && (
              <div className="p-6 bg-[#0a0a0a] border border-[#d4af37]/30">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] mb-4 flex items-center gap-2"><TrendingUp size={14} /> Recommended Employer Branding Strategies</h3>
                <div className="space-y-3">
                  {analysisResults.recommendedNarratives.map((narrative: any, i: number) => (
                    <div key={i} className="p-4 bg-black/50 border border-[#222]">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-xs font-semibold text-white">{narrative.angle}</p>
                        <span className="text-[9px] font-mono text-[#d4af37]">#{i + 1}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{narrative.reasoning}</p>
                      {narrative.targetAudience && <p className="text-[9px] text-zinc-500">Targets: {narrative.targetAudience}</p>}
                    </div>
                  ))}
                </div>
                {analysisResults.differentiationStrategy && (
                  <div className="mt-6 p-4 bg-[#d4af37]/10 border border-[#d4af37]/20">
                    <p className="text-[9px] font-mono uppercase text-[#d4af37] mb-2">Differentiation Strategy</p>
                    <p className="text-sm text-zinc-300 font-light">{analysisResults.differentiationStrategy}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}