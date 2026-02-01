
import React from 'react';
import { NEWS, ACTORS } from '../constants';
import MovieCard from '../components/MovieCard';
import { Page, Movie } from '../types';

interface HomeProps {
  onNavigate: (page: Page, id?: string, query?: string) => void;
  movies: Movie[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, movies, watchlist, onToggleWatchlist }) => {
  const featuredMovie = movies.length > 0 ? movies[0] : null;

  if (!featuredMovie) return <div className="pt-40 text-center">Loading cinema library...</div>;

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={featuredMovie.backdropUrl} 
            alt="Hero Background"
            className="w-full h-full object-cover object-center scale-105 blur-[1px] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1115] via-[#0f1115]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                Featured on CinePrime
              </span>
              <span className="text-gray-400 text-sm font-bold tracking-wide">{featuredMovie.genre.join(' • ')}</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-montserrat font-black text-white mb-8 leading-[1] tracking-tighter uppercase">
              CINE<span className="text-yellow-400">PRIME</span> <br />
              UGANDA
            </h1>
            
            <p className="text-gray-300 text-xl mb-12 line-clamp-3 max-w-xl leading-relaxed">
              Experience the best of Ugandan storytelling. From translated hits by VJ Junior to original cinema masterpieces, discover it all in one place.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button 
                onClick={() => onNavigate(Page.MOVIE_DETAILS, featuredMovie.id)}
                className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all active:scale-95 shadow-xl shadow-yellow-400/10"
              >
                WATCH NOW
              </button>
              <button 
                onClick={() => onNavigate(Page.MOVIES)}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
              >
                BROWSE HUB
              </button>
              
              <div className="flex items-center gap-4 ml-4 hidden sm:flex">
                 <div className="flex -space-x-4">
                    {ACTORS.slice(0, 3).map(a => (
                      <img key={a.id} src={a.imageUrl} className="w-12 h-12 rounded-full border-4 border-[#0f1115] object-cover" alt={a.name} />
                    ))}
                 </div>
                 <div className="text-xs">
                    <p className="text-white font-bold">10k+ Members</p>
                    <p className="text-gray-500">Watching today</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-montserrat font-black text-white uppercase tracking-tighter italic">CinePrime <span className="text-yellow-400">Top Picks</span></h2>
            <div className="h-1.5 w-24 bg-yellow-400 rounded-full"></div>
          </div>
          <button 
            onClick={() => onNavigate(Page.MOVIES)}
            className="group flex items-center gap-3 text-gray-500 hover:text-yellow-400 font-bold uppercase text-xs tracking-widest transition-all"
          >
            Explore All 
            <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-400/50 transition-colors">→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {movies.slice(0, 6).map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={(id) => onNavigate(Page.MOVIE_DETAILS, id)} 
              onToggleWatchlist={onToggleWatchlist}
              isInWatchlist={watchlist.includes(movie.id)}
            />
          ))}
        </div>
      </section>

      {/* Actors Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-5xl font-montserrat font-black text-white mb-6 uppercase tracking-tighter">Spotlight Talent</h2>
            <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">The faces behind the stories. Meet the stars of the Ugandan film industry.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {ACTORS.map(actor => (
              <div key={actor.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-2xl">
                  <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <p className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em] mb-2">{actor.role}</p>
                    <h3 className="text-2xl font-montserrat font-black text-white uppercase">{actor.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-montserrat font-black text-white uppercase tracking-tighter italic">CinePrime <span className="text-yellow-400">Buzz</span></h2>
            <button onClick={() => onNavigate(Page.NEWS)} className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest">Read More</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {NEWS.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row gap-8 bg-[#1a1d23] rounded-[2.5rem] overflow-hidden border border-white/5 group p-2">
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden rounded-[2rem]">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-center">
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-4 inline-block bg-yellow-400/10 px-3 py-1 rounded-full w-fit">
                    {item.category} • {item.date}
                </span>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-yellow-400 transition-colors uppercase font-montserrat">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {item.excerpt}
                </p>
                <button className="text-white text-xs font-bold underline decoration-yellow-400 underline-offset-8 uppercase tracking-widest decoration-2">READ ARTICLE</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
