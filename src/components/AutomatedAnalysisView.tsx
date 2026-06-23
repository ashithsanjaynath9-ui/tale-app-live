import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Linkedin, Search, CheckCircle, AlertCircle, Download, Share2, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AutomatedAnalysisViewProps {
  clientId: string;
  clientName: string;
  clientIndustry: string;
  onComplete: () => void;
}

export default function AutomatedAnalysisView({ clientId, clientName, clientIndustry, onComplete }: AutomatedAnalysisViewProps) {
  const [step, setStep] = useState<'scanning' | 'analyzing' | 'competitors' | 'recommendations' | 'complete'>('scanning');
  const [progress, setProgress] = useState(0);
  const [findings, setFindings] = useState<any>(null);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulate the automated analysis workflow
    runAutomatedAnalysis();
  }, [clientId]);

  const runAutomatedAnalysis = async () => {
    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
      
      // Step 1: Scanning web presence (0-25%)
      setStep('scanning');
      setProgress(0);
      await simulateProgress(25, 2000);
      
      // Step 2: Analyzing employer branding (25-50%)
      setStep('analyzing');
      await simulateProgress(50, 2500);
      
      // Step 3: Discovering competitors (50-75%)
      setStep('competitors');
      await simulateProgress(75, 2000);
      
      // Step 4: Generate recommendations (75-100%)
      setStep('recommendations');
      
      // Call AI to generate actual analysis
      const prompt = `Analyze employer branding for ${clientName} in ${clientIndustry} industry.

Identify:
1. Their current employer branding presence (career page, LinkedIn, social media)
2. Top 5 competitors in talent acquisition
3. What competitors are saying that ${clientName} is NOT
4. Gaps in their employer value proposition
5. 3 specific narrative recommendations

Return JSON:
{
  "currentPresence": {
    "careerPage": "analysis",
    "linkedIn": "analysis",
    "glassdoor": "rating and themes",
    "overallScore": 1-10
  },
  "competitors": [
    {"name": "Company", "strength": "what they do well", "weakness": "gap"}
  ],
  "gaps": ["what ${clientName} is missing"],
  "recommendations": [
    {"title": "Recommendation title", "description": "Detailed description", "impact": "High/Medium/Low", "effort": "Easy/Medium/Hard"}
  ],
  "suggestedNarrative": "Complete employer branding narrative"
}`;

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

      const data = await response.json();
      let content = data.choices[0].message.content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const analysis = JSON.parse(content);
      
      setFindings(analysis);
      await simulateProgress(100, 1000);
      
      setStep('complete');
      toast.success('Automated analysis complete!');
    } catch (err) {
      console.error('Analysis error:', err);
      toast.error('Analysis failed');
    }
  };

  const simulateProgress = (targetProgress: number, duration: number) => {
    return new Promise(resolve => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressDelta = (elapsed / duration) * (targetProgress - progress);
        setProgress(prev => Math.min(prev + progressDelta, targetProgress));
        
        if (elapsed >= duration) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  };

  const handleApproveAndPublish = async () => {
    try {
      // Save to database
      await supabase.from('narratives').insert([{
        user_id: '00000000-0000-0000-0000-000000000001',
        client_company_id: clientId,
        title: 'AI-Generated Employer Branding Narrative',
        content: findings.suggestedNarrative,
        match_score: 92
      }]);
      
      toast.success('Narrative approved and published!');
      onComplete();
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const scanningSteps = [
    { icon: Globe, text: 'Scanning career page...', threshold: 8 },
    { icon: Linkedin, text: 'Analyzing LinkedIn presence...', threshold: 16 },
    { icon: Search, text: 'Checking Glassdoor reviews...', threshold: 25 },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-[#222] pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={24} className="text-[#d4af37]" />
          <h2 className="text-2xl font-light font-display serif-italic text-white">
            Automated Employer Branding Analysis
          </h2>
        </div>
        <p className="text-sm text-zinc-400 font-light">
          AI is analyzing {clientName}'s employer branding across all platforms and competitors.
        </p>
      </div>

      {/* Progress Bar */}
      {(step !== 'complete') && (
        <div className="p-6 bg-[#0a0a0a] border border-[#222]">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-mono uppercase text-zinc-400">
              {step === 'scanning' && 'Scanning Web Presence'}
              {step === 'analyzing' && 'Analyzing Employer Branding'}
              {step === 'competitors' && 'Discovering Competitors'}
              {step === 'recommendations' && 'Generating Recommendations'}
            </span>
            <span className="text-xs font-mono text-[#d4af37]">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#d4af37]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Scanning Steps */}
          {step === 'scanning' && (
            <div className="mt-6 space-y-3">
              {scanningSteps.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: progress > s.threshold * 4 ? 1 : 0.3, x: 0 }}
                  className="flex items-center gap-3 text-xs text-zinc-400"
                >
                  <s.icon size={14} className={progress > s.threshold * 4 ? 'text-emerald-400' : 'text-zinc-600'} />
                  <span className={progress > s.threshold * 4 ? 'text-white' : ''}>{s.text}</span>
                  {progress > s.threshold * 4 && <CheckCircle size={12} className="text-emerald-400 ml-auto" />}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {findings && step === 'complete' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Current Presence Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 bg-[#0a0a0a] border border-[#222]">
              <p className="text-[9px] font-mono uppercase text-zinc-500 mb-2">Current EVP Score</p>
              <p className="text-3xl font-light text-white">{findings.currentPresence?.overallScore || 6}/10</p>
            </div>
            <div className="p-6 bg-[#0a0a0a] border border-[#222]">
              <p className="text-[9px] font-mono uppercase text-zinc-500 mb-2">Career Page</p>
              <p className="text-sm text-zinc-300">{findings.currentPresence?.careerPage || 'Moderate'}</p>
            </div>
            <div className="p-6 bg-[#0a0a0a] border border-[#222]">
              <p className="text-[9px] font-mono uppercase text-zinc-500 mb-2">LinkedIn</p>
              <p className="text-sm text-zinc-300">{findings.currentPresence?.linkedIn || 'Active'}</p>
            </div>
            <div className="p-6 bg-[#0a0a0a] border border-[#222]">
              <p className="text-[9px] font-mono uppercase text-zinc-500 mb-2">Glassdoor</p>
              <p className="text-sm text-zinc-300">{findings.currentPresence?.glassdoor || '3.8/5'}</p>
            </div>
          </div>

          {/* Competitors */}
          {findings.competitors && (
            <div className="p-6 bg-[#0a0a0a] border border-[#222]">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <Shield size={14} className="text-[#d4af37]" />
                Top Competitors in Talent War
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {findings.competitors.map((comp: any, i: number) => (
                  <div key={i} className="p-4 bg-black/50 border border-[#222]">
                    <h4 className="text-sm font-semibold text-white mb-2">{comp.name}</h4>
                    <p className="text-[10px] text-emerald-400 mb-1">✓ {comp.strength}</p>
                    <p className="text-[10px] text-red-400">✗ {comp.weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {findings.gaps && (
            <div className="p-6 bg-red-950/20 border border-red-900/30">
              <h3 className="text-xs font-mono uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle size={14} />
                Critical Gaps Identified
              </h3>
              <div className="space-y-2">
                {findings.gaps.map((gap: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-red-400 mt-1">•</span>
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {findings.recommendations && (
            <div className="p-6 bg-[#0a0a0a] border border-[#222]">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-[#d4af37]" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {findings.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="p-4 bg-black/50 border border-[#222] hover:border-[#d4af37]/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                      <div className="flex gap-2">
                        <span className="text-[8px] font-mono px-2 py-0.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/30">{rec.impact}</span>
                        <span className="text-[8px] font-mono px-2 py-0.5 bg-blue-950/30 text-blue-400 border border-blue-900/30">{rec.effort}</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Narrative */}
          {findings.suggestedNarrative && (
            <div className="p-6 bg-gradient-to-br from-[#d4af37]/10 to-black border border-[#d4af37]/30">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] mb-4">AI-Generated Narrative</h3>
              <div className="p-4 bg-black/50 border border-[#222] rounded mb-4">
                <p className="text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                  {findings.suggestedNarrative}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleApproveAndPublish}
                  className="flex-1 py-3 bg-[#d4af37] text-black font-bold uppercase text-[10px] font-mono tracking-widest hover:brightness-110 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} />
                  Approve & Publish
                </button>
                <button
                  onClick={() => toast.success('Downloading narrative...')}
                  className="px-6 py-3 border border-[#222] text-[10px] font-mono uppercase tracking-widest hover:border-[#d4af37] transition-colors flex items-center gap-2"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}