
import { Movie, Actor, NewsItem } from './types';

export const MOVIES: Movie[] = [
  {
    id: '1',
    title: 'The Girl in the Yellow Jumper',
    year: 2020,
    director: 'Loukman Ali',
    genre: ['Thriller', 'Crime'],
    description: 'A masterpiece of Ugandan noir. A man returns from a kidnapping with a story that doesn\'t add up.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200',
    rating: 8.5,
    duration: '1h 30m',
    language: 'English',
    cast: ['Maurice Kirya', 'Michael Wawuyo Jr.'],
    trailerUrl: 'https://www.youtube.com/embed/5U7z070-5m0',
    isPremium: true, // Demonstration
    externalRatings: [
      { source: 'IMDb', score: '8.1', maxScore: '10' },
      { source: 'Rotten Tomatoes', score: '92%' },
      { source: 'CinePrime', score: '8.5', maxScore: '10' }
    ]
  },
  {
    id: 'tr-1',
    title: 'Deadpool & Wolverine (VJ Translated)',
    year: 2024,
    director: 'Shawn Levy',
    genre: ['Action', 'Comedy'],
    description: 'The merc with a mouth meets the clawed mutant in this explosive blockbuster, elevated by local Luganda humor.',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200',
    rating: 9.8,
    duration: '2h 7m',
    language: 'Luganda Translated',
    cast: ['Ryan Reynolds', 'Hugh Jackman'],
    isTranslated: true,
    vjName: 'Junior',
    isPremium: true, // Demonstration
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
    externalRatings: [
      { source: 'IMDb', score: '7.9', maxScore: '10' },
      { source: 'Audience Score', score: '95%' },
      { source: 'VJ Rating', score: '10', maxScore: '10' }
    ]
  },
  {
    id: 'tr-3',
    title: 'Kingdom of the Planet of the Apes',
    year: 2024,
    director: 'Wes Ball',
    genre: ['Sci-Fi', 'Action'],
    description: 'Years after Caesar\'s reign, a young ape goes on a journey that will lead him to question everything.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1514467950401-638ad33072ce?auto=format&fit=crop&q=80&w=1200',
    rating: 8.9,
    duration: '2h 25m',
    language: 'Luganda Translated',
    cast: ['Owen Teague'],
    isTranslated: true,
    vjName: 'Emmy',
    trailerUrl: 'https://www.youtube.com/embed/XtFI7SNtVpY',
    externalRatings: [
      { source: 'IMDb', score: '7.0', maxScore: '10' },
      { source: 'Metacritic', score: '66', maxScore: '100' }
    ]
  },
  {
    id: 'tr-5',
    title: 'Bad Boys: Ride or Die',
    year: 2024,
    director: 'Adil & Bilall',
    genre: ['Action', 'Comedy'],
    description: 'Miami\'s finest are on the run. High-octane action with localized VJ commentary.',
    posterUrl: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200',
    rating: 9.1,
    duration: '1h 55m',
    language: 'Luganda Translated',
    cast: ['Will Smith', 'Martin Lawrence'],
    isTranslated: true,
    vjName: 'Jingo',
    trailerUrl: 'https://www.youtube.com/embed/hRfH9G6oSE4',
    externalRatings: [
      { source: 'IMDb', score: '6.7', maxScore: '10' },
      { source: 'VJ Jingo', score: '9.5', maxScore: '10' }
    ]
  },
  {
    id: '2',
    title: 'Who Killed Captain Alex?',
    year: 2010,
    director: 'Nabwana I.G.G.',
    genre: ['Action', 'Comedy'],
    description: 'The movie that put Wakaliwood on the map. Action-packed and wildly creative.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1514467950401-638ad33072ce?auto=format&fit=crop&q=80&w=1200',
    rating: 9.0,
    duration: '1h 4m',
    language: 'Luganda / English',
    cast: ['Kakule Wilson'],
    trailerUrl: 'https://www.youtube.com/embed/KEoGrbKAyKE',
    externalRatings: [
      { source: 'Letterboxd', score: '4.2', maxScore: '5' },
      { source: 'Wakaliwood', score: '10', maxScore: '10' }
    ]
  },
  {
    id: 'tr-4',
    title: 'Gladiator II (Coming Soon)',
    year: 2024,
    director: 'Ridley Scott',
    genre: ['Epic', 'Action'],
    description: 'The saga continues in the arena. Highly anticipated VJ translation coming to local cinemas.',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1492138786289-d35ea832da41?auto=format&fit=crop&q=80&w=1200',
    rating: 9.2,
    duration: '2h 30m',
    language: 'Luganda Translated',
    cast: ['Paul Mescal', 'Denzel Washington'],
    isTranslated: true,
    vjName: 'Junior',
    isPremium: true, // Demonstration
    trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
    externalRatings: [
      { source: 'IMDb', score: 'TBD' },
      { source: 'Anticipation', score: '99%' }
    ]
  }
];

export const ACTORS: Actor[] = [
  {
    id: 'a1',
    name: 'Maurice Kirya',
    role: 'Lead Actor',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Renowned musician and actor, known for his subtle and powerful screen presence.',
    filmography: ['The Girl in the Yellow Jumper', 'Queen of Katwe']
  },
  {
    id: 'a5',
    name: 'VJ Junior',
    role: 'Video Joker / Translator',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'The king of translated movies in Uganda, known for his fast-paced commentary and cultural adaptations.',
    filmography: ['Blockbuster Library', 'Hollywood Hits']
  }
];

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Uganda Film Festival 2024 Highlights',
    date: 'Jan 10, 2025',
    excerpt: 'A review of the biggest winners and surprising snubs of the year.',
    content: 'Full details on the ceremony that took Kampala by storm.',
    imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
    category: 'Awards'
  }
];
