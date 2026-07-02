import React from 'react'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../services/resourceService';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const quickTools = [
    { name: 'Kronos', icon: '📈', url: 'https://kronos.streamlit.app/' },
    { name: 'Chill Zone', icon: '🏢', url: 'https://chill.metakgp.org/' },
    { name: 'CV Repo', icon: '📄', url: 'https://swgiitkgp.org/cvrepo' }
  ];
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const data = await getEvents();
        // Auto-scroll ke liye thode zyada events nikalte hain
        setRecentEvents(data.slice(0, 6)); 
      } catch (err) {
        console.error("Error fetching events for home:", err);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchRecentEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-32 ">

      {/* 1. TOP HEADER - Clickable Profile Section */}
      <div className="flex justify-between items-center px-6 py-6 pt-10">
        <div
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition group"
          onClick={() => navigate('/profile')}
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-105 transition">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <p className="text-gray-400 text-xs">Welcome back,</p>
            <h1 className="text-lg font-bold tracking-wide">{user?.name || 'KGPian'}</h1>
          </div>
        </div>

        {/* Settings / Notifications Icon */}
        <button className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m10 4a2 2 0 100-4m0 4a2 2 0 110-4M6 20v-2m0-4V4m12 16v-2m0-4V4m-6 16v-2" />
          </svg>
        </button>
      </div>

      <div className="px-6 space-y-8">

        {/* 2. UPCOMING EVENTS - Seamless Infinite Scroll */}
        <section className="mb-10 overflow-hidden">
          <style>
            {`
              @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(calc(-50% - 0.5rem)); } 
              }
              .marquee-track {
                display: flex;
                width: max-content;
                animation: marquee 40s linear infinite;
                gap: 1rem; 
              }
              .marquee-track:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          {/* --- NEW PREMIUM HEADING SECTION --- */}
          <div className="flex justify-between items-end mb-6 px-6">
            <div>
              <h2 className="text-[10px] font-black text-indigo-500 tracking-[0.2em] uppercase mb-1">Stay Updated</h2>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">Upcoming Events</h1>
            </div>
            
            <button 
              onClick={() => navigate('/events')}
              className="group flex items-center gap-2.5 bg-indigo-500/10 hover:bg-indigo-600 transition-all duration-300 px-4 py-2 rounded-full border border-indigo-500/20 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
            >
              <span className="text-[10px] font-black text-indigo-400 group-hover:text-white transition-colors tracking-widest uppercase">
                View All
              </span>
              <div className="w-5 h-5 bg-indigo-500/20 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                <svg 
                  className="w-2.5 h-2.5 text-indigo-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
          
          <div className="relative w-full overflow-hidden">
            {/* Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none"></div>

            {isLoadingEvents ? (
              <div className="flex gap-4 px-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="min-w-[300px] h-[170px] bg-gray-900/60 rounded-[2rem] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="marquee-track">
                {[...recentEvents, ...recentEvents].map((ev, idx) => {
                  const posterUrl = ev.links?.find(l => l.isImage)?.url;
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => navigate('/events')} 
                      className="relative min-w-[300px] h-[170px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all duration-500"
                    >
                      {/* Background & Overlays same as before */}
                      {posterUrl ? (
                        <img src={posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 to-gray-900"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="mb-auto">
                          <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[9px] font-black tracking-widest rounded-lg uppercase">
                            Upcoming
                          </span>
                        </div>
                        <h3 className="font-black text-white text-base line-clamp-2 leading-tight drop-shadow-lg mb-2">{ev.title || 'KGP Event'}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-indigo-300 font-bold flex items-center gap-2"><span className="text-sm">📅</span> {ev.date || 'TBA'}</p>
                          <div className="w-8 h-8 bg-indigo-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-500 transition-all"><span className="text-white text-xs">▶</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 3. ACADEMIC RESOURCES */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Core Resources</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-5 flex justify-between items-center hover:bg-blue-600/30 transition cursor-pointer"
              onClick={() => navigate('/study')}
            >
              <div>
                <h3 className="font-bold text-blue-100">Study Materials</h3>
                <p className="text-xs text-blue-400/80">Notes & Lecture Slides</p>

              </div>
              <span className="text-2xl opacity-70">📖</span>
            </div>
            <div className="bg-gradient-to-r from-orange-600/20 to-pink-600/20 border border-orange-500/20 rounded-3xl p-5 flex justify-between items-center hover:bg-orange-600/30 transition cursor-pointer" onClick={() => navigate('/pyq')}>
              <div>
                <h3 className="font-bold text-orange-100">PYQ Repository</h3>
                <p className="text-xs text-orange-400/80">Previous Year Papers</p>
              </div>
              <span className="text-2xl opacity-70">📝</span>
            </div>
          </div>
        </section>

        {/* 4. UTILITIES GRID */}

        <section>
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Quick Tools</h2>
          <div className="grid grid-cols-3 gap-3">

            {quickTools.map((tool, i) => (
              <div
                key={i}
                onClick={() => window.open(tool.url, '_blank')}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 flex flex-col items-center hover:bg-gray-800 hover:border-blue-500/30 transition cursor-pointer group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-full mb-2 flex items-center justify-center text-lg group-hover:scale-110 transition">
                  {tool.icon}
                </div>
                <span className="text-[10px] font-bold text-gray-300 group-hover:text-blue-400">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CAMPUS INFO (INTERNAL APP SECTIONS) */}
        <section className="px-6 pt-2 pb-6">
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Campus Info</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'FAQ', icon: '❓', id: 'faq' },
              { name: 'Societies', icon: '🎭', id: 'societies' },
              { name: 'Depts', icon: '🏛️', id: 'depts' },
              { name: 'Lingo', icon: '🗣️', id: 'lingo' }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/${item.id}`)}
                className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-3 flex flex-col items-center hover:bg-indigo-600/30 transition cursor-pointer group"
              >
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full mb-2 flex items-center justify-center text-lg group-hover:scale-110 transition shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold text-indigo-200 group-hover:text-indigo-400">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 5. FLOATING NAV BAR - Fixed at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-3xl px-8 py-4 flex justify-between items-center shadow-2xl z-50">
        <div className="text-blue-500 flex flex-col items-center cursor-pointer" onClick={() => navigate('/home')}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          <span className="text-[10px] font-bold mt-1">Home</span>
        </div>
        <div className="text-gray-500 flex flex-col items-center opacity-60"><span className="text-xl">🍔</span><span className="text-[10px] mt-1">Food</span></div>
        <div className="text-gray-500 flex flex-col items-center opacity-60"><span className="text-xl">🧭</span><span className="text-[10px] mt-1">Explore</span></div>
        <div className="text-gray-500 flex flex-col items-center opacity-60"><span className="text-xl">🚕</span><span className="text-[10px] mt-1">Taxi</span></div>
      </div>
    </div>
  );
};

export default Home;