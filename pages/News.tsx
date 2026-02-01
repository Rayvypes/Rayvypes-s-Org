
import React, { useEffect, useState } from 'react';
import { getLiveNews } from '../services/geminiService';
import { GroundingChunk } from '../types';

const News: React.FC = () => {
  const [newsContent, setNewsContent] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(true);

  // Static fallback news in case of API limits (as defined in Service, but handled locally here for UI safety)
  const editorialNews = [
    { title: "The Rise of Wakaliwood 2.0", excerpt: "How Nabwana I.G.G is transforming Mpigi into a global tech hub for action cinema." },
    { title: "VJ Junior Announces National Tour", excerpt: "The legendary translator prepares for a 10-city premiere of his latest translated blockbusters." }
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      setLoading(true);
      const data = await getLiveNews();
      if (isMounted && data) {
        setNewsContent(data.text);
        setSources(data.sources);
      }
      if (isMounted) setLoading(false);
    };
    fetchNews();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-lg shadow-yellow-400/10">Industry Report</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse delay-75"></div>
          </div>
        </div>
        <h1 className="text-6xl font-montserrat font-black text-white mb-3 uppercase tracking-tighter italic">
          Cine<span className="text-yellow-400">Intelligence</span>
        </h1>
        <div className="h-1.5 w-24 bg-yellow-400 rounded-full"></div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-[#1a1d23] rounded-[2.5rem] p-10 border border-white/5 animate-pulse">
                <div className="h-8 bg-white/5 rounded-xl w-3/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-[#1a1d23] rounded-[2rem] animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <article className="bg-[#1a1d23] rounded-[3rem] p-10 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13.857L5 15.5l.5-2.5-2-1.857 2.625-.375L7 8.5l.875 2.268 2.625.375-2 1.857.5 2.5zM17 13.857L15 15.5l.5-2.5-2-1.857 2.625-.375L17 8.5l.875 2.268 2.625.375-2 1.857.5 2.5z" /></svg>
              </div>
              <div className="relative z-10 prose prose-invert prose-yellow max-w-none">
                <div className="text-gray-300 whitespace-pre-wrap leading-loose text-lg font-medium font-inter">
                  {newsContent || "Establishing secure link to Pearl Intelligence network..."}
                </div>
              </div>
            </article>

            {/* Local Editorials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {editorialNews.map((news, idx) => (
                 <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors group">
                    <h3 className="text-white font-black text-xl mb-3 uppercase tracking-tight group-hover:text-yellow-400 transition-colors">{news.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{news.excerpt}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Sources Card */}
            <div className="bg-[#1a1d23] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
              <h2 className="text-white font-black mb-8 uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                Verified Data Sources
              </h2>
              <div className="space-y-4">
                {sources.length > 0 ? (
                  sources.map((s, i) => s.web && (
                    <a 
                      key={i} 
                      href={s.web.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="block p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-400/30 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-white font-bold text-sm leading-tight group-hover:text-yellow-400 transition-colors">
                          {s.web.title}
                        </p>
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </div>
                      <p className="text-gray-600 text-[9px] mt-2 font-black uppercase tracking-widest truncate">{new URL(s.web.uri || '').hostname}</p>
                    </a>
                  ))
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Scanning Web Archives...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-yellow-400 p-10 rounded-[2.5rem] shadow-2xl shadow-yellow-400/10">
              <h3 className="text-black font-black text-2xl uppercase tracking-tighter italic mb-3 leading-none">Stay <br />Informed</h3>
              <p className="text-black/70 text-sm font-medium mb-8 leading-relaxed">Join 50k+ readers getting weekly industry insiders directly.</p>
              <div className="relative">
                <input type="email" placeholder="Email address" className="w-full bg-black/10 border border-black/10 rounded-xl px-4 py-4 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20" />
                <button className="mt-4 w-full bg-black text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
