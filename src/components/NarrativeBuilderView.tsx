import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Save, RefreshCw, ChevronDown, Check, Target, Download, Palette, Shield } from 'lucide-react';
import { ClientCompany } from '../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CompetitorAnalysisView from './CompetitorAnalysisView';
import TalentDNASimulator from './TalentDNASimulator';

type NarrativeTone = 'professional' | 'creative' | 'technical';
type ViewMode = 'narrative' | 'competitor';

interface NarrativeBuilderViewProps {
  clients: ClientCompany[];
  onSaveNarrative: (title: string) => void;
  preselectedClientId?: string;
}

export default function NarrativeBuilderView({
  clients,
  onSaveNarrative,
  preselectedClientId
}: NarrativeBuilderViewProps) {
  
  const [selectedClientId, setSelectedClientId] = useState('');
  const [values, setValues] = useState('');
  const [benefits, setBenefits] = useState('');
  const [mission, setMission] = useState('');
  const [competitorLandscape, setCompetitorLandscape] = useState('');
  const [targetCandidateProfile, setTargetCandidateProfile] = useState('');
  const [selectedTone, setSelectedTone] = useState<NarrativeTone>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentNarrative, setCurrentNarrative] = useState<{ title: string; content: string; matchScore: number; tone?: NarrativeTone } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('narrative');
  const narrativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    } else if (clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [preselectedClientId, clients]);

  useEffect(() => {
    if (!selectedClientId) return;
    
    // Check if there's an applied strategy from Impact Intelligence
    const appliedStrategy = localStorage.getItem('tale_applied_strategy');
    
    if (appliedStrategy) {
      try {
        const strategy = JSON.parse(appliedStrategy);
        setValues(strategy.values || '');
        setBenefits(strategy.benefits || '');
        setMission(strategy.mission || '');
        setCompetitorLandscape(strategy.competitors || '');
        setTargetCandidateProfile(strategy.targetProfile || '');
        setSelectedTone((strategy.tone as NarrativeTone) || 'professional');
        
        // Clear the strategy so it doesn't apply again
        localStorage.removeItem('tale_applied_strategy');
        
        toast.success('🎯 Strategy applied! Form pre-filled with "Innovation-First" data.', {
          duration: 4000
        });
      } catch (err) {
        console.error('Error applying strategy:', err);
      }
    } else {
      // Normal reset if no strategy
      setValues('');
      setBenefits('');
      setMission('');
      setCompetitorLandscape('');
      setTargetCandidateProfile('');
      setCurrentNarrative(null);
      setIsSaved(false);
      setIsCopied(false);
      setSelectedTone('professional');
    }
  }, [selectedClientId]);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const getTonePrompt = (tone: NarrativeTone) => {
    const tones = {
      professional: `Write in a sophisticated, corporate-professional tone suitable for C-suite executives and senior leadership. Use formal business language, emphasize strategic value, ROI, and organizational excellence. Maintain a polished, authoritative voice that conveys trust and credibility.`,
      creative: `Write in a bold, innovative, and inspiring tone that breaks from corporate conventions. Use vivid imagery, dynamic language, and storytelling techniques. Emphasize disruption, creative freedom, and thinking differently. Make it feel human, authentic, and energizing.`,
      technical: `Write in a precise, engineering-focused tone that appeals to technical leaders and senior engineers. Use technical terminology, emphasize architecture, systems thinking, and technical excellence. Focus on innovation through technology, deep technical challenges, and engineering culture.`
    };
    return tones[tone];
  };

  const formatNarrativeText = (text: string): { title: string; sections: any[] } => {
    let cleaned = text.replace(/MATCH_SCORE:\s*\d+/g, '').trim();
    const lines = cleaned.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('###')) {
        const headerText = trimmed.replace('###', '').trim();
        const words = headerText.split(' ');
        const titleCase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        return `HEADER: ${titleCase}`;
      }
      if (trimmed.startsWith('*')) {
        const bulletText = trimmed.substring(1).trim();
        const fixed = bulletText.charAt(0).toUpperCase() + bulletText.slice(1).toLowerCase();
        return `BULLET: ${fixed}`;
      }
      const alphaChars = trimmed.replace(/[^a-zA-Z]/g, '');
      if (alphaChars.length > 15 && alphaChars === alphaChars.toUpperCase()) {
        let sentence = trimmed.toLowerCase();
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        sentence = sentence.replace(/\. ([a-z])/g, (m, p1) => `. ${p1.toUpperCase()}`);
        return `TEXT: ${sentence}`;
      }
      return `TEXT: ${trimmed}`;
    });
    const sections: any[] = [];
    let currentSection: any = null;
    for (const line of processedLines) {
      if (line.startsWith('HEADER:')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: 'section', title: line.replace('HEADER:', '').trim(), content: [] };
      } else if (line.startsWith('BULLET:') && currentSection) {
        currentSection.content.push({ type: 'bullet', text: line.replace('BULLET:', '').trim() });
      } else if (line.startsWith('TEXT:') && currentSection) {
        const text = line.replace('TEXT:', '').trim();
        if (text) currentSection.content.push({ type: 'paragraph', text });
      }
    }
    if (currentSection) sections.push(currentSection);
    const title = sections.length > 0 ? sections[0].title : 'Employer Branding Narrative';
    return { title, sections };
  };

  const generateNarrativeWithGroq = async (
    clientName: string, values: string, benefits: string, mission: string,
    competitorLandscape: string, targetCandidateProfile: string, tone: NarrativeTone
  ): Promise<{ title: string; content: string; matchScore: number }> => {
    const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error('Groq API key not configured');

    const toneInstruction = getTonePrompt(tone);
    const toneLabel = tone.charAt(0).toUpperCase() + tone.slice(1);

    const prompt = `Create an employer branding narrative for ${clientName} in a ${tone} tone.

Company Values: ${values}
Mission: ${mission}
Benefits: ${benefits}
Target Candidates: ${targetCandidateProfile}

${toneInstruction}

Structure EXACTLY like this:

### Introduction
[2-3 sentences about the company in ${tone} style]

### Cultural Differentiators
[2-3 sentences about culture in ${tone} style]

### Key Benefits
* [Benefit 1]
* [Benefit 2]
* [Benefit 3]

### Join Us
[1-2 sentences call-to-action in ${tone} style]

End with: MATCH_SCORE: [Generate a random number between 78 and 98 based on how well the narrative fits the company values]`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: tone === 'creative' ? 0.9 : tone === 'technical' ? 0.6 : 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error('Failed to generate narrative');
    const data = await response.json();
    const fullContent = data.choices[0].message.content;
    const matchScoreMatch = fullContent.match(/MATCH_SCORE:\s*(\d+)/);
    const matchScore = matchScoreMatch ? parseInt(matchScoreMatch[1]) : 85;
    const formatted = formatNarrativeText(fullContent);
    const content = formatted.sections.map(section => {
      const header = `### ${section.title}`;
      const body = section.content.map((item: any) => {
        if (item.type === 'bullet') return `* ${item.text}`;
        return item.text;
      }).join('\n\n');
      return `${header}\n\n${body}`;
    }).join('\n\n');

    return { title: `${toneLabel}: ${formatted.title}`, content, matchScore };
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    setIsGenerating(true);
    setIsSaved(false);
    setIsCopied(false);
    const client = clients.find(c => c.id === selectedClientId);
    const clientName = client ? client.name : 'Selected Enterprise';
    try {
      const generated = await generateNarrativeWithGroq(
        clientName, values, benefits, mission, competitorLandscape, targetCandidateProfile, selectedTone
      );
      setCurrentNarrative({ ...generated, tone: selectedTone });
      toast.success(`${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} narrative generated!`);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to generate narrative. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentNarrative) return;
    navigator.clipboard.writeText(currentNarrative.content)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  const handleExportPDF = async () => {
    if (!currentNarrative || !narrativeRef.current) {
      toast.error('No narrative to export');
      return;
    }
    setIsExporting(true);
    try {
      const element = narrativeRef.current;
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      await new Promise(resolve => setTimeout(resolve, 150));
      const canvas = await html2canvas(element, { backgroundColor: '#0a0a0a', scale: 2, logging: false, useCORS: true, allowTaint: true });
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;
      const imgData = canvas.toDataURL('image/png');
      const pdf: any = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const availableWidth = pageWidth - (margin * 2);
      const ratio = availableWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;
      pdf.setFontSize(10);
      pdf.setTextColor(212, 175, 55);
      pdf.text('TALE — NARRATIVE INTELLIGENCE', margin, margin);
      const client = clients.find(c => c.id === selectedClientId);
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Client: ${client?.name || 'Selected Client'}`, margin, margin + 8);
      pdf.setFontSize(9);
      pdf.setTextColor(212, 175, 55);
      pdf.text(`Tone: ${currentNarrative.tone?.toUpperCase() || 'PROFESSIONAL'}`, margin, margin + 16);
      let heightLeft = scaledHeight;
      let position = 0;
      const startY = margin + 23;
      pdf.addImage(imgData, 'PNG', margin, startY, availableWidth, scaledHeight);
      heightLeft -= (pageHeight - startY);
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position + startY, availableWidth, scaledHeight);
        heightLeft -= pageHeight;
      }
      const totalPages: number = pdf.internal.getNumberOfPages();
      pdf.setPage(totalPages);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} • Match Score: ${currentNarrative.matchScore}%`, margin, pageHeight - margin);
      const fileName = `${currentNarrative.title.replace(/\s+/g, '_').toLowerCase()}_narrative.pdf`;
      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    if (!currentNarrative || !selectedClientId || isSaved) return;
    
    try {
      const { error } = await supabase.from('narratives').insert([{
        user_id: '00000000-0000-0000-0000-000000000001',
        client_company_id: selectedClientId,
        title: currentNarrative.title,
        content: currentNarrative.content,
        match_score: currentNarrative.matchScore
      }]);

      if (error) {
        console.error('Supabase save error:', error);
        toast.error(`Failed to save: ${error.message}`);
        return;
      }

      onSaveNarrative(currentNarrative.title);
      setIsSaved(true);
      toast.success('Narrative saved to ledger successfully!');
    } catch (err: any) {
      console.error('Error saving narrative:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const parseContentForDisplay = (content: string) => {
    const sections: any[] = [];
    const parts = content.split(/###\s+/).filter(p => p.trim());
    for (const part of parts) {
      const lines = part.split('\n').filter(l => l.trim());
      if (lines.length === 0) continue;
      const title = lines[0].trim();
      const bodyLines = lines.slice(1);
      const bullets: string[] = [];
      const paragraphs: string[] = [];
      for (const line of bodyLines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('*')) {
          bullets.push(trimmed.substring(1).trim());
        } else if (trimmed) {
          paragraphs.push(trimmed);
        }
      }
      sections.push({ title, paragraphs, bullets });
    }
    return sections;
  };

  const displaySections = currentNarrative ? parseContentForDisplay(currentNarrative.content) : [];

  const toneOptions: { value: NarrativeTone; label: string; desc: string; color: string }[] = [
    { value: 'professional', label: 'Professional', desc: 'Corporate & Executive', color: 'border-blue-500/50 hover:border-blue-400' },
    { value: 'creative', label: 'Creative', desc: 'Bold & Innovative', color: 'border-purple-500/50 hover:border-purple-400' },
    { value: 'technical', label: 'Technical', desc: 'Engineering-Focused', color: 'border-emerald-500/50 hover:border-emerald-400' },
  ];

  return (
    <div className="space-y-8 relative select-none">
      {/* Header */}
      <div className="border-b border-[#222] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] text-[#d4af37] uppercase font-mono block">NARRATIVE COGNITIVE SUITE</span>
            <h1 className="text-3xl sm:text-4xl font-light font-display serif-italic text-white">Brand Narrative Builder</h1>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              AI Engine Active
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-[#0a0a0a] border border-[#222] w-fit">
        <button
          onClick={() => setViewMode('narrative')}
          className={`px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            viewMode === 'narrative'
              ? 'bg-[#d4af37] text-black font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles size={12} />
          Narrative Builder
        </button>
        <button
          onClick={() => setViewMode('competitor')}
          className={`px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            viewMode === 'competitor'
              ? 'bg-[#d4af37] text-black font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Shield size={12} />
          Competitor Intelligence
        </button>
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'narrative' ? (
          <motion.div
            key="narrative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Client Selection */}
            <div className="p-6 bg-[#0a0a0a] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Target size={16} className="text-[#d4af37] shrink-0" />
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block leading-3">Target Enterprise</span>
                  <span className="text-sm font-sans font-light text-white">Select portfolio firm for narrative positioning</span>
                </div>
              </div>
              <div className="relative min-w-64">
                <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-black border border-[#222] text-[11px] font-mono tracking-widest uppercase text-white hover:border-[#333] focus:border-[#d4af37]/30 focus:outline-none appearance-none rounded-none cursor-pointer">
                  <option value="" disabled>-- CHOOSE ENTERPRISE --</option>
                  {clients.map((c) => (<option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>))}
                </select>
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400"><ChevronDown size={14} /></span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Form */}
              <form onSubmit={handleGenerate} className="lg:col-span-6 space-y-6">
                <div className="p-6 bg-[#0a0a0a] border border-[#222] space-y-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-white pb-3 border-b border-[#222] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" /> <Palette size={12} className="text-[#d4af37]" /> Narrative Tone
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {toneOptions.map((tone) => (
                      <button key={tone.value} type="button" onClick={() => setSelectedTone(tone.value)} className={`p-4 border-2 rounded-lg transition-all text-left ${selectedTone === tone.value ? `${tone.color} bg-white/5` : 'border-[#222] hover:border-zinc-600 bg-black'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${selectedTone === tone.value ? 'text-white' : 'text-zinc-400'}`}>{tone.label}</span>
                          {selectedTone === tone.value && <Check size={14} className="text-[#d4af37]" />}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">{tone.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-[#0a0a0a] border border-[#222] space-y-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-white pb-3 border-b border-[#222] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" /> Values & Culture
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-wider uppercase font-mono text-zinc-400">Culture Tenets (Comma separated)</label>
                    <textarea required value={values} onChange={(e) => setValues(e.target.value)} placeholder="e.g. Extreme Focus, Intellectual Sincerity" className="w-full px-4 py-3 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[11px] leading-relaxed text-white h-20 resize-none font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-wider uppercase font-mono text-zinc-400">Mission & Purpose Statement</label>
                    <textarea required value={mission} onChange={(e) => setMission(e.target.value)} placeholder="What ultimate purpose guides this company?" className="w-full px-4 py-3 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[11px] leading-relaxed text-white h-20 resize-none font-sans" />
                  </div>
                </div>
                <div className="p-6 bg-[#0a0a0a] border border-[#222] space-y-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-white pb-3 border-b border-[#222] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" /> Benefits & Sabbaticals
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-wider uppercase font-mono text-zinc-400">High-Utility Perks (Comma separated)</label>
                    <textarea required value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="e.g. 4-day work cycles, $4000 workplace gear budget" className="w-full px-4 py-3 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[11px] leading-relaxed text-white h-24 resize-none font-sans" />
                  </div>
                </div>
                <div className="p-6 bg-[#0a0a0a] border border-[#222] space-y-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-white pb-3 border-b border-[#222] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" /> Competitor Deviance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] tracking-wider uppercase font-mono text-zinc-400">Competitors Roster</label>
                      <textarea value={competitorLandscape} onChange={(e) => setCompetitorLandscape(e.target.value)} placeholder="e.g. Mass-scale corporate bureaus" className="w-full px-4 py-2.5 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[11px] leading-relaxed text-white h-20 resize-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] tracking-wider uppercase font-mono text-zinc-400">Target Candidate Profile</label>
                      <textarea value={targetCandidateProfile} onChange={(e) => setTargetCandidateProfile(e.target.value)} placeholder="e.g. Senior product engineers" className="w-full px-4 py-2.5 bg-black border border-[#222] focus:border-[#d4af37]/30 focus:outline-none text-[11px] leading-relaxed text-white h-20 resize-none" />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isGenerating || !selectedClientId} className="w-full py-4 bg-white text-black hover:bg-[#d4af37] hover:text-black font-bold uppercase text-[10px] font-mono tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 border border-[#222] disabled:opacity-50">
                  {isGenerating ? (<><RefreshCw size={13} className="animate-spin text-black" /><span>Generating {selectedTone} narrative...</span></>) : (<><Sparkles size={13} className="text-black" /><span>Generate {selectedTone} Narrative</span></>)}
                </button>
              </form>

              {/* Right Column: Output */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-[#0a0a0a] border border-[#222] p-8 h-full min-h-[500px] flex flex-col justify-between relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af37]/5 tab-transparent pointer-events-none" />
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center py-24">
                        <div className="w-10 h-10 border border-[#d4af37] border-t-transparent animate-spin mb-6" />
                        <span className="text-[9px] font-mono tracking-[0.3em] text-[#d4af37] uppercase block animate-pulse">Running semantic synthesis...</span>
                        <p className="text-xs font-light text-zinc-400 max-w-xs mt-3 text-center font-sans leading-relaxed">Analyzing competitive benefit indices, aligning custom culture vectors, and drafting employer positioning...</p>
                      </motion.div>
                    ) : currentNarrative ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-4 mb-6">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-[8px] font-mono border border-[#d4af37]/15 uppercase tracking-widest font-semibold">TALE ENGINE PRO</span>
                              <span className={`px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest border ${currentNarrative.tone === 'professional' ? 'bg-blue-950/20 text-blue-400 border-blue-400/20' : currentNarrative.tone === 'creative' ? 'bg-purple-950/20 text-purple-400 border-purple-400/20' : 'bg-emerald-950/20 text-emerald-400 border-emerald-400/20'}`}>{currentNarrative.tone?.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <button onClick={handleCopy} type="button" className="px-3 py-1.5 bg-black border border-[#222] hover:border-white hover:text-white text-[9px] font-mono uppercase text-zinc-400 transition-colors flex items-center gap-1.5">
                                {isCopied ? <Check size={11} className="text-emerald-400" /> : <Save size={11} className="hidden" />}
                                <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                              </button>
                              <button onClick={handleExportPDF} disabled={isExporting} type="button" className="px-3 py-1.5 bg-black border border-[#222] hover:border-[#d4af37] hover:text-[#d4af37] text-[9px] font-mono uppercase transition-colors flex items-center gap-1.5 disabled:opacity-50">
                                <Download size={11} className={isExporting ? 'animate-spin' : ''} />
                                <span>{isExporting ? 'EXPORTING...' : 'PDF'}</span>
                              </button>
                              <button onClick={handleSave} disabled={isSaved} type="button" className={`px-3 py-1.5 text-[9px] font-mono uppercase transition-colors flex items-center gap-1.5 ${isSaved ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-400/20' : 'bg-white text-black hover:bg-[#d4af37] border border-white'}`}>
                                {isSaved ? <Check size={11} /> : null}
                                <span>{isSaved ? 'SAVED' : 'SAVE TO LEDGER'}</span>
                              </button>
                            </div>
                          </div>

                          {/* TALENT DNA SIMULATOR */}
                          <div className="mb-8">
                            <TalentDNASimulator 
                              clientName={clients.find(c => c.id === selectedClientId)?.name || 'Selected Client'} 
                              narrativeTone={currentNarrative.tone || 'professional'} 
                            />
                          </div>

                          <div ref={narrativeRef} className="space-y-6 text-[12px] font-sans font-light leading-relaxed text-zinc-300 max-h-[350px] overflow-y-auto pr-3 border border-[#222] p-5 bg-black">
                            <div className="font-serif italic font-normal text-lg text-[#d4af37] mb-6 pb-3 border-b border-[#222]">{currentNarrative.title}</div>
                            {displaySections.map((section, idx) => (
                              <div key={idx} className="mb-6">
                                <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] mb-3 font-semibold">{section.title}</h3>
                                {section.paragraphs.map((para, pIdx) => (<p key={pIdx} className="mb-3 serif-italic opacity-90 leading-7">{para}</p>))}
                                {section.bullets.length > 0 && (
                                  <div className="space-y-2 mt-3 mb-4">
                                    {section.bullets.map((bullet, bIdx) => (
                                      <div key={bIdx} className="flex items-start gap-2 pl-2">
                                        <span className="text-[#d4af37] font-mono mt-1">&bull;</span>
                                        <span className="text-zinc-300">{bullet}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 p-4 bg-black border border-[#222] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 border border-[#222] text-[#d4af37] flex items-center justify-center rounded-full font-mono font-medium text-xs">{currentNarrative.matchScore}%</div>
                              <div>
                                <span className="text-[9px] font-mono tracking-widest text-[#d4af37] uppercase block leading-3 animate-pulse">Talent Match score</span>
                                <span className="text-[11px] font-sans font-light text-zinc-500">Predicted cultural fit accuracy</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest font-semibold bg-emerald-950/20 border border-emerald-400/20 px-2.5 py-0.5">OPTIMAL CALIBRATION</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center py-24 text-center font-sans space-y-4">
                        <Sparkles size={20} className="text-[#d4af37]" />
                        <div className="space-y-1">
                          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Positioning Brief Ledger</h3>
                          <p className="text-xs font-light text-zinc-500 max-w-xs leading-relaxed mx-auto">Select your target portfolio company. Choose a narrative tone and compile their authentic values and benefits.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="competitor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CompetitorAnalysisView
              clientId={selectedClientId}
              clientName={selectedClient?.name || ''}
              clientIndustry={selectedClient?.industry || ''}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}