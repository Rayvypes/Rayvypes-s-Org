
import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (id: string) => void;
  onToggleWatchlist?: (id: string) => void;
  isInWatchlist?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onToggleWatchlist, isInWatchlist }) => {
  // Handle 'Enter' key for Android TV D-Pad
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick(movie.id);
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(movie.id);
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-[#1a1d23] border transition-all duration-300 focus:scale-110 focus:z-50 focus:shadow-2xl focus:shadow-yellow-400/30 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/10 outline-none ${
        movie.isPremium ? 'border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'border-white/5'
      }`}
      onClick={() => onClick(movie.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"></div>
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {movie.isPremium && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-[10px] sm:text-[12px] font-black px-3 py-1.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.3),0_0_20px_rgba(250,204,21,0.4)] uppercase tracking-[0.1em] border border-yellow-300/50 transform -rotate-1 group-hover:rotate-0 transition-transform">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              PREMIUM
            </div>
          )}
          {movie.isTranslated && (
            <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest border border-white/20 w-fit">
              VJ {movie.vjName}
            </span>
          )}
        </div>

        {/* Action Buttons Top Right */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
          {/* Watchlist Button */}
          {onToggleWatchlist && (
            <button 
              onClick={handleToggleWatchlist}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 active:scale-90 ${
                isInWatchlist 
                  ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                  : 'bg-black/40 border-white/10 text-white hover:border-yellow-400/50 hover:text-yellow-400'
              }`}
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              <svg className="w-4 h-4" fill={isInWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </button>
          )}

          {/* Rating Badge */}
          <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10 flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-xs font-bold">{movie.rating}</span>
          </div>
        </div>

        {/* Premium Corner Accent */}
        {movie.isPremium && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
             <div className="absolute top-0 right-0 w-[200%] h-6 bg-yellow-400/20 rotate-45 translate-x-[30%] -translate-y-[50%] blur-sm"></div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            movie.isPremium ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'
          }`}>
            {movie.genre[0]}
          </span>
          <span className="text-gray-300 text-xs">{movie.year}</span>
        </div>
        <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-yellow-400 group-focus:text-yellow-400 transition-colors line-clamp-1">
          {movie.title}
        </h3>
        {/* Visible synopsis on focus for TV users to read details quickly */}
        <p className="text-gray-400 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
          {movie.description}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
