import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocieties } from '../services/resourceService';

// ================= THEME COLORS HELPER =================
const getSocietyTheme = (name) => {
  const themes = [
    { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];
  return themes[name.length % themes.length];
};

const SocietiesScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societiesData, setSocietiesData] = useState([]);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties();
        setSocietiesData(data);
      } catch (err) {
        console.error("Error loading societies:", err);
      }
    };
    fetchSocieties();
  }, []);

  // Search Logic
  const filteredSocieties = useMemo(() => {
    if (!searchQuery.trim()) return societiesData;
    return societiesData.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, societiesData]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col pb-10 relative">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-10 px-6 mb-4">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-tight">Societies & Clubs</h1>
      </div>

      {/* SEARCH BAR */}
      <div className="px-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-indigo-500 text-lg">🔍</span>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Societies..." 
            className="w-full bg-gray-900/80 border border-gray-800 text-white text-sm rounded-2xl pl-12 pr-10 py-3.5 focus:border-indigo-500 focus:outline-none transition shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition">✖</button>
          )}
        </div>
      </div>

      {/* GRID LIST */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
        {filteredSocieties.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <span className="text-5xl opacity-20 mb-4">🎭</span>
            <p className="mt-4 font-bold text-sm">No societies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-10">
            {filteredSocieties.map((society, idx) => {
              const theme = getSocietyTheme(society.name);
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSociety(society)}
                  className={`bg-gray-900/60 border ${theme.border} rounded-3xl p-5 flex flex-col items-center justify-center text-center hover:bg-gray-800/80 transition cursor-pointer group shadow-sm`}
                >
                  <div className={`w-14 h-14 ${theme.bg} rounded-full mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition`}>
                    👥
                  </div>
                  <h3 className="font-bold text-gray-200 text-[13px] leading-tight line-clamp-2">{society.name}</h3>
                  <span className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-wider">Society Hub</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SOCIETY DETAILS MODAL (Replaces Flutter Bottom Sheet) */}
      {selectedSociety && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${getSocietyTheme(selectedSociety.name).bg}`}>
                👥
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-black leading-tight text-white">{selectedSociety.name}</h2>
              </div>
              <button onClick={() => setSelectedSociety(null)} className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-full transition shrink-0">
                ✖
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto scrollbar-hide">
              
              {/* Action Links */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSociety.website && (
                  <button onClick={() => window.open(selectedSociety.website, '_blank')} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition">
                    🌐 Website
                  </button>
                )}
                {selectedSociety.wikiUrl && (
                  <button onClick={() => window.open(selectedSociety.wikiUrl, '_blank')} className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition">
                    📖 KGP Wiki
                  </button>
                )}
                {selectedSociety.instagramUrl && (
                  <button onClick={() => window.open(selectedSociety.instagramUrl, '_blank')} className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-pink-500/20 transition">
                    📸 Instagram
                  </button>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${getSocietyTheme(selectedSociety.name).text}`}>Overview</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {selectedSociety.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SocietiesScreen;