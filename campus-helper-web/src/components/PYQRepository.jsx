import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreviousYearPapers } from '../services/resourceService';

// ================= URL HELPER =================
const openPdf = (url) => {
  if (!url) return;
  let processedUrl = url;
  if (url.includes("drive.google.com/uc?id=")) {
    const fileId = url.split("id=")[1].split("&")[0];
    processedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  }
  window.open(processedUrl, '_blank');
};

const PYQRepository = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [pyqData, setPyqData] = useState({});
  const [loading, setLoading] = useState(true);

  // ASLI DATA FETCH
  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        const data = await getPreviousYearPapers();
        setPyqData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PYQ data:", error);
        setLoading(false);
      }
    };
    fetchPYQs();
  }, []);

// Search ke liye flatten list (Fixed Normalize Logic)
  const allPdfs = useMemo(() => {
    let out = [];
    if (!pyqData || Object.keys(pyqData).length === 0) return out;

    Object.keys(pyqData).forEach(year => {
      Object.keys(pyqData[year]).forEach(exam => {
        Object.keys(pyqData[year][exam]).forEach(dept => {
          Object.keys(pyqData[year][exam][dept]).forEach(subjectKey => {
            const pdfs = pyqData[year][exam][dept][subjectKey].pdfs || [];
            
            // Redundancy check
            const isRedundant = subjectKey.trim().toLowerCase() === dept.trim().toLowerCase() || subjectKey.toLowerCase() === 'unknown';
            
            pdfs.forEach(pdf => {
              const rawSubject = isRedundant ? (pdf.type || 'Document') : subjectKey;
              
              // 🚀 FLUTTER WALA NORMALIZE LOGIC: Saare '_' aur '-' ko space mein badal do
              const cleanSubject = rawSubject.replace(/[_-]+/g, " ");
              const cleanExam = exam.replace(/[_-]+/g, " ");
              const cleanType = (pdf.type || 'Document').replace(/[_-]+/g, " ");
              
              out.push({
                year,
                exam: cleanExam,
                dept,
                subject: cleanSubject,
                type: cleanType,
                url: pdf.url,
                // Ab search text mein koi underscore nahi bachega
                searchText: `${year} ${cleanExam} ${dept} ${cleanSubject} ${cleanType}`.toLowerCase()
              });
            });
          });
        });
      });
    });
    return out.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [pyqData]);

  const filteredPdfs = useMemo(() => {
    return allPdfs.filter(pdf => {
      const matchesSearch = pdf.searchText.includes(searchQuery.toLowerCase().trim());
      const matchesFilter = filter === 'all' || pdf.exam.toLowerCase().includes(filter);
      return matchesSearch && matchesFilter;
    });
  }, [allPdfs, searchQuery, filter]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col pb-10 ">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-10 px-6 mb-4">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-tight">Search Archives</h1>
      </div>

      {/* TOGGLE SWITCH */}
      <div className="px-6 mb-4">
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 h-11">
          <button onClick={() => setActiveTab('search')} className={`flex-1 rounded-lg text-sm transition ${activeTab === 'search' ? 'bg-gray-700 font-bold text-white shadow-sm' : 'font-medium text-gray-500 hover:text-gray-300'}`}>Search</button>
          <button onClick={() => setActiveTab('database')} className={`flex-1 rounded-lg text-sm transition ${activeTab === 'database' ? 'bg-gray-700 font-bold text-white shadow-sm' : 'font-medium text-gray-500 hover:text-gray-300'}`}>Database</button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-400 font-bold">Loading PYQs...</p>
          </div>
        ) : activeTab === 'search' ? (
          <SearchTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} filter={filter} setFilter={setFilter} filteredPdfs={filteredPdfs} />
        ) : (
          <DatabaseTab data={pyqData} />
        )}
      </div>
    </div>
  );
};

// ================= 1. DATABASE TAB (FIXED HIERARCHY) =================

const DatabaseTab = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return <div className="text-center text-gray-500 mt-20">No PYQ data available.</div>;
  const sortedYears = Object.keys(data).sort((a, b) => b.localeCompare(a));

  return (
    <div className="px-6 pt-2 pb-20">
      {sortedYears.map(year => (
        <YearAccordion key={year} year={year} exams={data[year]} />
      ))}
    </div>
  );
};

// Level 1: Year
const YearAccordion = ({ year, exams }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!exams || typeof exams !== 'object') return null;

  return (
    <div className="mb-3 bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center p-4 cursor-pointer hover:bg-gray-800/80 transition">
        <span className="text-indigo-500 mr-3 text-xl">📁</span>
        <span className="font-black text-[15px]">Year {year}</span>
        <span className="ml-auto text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="pb-2 border-t border-gray-800/50">
          {Object.entries(exams).map(([examName, depts]) => (
            <ExamAccordion key={examName} examName={examName} depts={depts} />
          ))}
        </div>
      )}
    </div>
  );
};

