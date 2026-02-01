
export interface MovieRating {
  source: string;
  score: string;
  maxScore?: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string[];
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  cast: string[];
  duration: string;
  language: string;
  trailerUrl?: string;
  movieUrl?: string; // URL or Blob URL for the full movie file
  vjName?: string; // Name of the Video Joker (e.g., VJ Junior, VJ Jingo)
  isTranslated?: boolean; // Flag for translated movies
  externalRatings?: MovieRating[];
  isPremium?: boolean; // Premium access flag
}

export interface Actor {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  filmography: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: 'Industry' | 'Premiere' | 'Awards' | 'Interview';
}

export enum Page {
  HOME = 'home',
  MOVIES = 'movies',
  TALENT = 'talent',
  NEWS = 'news',
  MOVIE_DETAILS = 'movie_details',
  WATCHLIST = 'watchlist',
  ADMIN = 'admin',
  PREMIUM = 'premium'
}

export type SubscriptionType = 'free' | 'weekly' | 'monthly' | 'yearly';

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}
