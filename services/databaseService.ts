
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Movie, SubscriptionType } from '../types';
import { MOVIES } from '../constants';

// Environment variables provided by the platform
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Safely initialize the client only if credentials exist
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const BUCKET_NAME = 'cinema';

/**
 * MOVIE SERVICE
 * Cloud data fetching with automatic local fallback
 */
export const MovieService = {
  async getAll(): Promise<Movie[]> {
    if (!supabase) {
      console.warn("Supabase not configured. Running in Local Demo Mode.");
      return MOVIES;
    }

    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If the cloud DB is empty, use the starter pack
      if (!data || data.length === 0) return MOVIES;

      return data.map((m: any) => ({
        id: m.id,
        title: m.title,
        year: m.year,
        director: m.director,
        genre: m.genre,
        description: m.description,
        posterUrl: m.poster_url || m.posterUrl,
        backdropUrl: m.backdrop_url || m.backdropUrl,
        rating: m.rating,
        cast: m.cast_members || m.cast || [],
        duration: m.duration,
        language: m.language,
        trailerUrl: m.trailer_url || m.trailerUrl,
        movieUrl: m.movie_url || m.movieUrl,
        vjName: m.vj_name || m.vjName,
        isTranslated: m.is_translated || m.isTranslated,
        isPremium: m.is_premium || m.isPremium
      }));
    } catch (err) {
      console.error("Supabase Fetch Failed:", err);
      return MOVIES;
    }
  },

  async uploadMedia(file: File, path: string): Promise<string> {
    if (!supabase) throw new Error("Cloud Storage not configured.");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async save(movie: Movie): Promise<void> {
    if (!supabase) {
      // In Demo Mode, we just alert the user
      console.log("Saving movie to local state (Demo Mode):", movie);
      return;
    }

    const payload = {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      director: movie.director,
      genre: movie.genre,
      description: movie.description,
      poster_url: movie.posterUrl,
      backdrop_url: movie.backdropUrl,
      rating: movie.rating,
      cast_members: movie.cast,
      duration: movie.duration,
      language: movie.language,
      trailer_url: movie.trailerUrl,
      movie_url: movie.movieUrl,
      vj_name: movie.vjName,
      is_translated: movie.isTranslated,
      is_premium: movie.isPremium
    };

    const { error } = await supabase
      .from('movies')
      .upsert(payload);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

/**
 * SUBSCRIPTION SERVICE
 */
export const SubscriptionService = {
  async getStatus(): Promise<SubscriptionType> {
    const sub = localStorage.getItem('cp_sub');
    return (sub as SubscriptionType) || 'free';
  },

  async update(type: SubscriptionType, txRef: string): Promise<void> {
    localStorage.setItem('cp_sub', type);
  }
};
