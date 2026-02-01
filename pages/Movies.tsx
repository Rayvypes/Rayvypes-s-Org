
import React, { useState, useEffect, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import { Page, Movie } from '../types';
import { fetchLiveUgandanMovies } from '../services/geminiService';

interface MoviesProps {
  onNavigate: (page: Page, id?: string, query?: string) => void;
  movies: Movie[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  initialSearch?: string;
}

const Movies: React.FC<MoviesProps> = ({ onNavigate, movies, watchlist, onToggleWatchlist, initialSearch = '' }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState(initialSearch);
  const [liveResults, setLiveResults] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const uniqueVJs = useMemo(() => {
    const vjs = movies
      .map(m => m.vjName)
      .filter((vj): vj is string => !!vj);
    return Array.from(new Set(vjs)).sort();
  }, [movies]);

  const genreCategories = ['All', 'Action', 'Drama', 'Latest 2024'];
  const vjCategories = ['VJ Translated', ...uniqueVJs];

  useEffect(() => {
    let isMounted = true;
    
    const syncWithWeb = async () => {
      // Don't fetch if we already have results in this session to save quota
      if (liveResults) return;

      setIsSyncing(true);
      const data = await fetchLiveUgandanMovies();
      if (isMounted && data) {
        setLiveResults(data);
      }
      if (isMounted) setIsSyncing(false);
    };

    syncWithWeb();
    return () => { isMounted = false; };
  }, []);

  const filteredMovies = movies.filter(m => {
    let matchesCategory = true;
    
    if (filter === 'All') {
      matchesCategory = true;
    } else if (filter === 'VJ Translated') {
      matchesCategory = m.isTranslated === true;
    } else if (filter === 'Latest 2024') {
      matchesCategory = m.year >= 2024;
    } else if (uniqueVJs.includes(filter)) {
      matchesCategory = m.vjName === filter;
    } else {
      matchesCategory = m.genre.includes(filter);
    }

    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          (m.vjName?.toLowerCase() || '').includes(search.toLowerCase()) ||
                          m.genre.some(g => g.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-montserrat font-black text-white uppercase tracking-tighter">Movie Hub</h1>
            {isSyncing && (
              <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Auto-Updating</span>
              </div>
            )}
          </div>
          <p className="text-gray-400 max-w-lg">Discover translated hits by your favorite VJs and original Ugandan masterpieces.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
             <input 
              type="text" 
              placeholder="Search titles, VJs, or genres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1d23] border border-white/5 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
             />
             <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1d23]/50 border border-white/5 p-6 rounded-[2rem] mb-12 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex-shrink-0 w-20">Browse:</span>
          <div className="flex gap-3">
            {genreCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  filter === cat 
                    ? 'bg-white text-black border-white shadow-lg' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-[10px] font-black text-yellow-400/60 uppercase tracking-widest flex-shrink-0 w-20">VJ Circuit:</span>
          <div className="flex gap-3">
            {vjCategories.map(vj => (
              <button
                key={vj}
                onClick={() => setFilter(vj)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  filter === vj 
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20' 
                    : 'bg-yellow-400/5 text-yellow-400 border-yellow-400/10 hover:border-yellow-400/30 hover:bg-yellow-400/10'
                }`}
              >
                {vj.startsWith('VJ') ? vj : `VJ ${vj}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {search && (
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-bold">{filteredMovies.length}</span> results for "<span className="text-yellow-400">{search}</span>"
          </p>
          <button onClick={() => setSearch('')} className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest">Clear Search</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onClick={(id) => onNavigate(Page.MOVIE_DETAILS, id)} onToggleWatchlist={onToggleWatchlist} isInWatchlist={watchlist.includes(movie.id)} />
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="py-40 text-center bg-[#1a1d23] rounded-[3rem] border border-dashed border-white/5">
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No movies found matching your query</p>
          <button onClick={() => { setFilter('All'); setSearch(''); }} className="mt-4 text-yellow-400 font-bold text-sm hover:underline">Clear all filters</button>
        </div>
      )}

      {liveResults && (
        <div className="mt-20 bg-[#1a1d23] border border-yellow-400/10 p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-3 uppercase tracking-tight">Latest VJ Circuit Intelligence</h3>
              <div className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed space-y-2">
                {liveResults}
              </div>
            </div>
          </div>
          {/* Subtle indicator that data might be from editorial cache */}
          <div className="absolute bottom-4 right-8 text-[8px] text-gray-600 font-black uppercase tracking-widest opacity-40">
            Verified Archives
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
