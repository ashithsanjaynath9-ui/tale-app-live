import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Sparkles, ArrowLeft, Chrome, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (userName: string, agencyName: string) => void;
}

export default function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('demo@tale.agency');
  const [password, setPassword] = useState('sovereign123');
  const [agencyName, setAgencyName] = useState('Sovereign Talent Group');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please provide correct credentials.');
      return;
    }

    if (activeTab === 'signup' && !agencyName) {
      setError('Please specify your agency brand name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        // SIGN UP FLOW
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              agency_name: agencyName,
              user_name: email.split('@')[0]
            }
          }
        });

        if (error) throw error;

        // For now, auto-login after signup (since we disabled email confirmation)
        const userSession = {
          userName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          agencyName: agencyName,
          email,
          rememberMe
        };
        
        if (rememberMe) {
          localStorage.setItem('tale_auth_user', JSON.stringify(userSession));
        } else {
          sessionStorage.setItem('tale_auth_user', JSON.stringify(userSession));
        }

        onLoginSuccess(userSession.userName, userSession.agencyName);
      } else {
        // SIGN IN FLOW
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Get user metadata or use defaults
        const userName = data.user?.user_metadata?.user_name || email.split('@')[0];
        const agency = data.user?.user_metadata?.agency_name || 'Sovereign Talent Group';
        
        const userSession = {
          userName: userName.charAt(0).toUpperCase() + userName.slice(1),
          agencyName: agency,
          email,
          rememberMe
        };
        
        if (rememberMe) {
          localStorage.setItem('tale_auth_user', JSON.stringify(userSession));
        } else {
          sessionStorage.setItem('tale_auth_user', JSON.stringify(userSession));
        }

        onLoginSuccess(userSession.userName, userSession.agencyName);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      // OAuth will redirect the user
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-white flex flex-col justify-between p-6 relative overflow-hidden selection:bg-gold selection:text-black">
      {/* Background Subtle Elegant Radial */}
      <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[500px] h-[500px] gold-glow-radial pointer-events-none -z-10" />

      {/* Floating Home Link */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-charcoal-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO PORTAL
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-8 h-8 bg-black border border-gold flex items-center justify-center text-gold font-serif text-xs font-semibold tracking-wider">
            T
          </div>
          <span className="font-serif text-sm font-bold tracking-[0.25em] text-white">TALE</span>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-charcoal-900 border border-white/5 p-10 relative hover:shadow-[0_0_50px_rgba(212,175,55,0.03)] transition-all duration-500"
        >
          {/* Subtle gold line on top of card */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold opacity-60" />

          {/* Vibe Title & Logo */}
          <div className="text-center mb-8">
            <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-mono block mb-2">Agency Access</span>
            <h2 className="text-2xl font-display font-light text-white tracking-tight">
              Sovereign Narrative Intelligence
            </h2>
          </div>

          {/* Toggle Tab */}
          <div className="flex border-b border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-3 text-xs tracking-widest font-mono uppercase text-center focus:outline-none transition-all relative ${
                activeTab === 'signin' ? 'text-gold' : 'text-charcoal-300 hover:text-white'
              }`}
            >
              Sign In
              {activeTab === 'signin' && (
                <motion.div layoutId="auth-tab-line" className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 pb-3 text-xs tracking-widest font-mono uppercase text-center focus:outline-none transition-all relative ${
                activeTab === 'signup' ? 'text-gold' : 'text-charcoal-300 hover:text-white'
              }`}
            >
              Create Account
              {activeTab === 'signup' && (
                <motion.div layoutId="auth-tab-line" className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-xs font-mono text-red-500 bg-red-950/20 border border-red-500/10 p-3 text-center">
                {error}
              </div>
            )}

            {activeTab === 'signup' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                <label className="text-[10px] tracking-wider uppercase font-mono text-charcoal-300">Agency Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-300">
                    <Sparkles size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Sovereign Talent Group"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 focus:border-gold/35 focus:outline-none text-sm transition-colors text-white font-sans"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] tracking-wider uppercase font-mono text-charcoal-300">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-300">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 focus:border-gold/35 focus:outline-none text-sm transition-colors text-white font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] tracking-wider uppercase font-mono text-charcoal-300">Secret Token (Password)</label>
                {activeTab === 'signin' && (
                  <span className="text-[9px] font-mono tracking-wider text-gold hover:text-gold-hover transition-colors cursor-pointer">
                    Forgot Key?
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-300">
                  <Lock size={14} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-black border border-white/5 focus:border-gold/35 focus:outline-none text-sm transition-colors text-white font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-gold cursor-pointer rounded-none border-white/5 bg-black"
                />
                <span className="text-[11px] font-sans tracking-wide text-charcoal-300 hover:text-white transition-colors">
                  Remember sovereign entry credentials
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-black hover:bg-gold hover:text-black font-bold uppercase text-xs tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  {activeTab === 'signin' ? 'Verify Secret Token' : 'Begin Agency Activation'}
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative px-3 bg-charcoal-900 text-[10px] font-mono tracking-[0.2em] text-charcoal-300 uppercase">OR CONTINUALLY AUTO-AUTHENTICATE</span>
          </div>

          {/* Social login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white text-white font-semibold uppercase text-xs tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2.5"
          >
            <Chrome size={14} className="text-gold" />
            Continue with Google SSO
          </button>
        </motion.div>
      </main>

      {/* Footer info lockups */}
      <footer className="w-full text-center py-4">
        <p className="text-[10px] font-mono text-charcoal-300/50 uppercase tracking-widest">
          Sovereign Security Sandbox Verification Enforced &bull; OAuth 2.0 Client Handshake Capable
        </p>
      </footer>
    </div>
  );
}