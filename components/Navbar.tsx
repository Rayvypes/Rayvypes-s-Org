
import React, { useState } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page, id?: string, query?: string) => void;
  watchlistCount: number;
  isPremium?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, watchlistCount, isPremium }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Home', value: Page.HOME },
    { label: 'Movies', value: Page.MOVIES },
    { label: 'Talent', value: Page.TALENT },
    { label: 'News', value: Page.NEWS },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(Page.MOVIES, undefined, searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0f1115]/90 backdrop-blur-xl z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div 
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer shrink-0 p-2 rounded-xl focus:bg-white/5 outline-none transition-colors" 
            onClick={() => onNavigate(Page.HOME)}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate(Page.HOME)}
          >
            <div className="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xl">C</span>
            </div>
            <span className="text-xl font-montserrat tracking-tighter text-white uppercase">
              CINE<span className="text-yellow-400">PRIME</span>
            </span>
          </div>

          {/* Desktop Search Bar - Always accessible via Tab/D-pad */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, VJs..."
                className="block w-full bg-[#1a1d23]/80 border border-white/10 rounded-full py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all shadow-inner"
              />
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.value)}
                  className={`${
                    currentPage === item.value
                      ? 'text-yellow-400 bg-white/5'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  } px-4 py-2 rounded-xl text-sm font-bold transition-all uppercase tracking-widest whitespace-nowrap focus:text-yellow-400 focus:scale-105 outline-none`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <button 
              onClick={() => onNavigate(Page.WATCHLIST)}
              className={`relative p-3 rounded-xl transition-all outline-none focus:bg-white/10 focus:scale-110 ${currentPage === Page.WATCHLIST ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}
              aria-label="View Watchlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {watchlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-yellow-400 text-black text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[#0f1115]">
                  {watchlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => onNavigate(Page.PREMIUM)}
              className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl outline-none focus:scale-110 ${
                isPremium 
                ? 'bg-yellow-400 text-black shadow-yellow-400/20' 
                : 'bg-white/5 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400 hover:text-black focus:bg-yellow-400 focus:text-black'
              }`}
            >
              {isPremium ? 'PREMIUM' : 'UPGRADE'}
            </button>
          </div>

          {/* Mobile/TV Compact Controls */}
          <div className="md:hidden flex items-center gap-3">
             <button 
              onClick={() => onNavigate(Page.PREMIUM)}
              className="text-yellow-400 p-2 rounded-lg focus:bg-white/10 outline-none"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg focus:bg-white/10 outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/D-Pad Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-[#0f1115]/95 backdrop-blur-2xl border-b border-white/5 p-6 space-y-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#1a1d23] border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </form>
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.value);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-5 py-4 rounded-2xl text-lg font-bold text-gray-300 hover:text-white hover:bg-white/5 focus:bg-yellow-400 focus:text-black outline-none transition-all uppercase"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => {
                onNavigate(Page.PREMIUM);
                setIsOpen(false);
              }}
              className="block w-full text-left px-5 py-4 rounded-2xl text-lg font-bold text-yellow-400 hover:bg-white/5 focus:bg-yellow-400 focus:text-black outline-none transition-all uppercase"
            >
              Premium Access
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
