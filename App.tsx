
import React, { useState, useEffect } from 'react';
import { Page, Movie, SubscriptionType } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Talent from './pages/Talent';
import News from './pages/News';
import Watchlist from './pages/Watchlist';
import Admin from './pages/Admin';
import Premium from './pages/Premium';
import AICurator from './components/AICurator';
import { MovieService, SubscriptionService } from './services/databaseService';
import { MOVIES } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [moviesList, setMoviesList] = useState<Movie[]>(MOVIES);
  const [subscription, setSubscription] = useState<SubscriptionType>('free');
  const [isLoading, setIsLoading] = useState(true);

  // Initial Sync from "Cloud"
  useEffect(() => {
    let isMounted = true;
    
    const syncData = async () => {
      try {
        const [cloudMovies, cloudSub] = await Promise.all([
          MovieService.getAll(),
          SubscriptionService.getStatus()
        ]);
        
        if (isMounted) {
          setMoviesList(cloudMovies);
          setSubscription(cloudSub);
          
          const savedWatchlist = localStorage.getItem('uganda_cinema_watchlist');
          if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
        }
      } catch (e) {
        console.error("Critical Sync Failure - Using fallback constants", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    syncData();
    return () => { isMounted = false; };
  }, []);

  // Sync Watchlist locally
  useEffect(() => {
    localStorage.setItem('uganda_cinema_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Handle Hash Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const [pathAndQuery, idPart] = hash.split('/');
      const [pagePart, queryPart] = pathAndQuery.split('?');
      const params = new URLSearchParams(queryPart);
      const q = params.get('q') || '';

      if (Object.values(Page).includes(pagePart as Page)) {
        setCurrentPage(pagePart as Page);
        setSelectedId(idPart || null);
        setSearchQuery(q);
      } else {
        setCurrentPage(Page.HOME);
        setSelectedId(null);
        setSearchQuery('');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page, id?: string, query?: string) => {
    let newHash = id ? `${page}/${id}` : page;
    if (query) newHash += `?q=${encodeURIComponent(query)}`;
    window.location.hash = newHash;
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addMovie = async (movie: Movie) => {
    try {
      await MovieService.save(movie);
      const updated = await MovieService.getAll();
      setMoviesList(updated);
    } catch (e) {
      alert("Failed to save to cloud. Running in local state.");
      setMoviesList(prev => [movie, ...prev]);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      await MovieService.delete(id);
      const updated = await MovieService.getAll();
      setMoviesList(updated);
    } catch (e) {
      setMoviesList(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSubscribe = async (type: SubscriptionType, txRef: string) => {
    await SubscriptionService.update(type, txRef);
    setSubscription(type);
    navigate(Page.HOME);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center">
        <div className="bg-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center animate-bounce mb-6">
          <span className="text-black font-black text-2xl">C</span>
        </div>
        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Library...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={navigate} movies={moviesList} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />;
      case Page.MOVIES:
        return <Movies onNavigate={navigate} initialSearch={searchQuery} movies={moviesList} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />;
      case Page.MOVIE_DETAILS:
        const movie = moviesList.find(m => m.id === selectedId);
        return movie ? (
          <MovieDetails movie={movie} movies={moviesList} onNavigate={navigate} onToggleWatchlist={toggleWatchlist} isInWatchlist={watchlist.includes(movie.id)} isPremiumUser={subscription !== 'free'} />
        ) : <Home onNavigate={navigate} movies={moviesList} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />;
      case Page.TALENT:
        return <Talent />;
      case Page.NEWS:
        return <News />;
      case Page.WATCHLIST:
        return <Watchlist watchlist={watchlist} onNavigate={navigate} movies={moviesList} onToggleWatchlist={toggleWatchlist} />;
      case Page.ADMIN:
        return <Admin movies={moviesList} onAddMovie={addMovie} onDeleteMovie={deleteMovie} />;
      case Page.PREMIUM:
        return <Premium currentSubscription={subscription} onSubscribe={handleSubscribe} />;
      default:
        return <Home onNavigate={navigate} movies={moviesList} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] selection:bg-yellow-400 selection:text-black">
      <Navbar currentPage={currentPage} onNavigate={navigate} watchlistCount={watchlist.length} isPremium={subscription !== 'free'} />
      <main className="min-h-[80vh]">{renderPage()}</main>
      <AICurator />
      <footer className="bg-[#1a1d23] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-yellow-400 w-6 h-6 rounded flex items-center justify-center">
              <span className="text-black font-black text-sm">C</span>
            </div>
            <span className="text-sm font-montserrat tracking-tighter text-white uppercase">
              CINE<span className="text-yellow-400">PRIME</span>
            </span>
          </div>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">© {new Date().getFullYear()} CINEPRIME • UGANDA CINEMA NETWORK</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
