import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLingo } from '../services/resourceService';

const LingoScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [kgpLingoData, setKgpLingoData] = useState([]);

  useEffect(() => {
    const fetchLingo = async () => {
      try {
        const data = await getLingo();
        setKgpLingoData(data);
      } catch (err) {
        console.error("Error loading lingo data:", err);
      }
    };
    fetchLingo();
  }, []);

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return kgpLingoData;
    const q = searchQuery.toLowerCase();
    return kgpLingoData.filter(item => 
      item.word.toLowerCase().includes(q) || 
      item.meaning.toLowerCase().includes(q)
    );
  }, [searchQuery, kgpLingoData]);

  const getAccentColor = (word) => {
    const palette = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-blue-500'];
    return palette[word.length % palette.length];
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 pt-10 px-6 mb-4">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">KGP Lingo</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{filteredWords.length} Words</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 100+ KGP Lingo..." 
            className="w-full bg-gray-900/80 border border-gray-800 text-white text-sm rounded-2xl pl-12 pr-4 py-3 focus:border-indigo-500 outline-none transition"
          />
          <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
        {filteredWords.length === 0 ? (
          <div className="mt-20 text-center text-gray-500 text-sm font-bold">No Lingo Found</div>
        ) : (
          <div className="space-y-3">
            {filteredWords.map((item, idx) => (
              <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-2xl flex overflow-hidden hover:bg-gray-800/60 transition">
                <div className={`w-1.5 shrink-0 ${getAccentColor(item.word)}`}></div>
                <div className="p-4">
                  <h3 className="font-black text-gray-200 text-base mb-1">{item.word}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-snug">{item.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LingoScreen;