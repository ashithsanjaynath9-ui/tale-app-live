import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  Sparkles, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  DollarSign
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  agencyName: string;
  userName: string;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Analytics Dashboard', icon: LayoutDashboard },
  { id: 'clients' as Page, label: 'Client Companies', icon: Building2 },
  { id: 'narrative-builder' as Page, label: 'Narrative Intelligence', icon: Sparkles },
  { id: 'impact-intelligence' as Page, label: 'Impact Intelligence', icon: DollarSign },
  { id: 'talent-index' as Page, label: 'Talent Market Feed', icon: TrendingUp },
  { id: 'settings' as Page, label: 'Agency Settings', icon: Settings },
];

export default function Sidebar({ currentPage, onPageChange, agencyName, userName, onLogout, isOpen, onToggle, isDarkMode, toggleTheme }: SidebarProps) {
  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={onToggle} className="fixed top-6 left-6 z-50 md:hidden p-2 bg-[#0a0a0a] border border-[#222] text-white">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#050505] border-r border-[#222] transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-[#222]">
          <h1 className="text-xl font-bold tracking-widest text-white font-mono flex items-center gap-2">
            TALE <span className="w-2 h-2 bg-[#d4af37] rounded-full"></span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onPageChange(item.id); if (window.innerWidth < 768) onToggle(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 group whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#0a0a0a] text-[#d4af37] border-l-2 border-[#d4af37]' 
                    : 'text-zinc-500 hover:text-white hover:bg-[#0a0a0a]'
                }`}
              >
                <Icon size={14} className={`shrink-0 ${isActive ? 'text-[#d4af37]' : 'text-zinc-600 group-hover:text-white'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle & User Profile */}
        <div className="p-4 border-t border-[#222] space-y-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border border-[#222] hover:border-[#d4af37]/30 transition-colors group whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon size={12} className="text-[#d4af37]" /> : <Sun size={12} className="text-[#d4af37]" />}
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 group-hover:text-white">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDarkMode ? 'bg-[#d4af37]' : 'bg-zinc-600'}`}>
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-xs font-serif text-white shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-white truncate">{userName}</p>
              <p className="text-[9px] font-mono text-[#d4af37] truncate uppercase">{agencyName}</p>
            </div>
          </div>

          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#222] text-[9px] font-mono uppercase tracking-widest text-zinc-500 hover:text-red-400 hover:border-red-900/30 transition-colors whitespace-nowrap">
            <LogOut size={11} /> De-authenticate Session
          </button>
        </div>
      </aside>
    </>
  );
}