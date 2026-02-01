
import React from 'react';
import { Page, Movie } from '../types';
import MovieCard from '../components/MovieCard';

interface WatchlistProps {
  watchlist: string[];
  movies: Movie[];
  onNavigate: (page: Page, id?: string) => void;
  onToggleWatchlist: (id: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlist, movies, onNavigate, onToggleWatchlist }) => {
  const watchlistedMovies = movies.filter(m => watchlist.includes(m.id));

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-5xl font-montserrat font-black text-white mb-3 uppercase">My Watchlist</h1>
        <div className="h-1.5 w-24 bg-yellow-400 mb-4"></div>
        <p className="text-gray-400 max-w-xl">
          Your personal collection of Ugandan hits and VJ favorites. Saved for later.
        </p>
      </div>

      {watchlistedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {watchlistedMovies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={(id) => onNavigate(Page.MOVIE_DETAILS, id)} 
              onToggleWatchlist={onToggleWatchlist}
              isInWatchlist={true}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-[#1a1d23] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Your watchlist is empty</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Browse the directory and save movies you'd like to watch later.</p>
          <button 
            onClick={() => onNavigate(Page.MOVIES)}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
          >
            BROWSE MOVIES
          </button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
