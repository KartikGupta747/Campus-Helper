import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudyMaterials } from '../services/resourceService';

const StudyMaterial = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('1st Yr');
  const [studyMaterials, setStudyMaterials] = useState([]);

  const years = ['1st Yr', '2nd Yr', '3rd Yr', '4th Yr', '5th Yr', 'Additional'];

  // Fetch materials from API on mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getStudyMaterials();
        setStudyMaterials(data);
      } catch (err) {
        console.error("Error loading study materials:", err);
      }
    };
    fetchMaterials();
  }, []);

  // Filter study materials dynamically
  const firstYearSubjects = studyMaterials.filter(m => m.year === '1st Yr');
  const additionalLinks = studyMaterials.filter(m => m.year === 'Additional');

  // Updated Departments List
  const departments = [
    'IM', 'AE', 'AG', 'AR', 'BT', 'CH', 'CY', 'CE', 'CS', 'EE', 
    'EC', 'GG', 'HS', 'IE', 'MA', 'ME', 'MT', 'MI', 'NA', 'PH'
  ];

  // Helper function to open links in a new tab
  const openLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 pb-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-4 mb-8">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-tight">Academic Material</h1>
      </div>

      {/* YEAR SELECTION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
              selectedYear === year 
              ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
              : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* DYNAMIC CONTENT BASED ON SELECTED YEAR */}

      {/* === 1ST YEAR CONTENT === */}
      {selectedYear === '1st Yr' && (
        <>
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">1ST YEAR SUBJECTS</h2>
          <div className="grid grid-cols-2 gap-3">
            {firstYearSubjects.map((sub, idx) => (
              <div 
                key={idx} 
                onClick={() => openLink(sub.url)}
                className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-gray-800/80 transition cursor-pointer group"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition">
                  {sub.icon}
                </div>
                <p className="text-xs font-bold text-gray-200 leading-tight">{sub.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === 2ND to 5TH YEAR CONTENT (DEPARTMENTS) === */}
      {['2nd Yr', '3rd Yr', '4th Yr', '5th Yr'].includes(selectedYear) && (
        <>
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">SELECT DEPARTMENT</h2>
          <div className="grid grid-cols-3 gap-3">
            {departments.map((dept, idx) => (
              <div 
                key={idx} 
                onClick={() => openLink(`https://drive.google.com/${selectedYear.replace(' Yr', 'th')}/${dept}`)}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center justify-center hover:bg-blue-600/20 hover:border-blue-500/30 hover:text-blue-400 transition cursor-pointer group"
              >
                <span className="text-sm font-bold tracking-wider text-gray-300 group-hover:text-blue-400">
                  {dept}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === ADDITIONAL CONTENT === */}
      {selectedYear === 'Additional' && (
        <>
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">ADDITIONAL RESOURCES</h2>
          <div className="space-y-3">
            {additionalLinks.map((item, idx) => (
               <div 
                 key={idx}
                 onClick={() => openLink(item.url)}
                 className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800/80 transition cursor-pointer group"
               >
                 <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition">
                   {item.icon}
                 </div>
                 <h3 className="font-bold text-gray-200">{item.name}</h3>
                 <div className="ml-auto text-gray-500 group-hover:text-blue-400 transition">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                   </svg>
                 </div>
               </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default StudyMaterial;