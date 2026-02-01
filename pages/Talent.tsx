
import React, { useState } from 'react';
import { ACTORS } from '../constants';
import { Actor } from '../types';

const Talent: React.FC = () => {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Actor Detail Modal */}
      {selectedActor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-[#1a1d23] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedActor(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-all p-3 bg-white/5 rounded-full z-[110]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-2/5 aspect-[3/4] md:aspect-auto">
                <img src={selectedActor.imageUrl} className="w-full h-full object-cover" alt={selectedActor.name} />
              </div>
              <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto">
                <div className="mb-8">
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                    {selectedActor.role}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-montserrat font-black text-white uppercase tracking-tighter italic">
                    {selectedActor.name}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Biography</h4>
                    <p className="text-gray-300 leading-relaxed italic">"{selectedActor.bio}"</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Official Filmography</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedActor.filmography.map((film, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <span className="text-white text-sm font-bold">{film}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Industry Directory</span>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
        </div>
        <h1 className="text-6xl font-montserrat font-black text-white mb-3 uppercase tracking-tighter italic">
          Iconic <span className="text-yellow-400">Profiles</span>
        </h1>
        <div className="h-1.5 w-24 bg-yellow-400 mb-8 rounded-full"></div>
        <p className="text-gray-400 max-w-2xl text-lg">
          From the pioneers of the VJ circuit to the stars of the international stage, meet the creators defining Ugandan cinema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {ACTORS.map(actor => (
          <div 
            key={actor.id} 
            onClick={() => setSelectedActor(actor)}
            className="flex flex-col sm:flex-row gap-8 bg-[#1a1d23] rounded-[2.5rem] p-4 border border-white/5 hover:border-yellow-400/20 transition-all group cursor-pointer"
          >
            <div className="sm:w-1/3 aspect-square sm:aspect-auto overflow-hidden rounded-[2rem] border border-white/10 relative">
               <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                 <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">View Profile</span>
               </div>
            </div>
            <div className="sm:w-2/3 flex flex-col justify-center pr-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em]">{actor.role}</span>
                <svg className="w-5 h-5 text-white/10 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
              <h2 className="text-3xl font-montserrat font-black text-white mb-4 uppercase tracking-tight">{actor.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                {actor.bio}
              </p>
              <div className="flex gap-2">
                {actor.filmography.slice(0, 2).map(film => (
                  <span key={film} className="text-[9px] bg-white/5 text-gray-400 px-3 py-1.5 rounded-lg border border-white/5 font-bold uppercase">
                    {film}
                  </span>
                ))}
                {actor.filmography.length > 2 && <span className="text-[9px] text-gray-600 font-bold self-center">+{actor.filmography.length - 2} More</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Talent;
