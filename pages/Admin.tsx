
import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { MovieService, supabase } from '../services/databaseService';

interface AdminProps {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ movies, onAddMovie, onDeleteMovie }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [cloudStatus, setCloudStatus] = useState<{ connected: boolean; message: string }>({ 
    connected: false, 
    message: 'Checking Connection...' 
  });

  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    year: new Date().getFullYear(),
    director: '',
    genre: [],
    description: '',
    posterUrl: '',
    backdropUrl: '',
    rating: 8.0,
    cast: [],
    duration: '',
    language: 'English',
    isTranslated: false,
    vjName: '',
    trailerUrl: '',
    movieUrl: '',
    isPremium: false
  });

  const [genreInput, setGenreInput] = useState('');
  const [castInput, setCastInput] = useState('');
  
  const posterFileRef = useRef<File | null>(null);
  const backdropFileRef = useRef<File | null>(null);
  const movieFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('cp_auth') === 'true') setIsAuthenticated(true);
    checkCloudConnection();
  }, []);

  const checkCloudConnection = async () => {
    if (!supabase) {
      setCloudStatus({ connected: false, message: 'Local Mode (Keys Missing)' });
      return;
    }
    try {
      // Light ping to check if we can reach the DB
      const { error } = await supabase.from('movies').select('count', { count: 'exact', head: true });
      
      if (error) {
        // If table doesn't exist, it's a specific error
        if (error.code === '42P01') {
            setCloudStatus({ connected: false, message: 'Error: Tables Missing (Run SQL)' });
        } else {
            setCloudStatus({ connected: false, message: 'Connection Error' });
        }
      } else {
        setCloudStatus({ connected: true, message: 'System Online (Cloud)' });
      }
    } catch (err) {
      setCloudStatus({ connected: false, message: 'Network Failure' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'kevjoh') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cp_auth', 'true');
    } else {
      setError('Incorrect Staff Key');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus('Starting cloud sync...');

    try {
      let finalPosterUrl = formData.posterUrl || '';
      let finalBackdropUrl = formData.backdropUrl || '';
      let finalMovieUrl = formData.movieUrl || '';

      if (posterFileRef.current) {
        setUploadStatus('Uploading Poster...');
        finalPosterUrl = await MovieService.uploadMedia(posterFileRef.current, 'posters');
      }

      if (backdropFileRef.current) {
        setUploadStatus('Uploading Backdrop...');
        finalBackdropUrl = await MovieService.uploadMedia(backdropFileRef.current, 'backdrops');
      }

      if (movieFileRef.current) {
        setUploadStatus('Uploading Full Production (This may take a while)...');
        finalMovieUrl = await MovieService.uploadMedia(movieFileRef.current, 'videos');
      }

      const newMovie: Movie = {
        ...formData as Movie,
        id: `m-${Date.now()}`,
        posterUrl: finalPosterUrl,
        backdropUrl: finalBackdropUrl,
        movieUrl: finalMovieUrl,
        genre: genreInput.split(',').map(g => g.trim()),
        cast: castInput.split(',').map(c => c.trim()),
      };
      
      await onAddMovie(newMovie);
      alert('Production Live on Cloud!');
      
      // Reset
      setFormData({ title: '', year: 2024, rating: 8.0, language: 'English' });
      setGenreInput('');
      setCastInput('');
      posterFileRef.current = null;
      backdropFileRef.current = null;
      movieFileRef.current = null;
    } catch (err) {
      console.error(err);
      alert('Upload failed. Check console for details.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
        <div className="w-full max-w-md p-10 bg-[#1a1d23] rounded-[3rem] border border-white/5 text-center">
            {/* Connection Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border transition-colors ${cloudStatus.connected ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                <div className={`w-2 h-2 rounded-full ${cloudStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {cloudStatus.message}
            </div>

          <h1 className="text-2xl font-black text-white uppercase mb-8">Admin Terminal</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="ENTER KEY" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-center tracking-widest outline-none focus:ring-2 focus:ring-yellow-400" />
            <button className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-yellow-400/20">Login</button>
            {error && <p className="text-red-500 text-xs font-bold uppercase">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-[#1a1d23] p-10 rounded-[3rem] border border-white/5">
          <div className="flex justify-between items-start mb-10">
            <h2 className="text-3xl font-black text-white uppercase italic">New <span className="text-yellow-400">Production</span></h2>
            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${cloudStatus.connected ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-gray-500/30 text-gray-500 bg-gray-500/5'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus.connected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                {cloudStatus.connected ? 'Cloud Storage' : 'Local Storage'}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Title" className="bg-black/20 border border-white/5 rounded-xl p-4 text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input required type="number" placeholder="Year" className="bg-black/20 border border-white/5 rounded-xl p-4 text-white" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
            </div>
            <textarea placeholder="Description" className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-white h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Posters & Video (PC Files)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="file" accept="image/*" className="hidden" id="p" onChange={e => posterFileRef.current = e.target.files?.[0] || null} />
                <label htmlFor="p" className="bg-white/5 border border-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 text-[10px] font-bold text-gray-400 uppercase">Poster</label>
                
                <input type="file" accept="image/*" className="hidden" id="b" onChange={e => backdropFileRef.current = e.target.files?.[0] || null} />
                <label htmlFor="b" className="bg-white/5 border border-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 text-[10px] font-bold text-gray-400 uppercase">Backdrop</label>

                <input type="file" accept="video/*" className="hidden" id="v" onChange={e => movieFileRef.current = e.target.files?.[0] || null} />
                <label htmlFor="v" className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 text-center cursor-pointer hover:bg-yellow-400/20 text-[10px] font-bold text-yellow-400 uppercase">Full Movie</label>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <label className="text-white text-xs font-bold flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-yellow-400" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} />
                PREMIUM CONTENT
              </label>
              <label className="text-white text-xs font-bold flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-yellow-400" checked={formData.isTranslated} onChange={e => setFormData({...formData, isTranslated: e.target.checked})} />
                VJ TRANSLATED
              </label>
            </div>
            
            <div className="space-y-2">
                <input placeholder="Director" className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-white" value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Genres (comma separated)" className="bg-black/20 border border-white/5 rounded-xl p-4 text-white" value={genreInput} onChange={e => setGenreInput(e.target.value)} />
                    <input placeholder="Cast (comma separated)" className="bg-black/20 border border-white/5 rounded-xl p-4 text-white" value={castInput} onChange={e => setCastInput(e.target.value)} />
                </div>
            </div>

            <button disabled={isUploading} className="w-full bg-yellow-400 text-black py-6 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl shadow-yellow-400/20">
              {isUploading ? uploadStatus : 'PUBLISH TO CLOUD'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-500 font-black uppercase tracking-widest text-xs">Live Library</h3>
          <div className="space-y-3">
            {movies.map(m => (
              <div key={m.id} className="bg-[#1a1d23] p-4 rounded-2xl flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-4">
                  <img src={m.posterUrl} className="w-12 h-16 rounded-lg object-cover bg-white/5" />
                  <div>
                    <h4 className="text-white font-bold">{m.title}</h4>
                    <p className="text-gray-500 text-[10px] uppercase font-black">{m.isPremium ? 'Premium' : 'Free'} • {m.year}</p>
                  </div>
                </div>
                <button onClick={() => onDeleteMovie(m.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