// Level 2: Exam 
const ExamAccordion = ({ examName, depts }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!depts || typeof depts !== 'object') return null;

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center py-3 pr-4 pl-12 cursor-pointer hover:bg-gray-800/50 transition">
        <span className="font-bold text-[14px] text-indigo-400">{examName.replace(/_/g, " ")}</span>
        <span className="ml-auto text-gray-600 text-[10px]">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div>
          {Object.entries(depts).map(([deptName, subjects]) => (
            <DeptAccordion key={deptName} deptName={deptName} subjects={subjects} />
          ))}
        </div>
      )}
    </div>
  );
};

// Level 3: Department (Redundancy Bypass Logic Here)
const DeptAccordion = ({ deptName, subjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!subjects || typeof subjects !== 'object') return null;

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center py-2.5 pr-4 pl-16 cursor-pointer hover:bg-gray-800/50 transition">
        <span className="font-semibold text-[13px] text-gray-200">{deptName}</span>
        <span className="ml-auto text-gray-600 text-[10px]">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="pb-2">
          {Object.entries(subjects).map(([subName, data]) => {
            // Check if JSON key is redundant (repeating dept name)
            const isRedundant = subName.trim().toLowerCase() === deptName.trim().toLowerCase() || subName.toLowerCase() === 'unknown';
            
            if (isRedundant && data.pdfs) {
              // Bypass Level 4 and directly render PDFs as Subjects
              return data.pdfs.map((pdf, i) => (
                <div key={`direct-${i}`} onClick={() => openPdf(pdf.url)} className="flex items-center py-2 pr-4 pl-20 cursor-pointer hover:bg-gray-800/50 transition group">
                  <span className="text-red-400 mr-3 text-lg group-hover:scale-110 transition">📄</span>
                  <span className="font-medium text-[13px] text-blue-300 flex-1">{pdf.type ? pdf.type.replace(/_/g, " ") : 'Subject Paper'}</span>
                  <span className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition">View ⬇️</span>
                </div>
              ));
            }

            // Normal rendering if it's actually a valid subject key
            return <SubjectAccordion key={subName} subName={subName} data={data} />;
          })}
        </div>
      )}
    </div>
  );
};

// Level 4: Subject -> Files (Sirf tab chalega agar DB mein valid structure ho)
const SubjectAccordion = ({ subName, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!data || typeof data !== 'object') return null;
  const pdfs = Array.isArray(data.pdfs) ? data.pdfs : [];
  if (pdfs.length === 0) return null;

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center py-2 pr-4 pl-20 cursor-pointer hover:bg-gray-800/50 transition">
        <span className="font-medium text-[13px] text-blue-300">{subName.replace(/_/g, " ")}</span>
        <span className="ml-auto text-gray-600 text-[10px]">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="pb-3 pt-1">
          {pdfs.map((pdf, i) => (
            <div key={i} onClick={() => openPdf(pdf.url)} className="ml-24 mr-6 my-1.5 bg-gray-800/30 hover:bg-gray-800/80 border border-gray-700/30 rounded-xl p-3 flex items-center cursor-pointer transition">
              <span className="text-red-400 mr-3 text-lg">📄</span>
              <span className="font-semibold text-xs text-gray-100 flex-1">{pdf.type ? pdf.type.replace(/_/g, " ") : 'Document'}</span>
              <span className="text-gray-500 text-sm">⬇️</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================= 2. SEARCH TAB =================

const SearchTab = ({ searchQuery, setSearchQuery, filter, setFilter, filteredPdfs }) => (
  <div className="px-6 pb-20">
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="text-indigo-500 text-sm">🔍</span></div>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subject, year, or dept..." className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-2xl pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none transition"/>
      {searchQuery && (
        <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition">✖</button>
      )}
    </div>

    <div className="flex items-center gap-2 mb-6">
      {['all', 'mid', 'end'].map((f) => (
        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'}`}>
          {f === 'all' ? 'All' : f === 'mid' ? 'Mid Sem' : 'End Sem'}
        </button>
      ))}
      <span className="ml-auto text-xs font-bold text-gray-500">{filteredPdfs.length} items</span>
    </div>

    {filteredPdfs.length === 0 ? (
      <div className="text-center mt-20 text-gray-500">
        <span className="text-5xl opacity-20">🗂️</span>
        <p className="mt-4 font-bold text-sm">No papers found</p>
      </div>
    ) : (
      <div className="space-y-3">
        {filteredPdfs.map((pdf, idx) => (
          <div key={idx} onClick={() => openPdf(pdf.url)} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-800 transition">
            <div className="bg-red-500/10 p-2 rounded-lg text-red-400">📄</div>
            <div className="flex-1">
              {/* Asli paper ka naam dikhega yahan ab! */}
              <h3 className="font-bold text-blue-100 text-[13px] leading-tight mb-2">{pdf.subject}</h3>
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-2 py-0.5 rounded-md">{pdf.exam}</span>
                <span className="bg-green-500/10 text-green-400 text-[9px] font-black px-2 py-0.5 rounded-md">{pdf.year}</span>
                <span className="ml-auto text-[10px] font-bold text-gray-500">{pdf.dept}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PYQRepository;