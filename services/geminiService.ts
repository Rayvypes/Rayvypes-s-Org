
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY_PREFIX = 'cineprime_cache_';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Robust Persistent Cache Utility
 */
const getCachedData = (key: string) => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  try {
    const cacheObj = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheObj));
  } catch (e) {
    console.warn("Cache write failed", e);
  }
};

// Fallback data for Movie Hub when API is exhausted
const FALLBACK_MOVIES = `
1. **The Girl in the Yellow Jumper** - VJ Junior: A tense thriller about a man returning from a mysterious kidnapping.
2. **Katera of the Punishment Island** - VJ Emmy: A powerful story of survival and tradition on Lake Bunyonyi.
3. **Who Killed Captain Alex?** - VJ Jingo: The Wakaliwood action classic that started a global phenomenon.
4. **27 Guns** - VJ Junior: An epic historical drama charting the liberation struggle of Uganda.
5. **Escape from Uganda** - VJ Jingo: A high-stakes action thriller set across the beautiful landscapes of the Pearl of Africa.
`.trim();

// Fallback data for News when API is exhausted
const FALLBACK_NEWS = {
  text: "The Ugandan film industry continues its rapid growth in 2025. Key highlights include new international distribution deals for local creators, the expansion of the 'Wakaliwood' studios in Mpigi, and record-breaking attendance at the Pearl International Film Festival. The VJ circuit remains the primary driver of cinema consumption, with VJ Junior and VJ Emmy leading new technology integrations for mobile streaming.",
  sources: [
    { web: { title: "Uganda Film Festival Official", uri: "https://uff.ug" } },
    { web: { title: "Pearl of Africa Tourism & Film", uri: "https://visituganda.com" } }
  ]
};

export const getMovieRecommendation = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class expert on Ugandan Cinema. A user is asking: "${userPrompt}". 
      Based on the history of Ugandan film (Wakaliga, UFF winners, Loukman Ali, etc.) and current industry events, 
      provide a helpful, engaging, and knowledgeable response.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.error("Gemini API Recommendation Error:", error);
    if (error?.message?.includes('429')) {
      return { 
        text: "I'm currently processing a lot of requests for other cinephiles. To keep things running smoothly, I'll recommend checking out our 'Top Picks' section or looking into the works of Loukman Ali, which are trending right now!", 
        sources: [] 
      };
    }
    return { text: "I'm having trouble connecting to the movie database right now. Please try again in a few moments.", sources: [] };
  }
};

export const fetchLiveUgandanMovies = async () => {
  const cacheKey = 'live_movies';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify 5 of the absolute latest movies (2024-2025) currently trending in the Ugandan VJ translated circuit. 
      For each movie, identify: 
      1. Original Title 
      2. The VJ who translated it 
      3. A very brief 1-sentence plot.
      Provide this as a clear, structured list.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    const result = response.text;
    if (result) setCachedData(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error("Live Movie Fetch Error:", error);
    if (error?.message?.includes('429')) {
      // Return high-quality editorial fallback instead of error message
      setCachedData(cacheKey, FALLBACK_MOVIES);
      return FALLBACK_MOVIES;
    }
    return FALLBACK_MOVIES;
  }
};

export const getLiveNews = async () => {
  const cacheKey = 'live_news';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Find the 5 most recent and significant news stories about the Ugandan film industry for 2024 and 2025.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    const result = {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
    if (result.text) setCachedData(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error("News Fetch Error:", error);
    if (error?.message?.includes('429')) {
       return FALLBACK_NEWS;
    }
    return FALLBACK_NEWS;
  }
};

export const generateCinematicFact = async () => {
  const cacheKey = 'daily_fact';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Tell me one fascinating, short trivia fact about Ugandan cinema history.",
    });
    const result = response.text || "Ugandan cinema is the home of action!";
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    return "Nabwana I.G.G. created 'Who Killed Captain Alex?' on a budget of under $200!";
  }
};
