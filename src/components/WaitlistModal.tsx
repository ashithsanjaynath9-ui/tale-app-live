import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, company_name: companyName || null }]);

      if (error) throw error;

      setSuccess(true);
      setEmail('');
      setCompanyName('');
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-[#fbbf24]/20 rounded-lg max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Request Access</h2>
        <p className="text-gray-400 mb-6">Join the waitlist for early access</p>

        {success ? (
          <div className="text-green-400 text-center py-4">
            ✓ Successfully joined the waitlist! We'll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#fbbf24]/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#fbbf24]"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#fbbf24]/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#fbbf24]"
                placeholder="Your Company"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fbbf24] text-black font-semibold py-3 rounded hover:bg-[#fbbf24]/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}