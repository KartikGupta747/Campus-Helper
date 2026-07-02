import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFAQs } from '../services/resourceService';

// ================= LINKIFY COMPONENT =================
// Simple function to convert URLs and emails to clickable links
const renderTextWithLinks = (text) => {
  const urlRegex = /((https?:\/\/[^\s]+)|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+))/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.match(urlRegex)) {
      const href = part.includes('@') ? `mailto:${part}` : part;
      return (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-semibold hover:underline">
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// ================= MAIN SCREEN =================
const FAQScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [academicFaqsData, setAcademicFaqsData] = useState({});

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFAQs();
        setAcademicFaqsData(data);
      } catch (err) {
        console.error("Error loading FAQs:", err);
      }
    };
    fetchFaqs();
  }, []);

  // Tera Flutter wala search logic
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return academicFaqsData;
    
    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.entries(academicFaqsData).forEach(([sectionTitle, qas]) => {
      if (sectionTitle.toLowerCase().includes(query)) {
        filtered[sectionTitle] = qas;
      } else {
        const matchingQas = qas.filter(qa => 
          qa.q.toLowerCase().includes(query) || qa.a.toLowerCase().includes(query)
        );
        if (matchingQas.length > 0) {
          filtered[sectionTitle] = matchingQas;
        }
      }
    });

    return filtered;
  }, [searchQuery, academicFaqsData]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col pb-10 ">
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-10 px-6 mb-4">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-tight">Academic FAQs</h1>
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
            placeholder="Search questions, rules, keywords..." 
            className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-full pl-12 pr-10 py-3.5 focus:border-indigo-500 focus:outline-none transition shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition">
              ✖
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
        {Object.keys(filteredFaqs).length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <span className="text-5xl opacity-20 mb-4">📭</span>
            <p className="text-gray-300 font-bold text-lg">No matching FAQs found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          Object.entries(filteredFaqs).map(([sectionTitle, qas], idx) => (
            <SectionAccordion key={idx} title={sectionTitle} qas={qas} initiallyExpanded={searchQuery.length > 0} />
          ))
        )}
      </div>
    </div>
  );
};

// ================= ACCORDION COMPONENTS =================
const SectionAccordion = ({ title, qas, initiallyExpanded }) => {
  const [isOpen, setIsOpen] = useState(initiallyExpanded);

  // Jab search chalega tabhi apne aap open ho jayega
  useMemo(() => {
    setIsOpen(initiallyExpanded);
  }, [initiallyExpanded]);

  return (
    <div className="mb-4 bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-800/50 transition"
      >
        <span className="font-bold text-lg text-gray-100 flex-1 pr-4">{title}</span>
        <span className="text-indigo-400 text-sm bg-indigo-500/10 p-2 rounded-full">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4">
          {qas.map((qa, idx) => (
            <QuestionAccordion key={idx} qa={qa} />
          ))}
        </div>
      )}
    </div>
  );
};

const QuestionAccordion = ({ qa }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3 bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-start p-4 cursor-pointer hover:bg-gray-800/80 transition"
      >
        <span className="font-semibold text-[14px] text-gray-200 leading-snug flex-1 pr-4">{qa.q}</span>
        <span className="text-gray-500 text-xs mt-1">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-1">
          <div className="text-gray-300 text-[14px] whitespace-pre-line leading-relaxed">
            {renderTextWithLinks(qa.a)}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQScreen;