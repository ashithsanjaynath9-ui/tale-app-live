import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, TrendingUp, Shield, Target, Zap, BarChart3, 
  CheckCircle2, ArrowRight, Building2, Users, Award,
  ChevronRight, Play, Star, Lock
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onRequestAccess: () => void;
}

export default function LandingPage({ onNavigate, onRequestAccess }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Sparkles, title: 'Dynamic Narratives', desc: 'AI evolves instantly with market trends', color: 'from-[#d4af37]/20 to-transparent' },
    { icon: Shield, title: 'Competitor Intelligence', desc: 'Auto-discovers & analyzes rival branding', color: 'from-blue-500/20 to-transparent' },
    { icon: BarChart3, title: 'Impact Intelligence', desc: '47.3x ROI with predictive savings', color: 'from-emerald-500/20 to-transparent' },
    { icon: Target, title: 'Talent Match Score', desc: '92% cultural fit accuracy before interviews', color: 'from-purple-500/20 to-transparent' },
    { icon: Zap, title: 'Talent DNA Simulator', desc: 'Predict narrative impact on applicant quality', color: 'from-pink-500/20 to-transparent' },
    { icon: TrendingUp, title: 'Market Telemetry', desc: 'Real-time competitor benefit positioning', color: 'from-orange-500/20 to-transparent' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-[#222]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-lg flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
              <span className="text-black font-mono font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold tracking-widest font-mono">TALE</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 hover:text-[#d4af37] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <button 
              onClick={() => onNavigate('login')}
              className="px-5 py-2 border border-[#333] text-[9px] font-mono uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-all rounded-md"
            >
              Client Login
            </button>
            <button 
              onClick={onRequestAccess}
              className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#fcd34d] text-black text-[9px] font-mono uppercase tracking-widest font-bold hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all rounded-md flex items-center gap-2"
            >
              Request Access <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-8">
              <Star size={12} className="text-[#d4af37] fill-[#d4af37]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">Trusted by 50+ Elite Agencies</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light font-display serif-italic mb-6 leading-[1.1]">
              The Intelligence Behind<br />
              <span className="text-[#d4af37] not-italic relative">
                Great Hires
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-transparent rounded-full" />
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-xl mb-10 font-light leading-relaxed">
              TALE helps high-end recruiting agencies build employer narratives that attract top-tier talent—powered by AI, competitive intelligence, and predictive ROI analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <button 
                onClick={onRequestAccess}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#fcd34d] text-black text-[10px] font-mono uppercase tracking-widest font-bold hover:shadow-xl hover:shadow-[#d4af37]/40 transition-all rounded-lg flex items-center justify-center gap-3"
              >
                Request Access
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="group w-full sm:w-auto px-8 py-4 border border-[#333] text-[10px] font-mono uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-all rounded-lg flex items-center justify-center gap-3"
              >
                <Play size={14} className="fill-current" />
                Explore TALE Live
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 border-t border-[#222] pt-8">
              {[
                { value: '47.3x', label: 'Avg. ROI' },
                { value: '74%', label: 'Cost Reduction' },
                { value: '92%', label: 'Match Accuracy' }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-light text-white mb-1">{stat.value}</p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Live Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 to-blue-500/20 rounded-3xl blur-3xl opacity-30" />
            <div className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 shadow-2xl">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-xs">T</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white">TALE Dashboard</p>
                    <p className="text-[9px] text-zinc-500">Real-time intelligence</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
              </div>

              {/* Animated Feature Cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 rounded-lg flex items-center justify-center">
                      {React.createElement(features[activeFeature].icon, { size: 18, className: "text-[#d4af37]" })}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{features[activeFeature].title}</p>
                      <p className="text-[10px] text-zinc-500">{features[activeFeature].desc}</p>
                    </div>
                  </div>

                  {/* Mock Chart/Visual */}
                  <div className="bg-black/50 border border-[#222] rounded-lg p-4 h-40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent" />
                    <div className="relative flex items-end justify-between h-full gap-2">
                      {[65, 45, 80, 55, 90, 70, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-[#d4af37] to-[#fcd34d] rounded-t-sm opacity-80"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Live Analysis
                    </span>
                    <span>Updated 2s ago</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Scroll Trust Bar */}
      <section className="py-8 border-y border-[#222] bg-[#0a0a0a] overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8">
              {['Korn Sense', 'Vektor Recruit', 'Maven Lux', 'Sovereign.co', 'Heidrick Alta', 'Russell Reynolds', 'Spencer Stuart', 'Egon Zehnder'].map((brand) => (
                <span key={`${brand}-${i}`} className="text-sm font-mono text-zinc-600 uppercase tracking-widest hover:text-[#d4af37] transition-colors cursor-default">
                  {brand}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Platform Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-light font-display serif-italic mb-4">
              Engineered for Outlier Placement
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light">
              Every feature is designed to give your agency an unfair advantage in the talent war.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Large Feature */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 row-span-2 bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[#222] rounded-2xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl group-hover:bg-[#d4af37]/10 transition-colors" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#d4af37]/20">
                    <Sparkles size={24} className="text-black" />
                  </div>
                  <h3 className="text-2xl font-light font-display serif-italic mb-3">Dynamic Narratives</h3>
                  <p className="text-zinc-400 font-light leading-relaxed max-w-md">
                    AI-powered employer branding that evolves instantly with changing market trends. 
                    Our engine analyzes thousands of data points to craft narratives that resonate with your ideal candidates.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[#d4af37] text-sm font-mono group-hover:gap-4 transition-all">
                  See it in action <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>

            {/* Medium Features */}
            {[
              { icon: Shield, title: 'Competitor Intelligence', desc: 'AI auto-discovers rivals and analyzes their employer branding gaps.', gradient: 'from-blue-500/10' },
              { icon: BarChart3, title: 'Impact Intelligence', desc: '47.3x ROI Command Center with predictive hiring cost savings.', gradient: 'from-emerald-500/10' },
              { icon: Target, title: 'Talent Match Score', desc: '92% cultural fit accuracy before the first conversation.', gradient: 'from-purple-500/10' },
              { icon: Zap, title: 'Talent DNA Simulator', desc: 'Predict narrative impact with interactive radar charts.', gradient: 'from-pink-500/10' }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${feature.gradient} to-[#0a0a0a] border border-[#222] rounded-2xl p-6 relative overflow-hidden group`}
              >
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-10 h-10 bg-[#1a1a1a] border border-[#222] rounded-lg flex items-center justify-center group-hover:border-[#d4af37]/30 transition-colors">
                    {React.createElement(feature.icon, { size: 18, className: "text-zinc-400 group-hover:text-[#d4af37] transition-colors" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-light font-display serif-italic mb-2">{feature.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Architectural Flow
            </p>
            <h2 className="text-4xl md:text-5xl font-light font-display serif-italic">
              Simplified Acquisition Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/30 to-[#d4af37]/0" />
            
            {[
              { number: '01', title: 'Connect', desc: 'Integrate your portfolio firms and ATS in under 5 minutes. AI automatically begins scanning.' },
              { number: '02', title: 'Generate', desc: 'Our intelligence compiles cultural data, competitive analysis, and market metrics to forge elite brand briefs.' },
              { number: '03', title: 'Measure', desc: 'Evaluate high-quality inbound applications, conversion ratios, and cost-per-hire reduction with real-time dashboards.' }
            ].map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="text-center relative"
              >
                <div className="w-24 h-24 mx-auto bg-[#050505] border border-[#222] rounded-full flex items-center justify-center mb-8 relative z-10 group hover:border-[#d4af37]/50 transition-colors">
                  <p className="text-3xl font-light font-display text-[#d4af37]/30 group-hover:text-[#d4af37] transition-colors">{step.number}</p>
                </div>
                <h3 className="text-xl font-light font-display serif-italic mb-4">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto font-light">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Enterprise Plan
            </p>
            <h2 className="text-4xl md:text-5xl font-light font-display serif-italic mb-6">
              Built for Agencies That Scale
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[#222] rounded-2xl relative overflow-hidden group hover:border-[#d4af37]/30 transition-colors"
          >
            <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-[#d4af37] to-[#fcd34d] text-black text-[8px] font-mono uppercase tracking-widest font-bold rounded-bl-lg">
              All-Inclusive Single Tier
            </div>

            <div className="text-center mb-10">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-4">License Fees</p>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl font-light font-display">$10,000</span>
                <span className="text-[#d4af37] font-mono text-sm">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 font-light">
                Per agency license. Unlimited client companies. No scaling fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                'Unlimited Client Entities & Narrative Stores',
                'Dynamic, Context-Aware Custom Narrative Creation',
                'Competitor Intelligence Engine with Auto-Discovery',
                'Impact Intelligence ROI Command Center',
                'Talent DNA Simulator & Predictive Analytics',
                'Talent Match Score API Access',
                'Real-Time Market Competitor Telemetry Briefs',
                'Automated Employer Branding Analysis',
                'Dedicated Sovereign Client Success Architect (24-Hour SLAs)'
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 size={14} className="text-[#d4af37] shrink-0 mt-1" />
                  <span className="text-xs text-zinc-300 font-light">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onRequestAccess}
              className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#fcd34d] text-black text-[10px] font-mono uppercase tracking-widest font-bold hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all rounded-lg"
            >
              Start Your Enterprise Trial
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light font-display serif-italic mb-6">
              Ready to Transform Your Recruitment?
            </h2>
            <p className="text-lg text-zinc-400 mb-12 font-light max-w-2xl mx-auto">
              Join the world's most sophisticated placement agencies who have weaponized employer positioning with TALE.
            </p>
            <button 
              onClick={onRequestAccess}
              className="group px-12 py-5 bg-gradient-to-r from-[#d4af37] to-[#fcd34d] text-black text-[10px] font-mono uppercase tracking-widest font-bold hover:shadow-2xl hover:shadow-[#d4af37]/40 transition-all rounded-lg inline-flex items-center gap-3"
            >
              <Lock size={14} />
              Get Started Individually
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[9px] text-zinc-600 font-mono mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[#222]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-lg flex items-center justify-center">
                  <span className="text-black font-mono font-bold text-lg">T</span>
                </div>
                <span className="text-lg font-bold tracking-widest font-mono">TALE</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-light mb-4">
                Sovereign technology for executive and specialized recruiting agencies.
              </p>
              <div className="flex items-center gap-4">
                {['LinkedIn', 'Twitter', 'GitHub'].map((social) => (
                  <span key={social} className="text-[9px] font-mono text-zinc-600 hover:text-[#d4af37] transition-colors cursor-pointer">
                    {social}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-white mb-4">Product</h4>
              <ul className="space-y-2 text-xs text-zinc-500 font-light">
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Telemetry Engine</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Talent Match Scoring</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Competitor Intelligence</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Impact Analytics</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Intelligence Index</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-white mb-4">Company</h4>
              <ul className="space-y-2 text-xs text-zinc-500 font-light">
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Our Thesis</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Enterprise Services</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Select Partners</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Contact Desk</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-xs text-zinc-500 font-light">
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Brand Protection</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Privacy Charter</li>
                <li className="hover:text-[#d4af37] transition-colors cursor-pointer">Sovereign Terms</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[9px] text-zinc-600 font-mono">
              © 2026 TALE Platform Inc. All rights reserved.
            </p>
            <p className="text-[9px] text-zinc-600 font-mono">
              DESIGNED FOR EXECUTIVE EXCELLENCE • PORT 3000 SECURITY ENFORCED
            </p>
          </div>
        </div>
      </footer>

      {/* Add custom CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}