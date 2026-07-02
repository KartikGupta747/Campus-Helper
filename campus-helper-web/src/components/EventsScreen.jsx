import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../services/resourceService';

const EventsScreen = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // --- 1. Fetch Events from Backend ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Safety check to ensure data is an array
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- 2. EVENT DETAIL VIEW ---
  if (selectedEvent) {
    const links = selectedEvent.links || [];
    const posterUrl = links.find(l => l.isImage)?.url;
    const actionLinks = links.filter(l => !l.isImage);

    return (
      <div className="h-screen bg-gray-950 text-white font-sans flex flex-col">
        <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
          {/* Dynamic Header / Poster */}
          <div className="relative">
            {posterUrl ? (
              <div className="w-full h-[400px] relative">
                <img 
                  src={posterUrl} 
                  alt="Event Poster" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center">
                <span className="text-6xl opacity-20">🎉</span>
              </div>
            )}
            
            {/* Back Button */}
            <button 
              onClick={() => setSelectedEvent(null)} 
              className={`absolute top-10 left-6 p-2 rounded-full transition z-10 ${
                posterUrl ? 'bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10' : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          {/* Content Body */}
          <div className="px-6 -mt-10 relative z-10">
            <h1 className="text-2xl font-black leading-tight tracking-tight mb-2">
              {selectedEvent.title || 'Untitled Event'}
            </h1>
            
            <div className="flex items-center gap-2 mb-8">
              <span className="text-indigo-400 text-sm">📅</span>
              <span className="text-indigo-400 font-bold text-sm">{selectedEvent.date || 'TBA'}</span>
            </div>

            {selectedEvent.description && (
              <div className="mb-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">About This Event</h3>
                <p className="text-base text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {actionLinks.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Registration & Links</h3>
                <div className="space-y-3">
                  {actionLinks.map((link, idx) => (
                    <button 
                      key={idx}
                      onClick={() => window.open(link.url, '_blank')}
                      className="w-full bg-gray-900/50 border border-indigo-500/20 hover:bg-gray-800/80 transition p-5 rounded-2xl flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                          <span className="text-indigo-400">🔗</span>
                        </div>
                        <span className="font-bold text-gray-200">{link.label || 'Open Link'}</span>
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-400 transition">▶</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. MAIN LIST VIEW ---
  return (
    <div className="h-screen bg-gray-950 text-white font-sans flex flex-col">
      
      {/* 🔴 HEADER ADDED SAFELY HERE 🔴 */}
      <div className="shrink-0 flex items-center gap-4 pt-10 px-6 pb-4 bg-gray-950 border-b border-gray-900">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition active:scale-95">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">Campus Calendar</h1>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-0.5">Live Events & Workshops</p>
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold text-sm tracking-widest">LOADING EVENTS...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-6xl opacity-10 mb-4">🗓️</span>
            <p className="text-gray-400 font-black text-lg">No Events Scheduled</p>
            <p className="text-gray-600 text-sm mt-1">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
            {events.map((event, idx) => {
              const posterUrl = event.links?.find(l => l.isImage)?.url;
              
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedEvent(event)}
                  className="group bg-gray-900/40 border border-gray-800/60 rounded-3xl p-3 flex flex-row items-center gap-5 cursor-pointer hover:bg-gray-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-sm"
                >
                  {/* Compact Thumbnail (Fixed Size) */}
                  <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-950 shadow-inner">
                    {posterUrl ? (
                      <img 
                        src={posterUrl} 
                        alt="Event" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-gray-900 flex items-center justify-center">
                        <span className="text-3xl opacity-20">🎉</span>
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 py-1 pr-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
                        {event.date || 'TBA'}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-base text-gray-100 leading-snug line-clamp-2 mb-1.5 group-hover:text-indigo-300 transition-colors">
                      {event.title || 'Untitled Event'}
                    </h3>
                    
                    {event.description ? (
                      <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">
                        {event.description}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-600 font-medium italic">
                        No description provided.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsScreen;