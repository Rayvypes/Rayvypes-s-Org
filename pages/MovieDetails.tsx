
import React, { useState } from 'react';
import { Movie, Page } from '../types';
import VideoPlayer from '../components/VideoPlayer';

interface MovieDetailsProps {
  movie: Movie;
  movies: Movie[];
  onNavigate: (page: Page, id?: string) => void;
  onToggleWatchlist: (id: string) => void;
  isInWatchlist: boolean;
  isPremiumUser: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, movies, onNavigate, onToggleWatchlist, isInWatchlist, isPremiumUser }) => {
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const relatedMovies = movies.filter(m => m.id !== movie.id).slice(0, 3);
  
  const isLocked = movie.isPremium && !isPremiumUser;

  const handleWatchAction = () => {
    if (isLocked) {
      setShowUpgradeModal(true);
      return;
    }

    // Prioritize the actual movie file if it was uploaded
    const urlToPlay = movie.movieUrl || movie.trailerUrl;
    if (urlToPlay) {
      setPlayerUrl(urlToPlay);
      setShowPlayerModal(true);
    }
  };

  const handleDownload = () => {
    if (!isPremiumUser) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            alert(`${movie.title} is now available for offline viewing!`);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#1a1d23] border border-yellow-400/30 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center">
              <h2 className="text-4xl font-montserrat font-black text-white uppercase mb-4 tracking-tighter">Premium <span className="text-yellow-400">Locked</span></h2>
              <p className="text-gray-400 text-lg mb-8">Join CinePrime Legend to watch this full production.</p>
              <button onClick={() => onNavigate(Page.PREMIUM)} className="w-full bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-95">UPGRADE NOW</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Player Modal */}
      {showPlayerModal && playerUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/98 backdrop-blur-3xl animate-in zoom-in-95 duration-300">
          <button 
            onClick={() => { setShowPlayerModal(false); setPlayerUrl(null); }}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all p-3 bg-white/5 rounded-full z-[110] outline-none"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="w-full max-w-7xl">
            <VideoPlayer url={playerUrl} title={`${movie.title} ${movie.movieUrl ? 'Feature' : 'Trailer'}`} autoplay={true} />
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative h-[75vh] w-full">
        <img src={movie.backdropUrl} className="w-full h-full object-cover" alt={movie.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.isPremium && <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">PREMIUM</span>}
                <div className="flex gap-2">
                  {movie.genre.map(g => (
                    <span key={g} className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <h1 className="text-5xl md:text-8xl font-montserrat font-black text-white mb-8 uppercase tracking-tighter italic">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6">
                <button 
                  onClick={handleWatchAction}
                  className="px-10 py-5 bg-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-400/20 flex items-center gap-3"
                >
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                   {movie.movieUrl ? 'WATCH FEATURE' : 'WATCH TRAILER'}
                </button>

                {isPremiumUser && (
                  <button 
                    disabled={isDownloading}
                    onClick={handleDownload}
                    className="px-10 py-5 bg-transparent text-blue-400 border-2 border-blue-400/50 rounded-2xl font-black uppercase tracking-widest hover:border-blue-400 transition-all flex items-center gap-3 relative overflow-hidden"
                  >
                     {isDownloading && <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all" style={{ width: `${downloadProgress}%` }}></div>}
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                     {isDownloading ? `${downloadProgress}%` : 'DOWNLOAD'}
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
