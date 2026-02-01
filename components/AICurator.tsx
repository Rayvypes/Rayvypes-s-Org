
import React, { useState, useEffect, useRef } from 'react';
import { getMovieRecommendation, generateCinematicFact } from '../services/geminiService';
import { GroundingChunk } from '../types';

const AICurator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; sources?: GroundingChunk[] }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyFact, setDailyFact] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFact = async () => {
      const fact = await generateCinematicFact();
      setDailyFact(fact);
    };
    fetchFact();
    
    setMessages([{ role: 'ai', text: "Hello! I'm your AI Curator for Uganda Cinema. Ask me about latest movie news or for recommendations!" }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setLoading(true);

    const aiRes = await getMovieRecommendation(userText);
    // Explicitly casting sources to the local GroundingChunk type to ensure state compatibility
    const newAiMessage: { role: 'ai' | 'user'; text: string; sources: GroundingChunk[] } = {
      role: 'ai',
      text: aiRes.text,
      sources: aiRes.sources as GroundingChunk[]
    };
    setMessages(prev => [...prev, newAiMessage]);
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] bg-yellow-400 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group border-4 border-[#0f1115]"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">AI EXPERT</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[60] w-80 sm:w-96 h-[550px] bg-[#1a1d23] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-yellow-400 p-4 flex justify-between items-center">
            <div>
              <h3 className="text-black font-bold text-sm">Uganda Cinema AI</h3>
              <p className="text-black/60 text-[10px] font-bold">LIVE SEARCH ACTIVE</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {dailyFact && (
              <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-xl">
                <p className="text-yellow-400 text-[10px] font-black uppercase mb-1">History Flash</p>
                <p className="text-gray-300 text-xs italic">{dailyFact}</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-yellow-400 text-black font-medium' 
                    : 'bg-[#2a2e36] text-white border border-white/5'
                }`}>
                  {msg.text}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.sources.map((s, idx) => s.web?.uri && (
                      <a key={idx} href={s.web.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded hover:bg-white/10 border border-white/5 truncate max-w-[150px]">
                        🔗 {s.web.title || 'Source'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2e36] p-4 rounded-xl flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#0f1115] border-t border-white/5">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Who won Best Film at UFF?"
                className="flex-1 bg-[#2a2e36] text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-yellow-400 text-black p-2.5 rounded-xl hover:bg-yellow-300 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AICurator;