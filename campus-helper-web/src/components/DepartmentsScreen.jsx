import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDepartments, getDepartmentCareerStats, getJosaaCutoffs } from '../services/resourceService';

const aestheticColors = ['#6366F1', '#F43F5E', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899'];
const getColorForDept = (name) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return aestheticColors[hash % aestheticColors.length];
};

// ================= 3. MINI COMPONENTS (CHARTS) =================
const ComparativeChart = ({ data, yearKey, colorClass }) => {
  const values = data.map(d => d[yearKey] || 0);
  const maxVal = Math.max(...values) || 100;
  const displayMax = maxVal * 1.1;

  return (
    <div className="flex items-end justify-between h-full w-full gap-2 mt-4">
      {data.map((d, i) => {
        const val = d[yearKey] || 0;
        const heightPercent = val === 0 ? 0 : (val / displayMax) * 100;
        return (
          <div key={i} className="flex flex-col items-center justify-end h-full flex-1">
            {val > 0 && <span className="text-[8px] font-bold text-gray-400 mb-1">{val}</span>}
            <div 
              className={`w-3 sm:w-4 rounded-t-sm ${colorClass} opacity-80`} 
              style={{ height: `${heightPercent}%` }}
            ></div>
            <span className="text-[7px] font-bold text-gray-500 mt-2 -rotate-90 origin-center translate-y-2 whitespace-nowrap">
              {d.code}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CareerTrendChart = ({ title, dataRow, colorClass }) => {
  const years = ['2022-23', '2023-24', '2024-25', '2025-26'];
  const values = years.map(y => dataRow[y] || 0);
  const maxVal = Math.max(...values) || 100;

  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold text-gray-400 mb-4">{title}</h4>
      <div className="flex items-end justify-between h-24 gap-4">
        {years.map((y, i) => {
          const val = values[i];
          const heightPercent = val === 0 ? 0 : (val / maxVal) * 100;
          return (
            <div key={i} className="flex flex-col items-center justify-end h-full flex-1">
              <span className={`text-[10px] font-bold mb-1 ${colorClass.split(' ')[1]}`}>{val}</span>
              <div className={`w-6 rounded-t-md ${colorClass}`} style={{ height: `${heightPercent}%` }}></div>
              <span className="text-[9px] text-gray-500 mt-2">{y.substring(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ================= 4. MAIN SCREENS =================
const DepartmentsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);

  const [departmentsData, setDepartmentsData] = useState({});
  const [internData, setInternData] = useState([]);
  const [placementData, setPlacementData] = useState([]);

  // Fetch departments data and stats on mount
  useEffect(() => {
    const fetchDeptData = async () => {
      try {
        const data = await getDepartments();
        setDepartmentsData(data);
        const stats = await getDepartmentCareerStats();
        setInternData(stats.internData || []);
        setPlacementData(stats.placementData || []);
      } catch (err) {
        console.error("Error loading departments data:", err);
      }
    };
    fetchDeptData();
  }, []);

  const deptNames = Object.keys(departmentsData);
  const filteredNames = deptNames.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase()));

  // ---- DETAIL VIEW ----
  if (selectedDept) {
    const dept = departmentsData[selectedDept];
    const color = getColorForDept(selectedDept);
    const internRow = dept?.careerCode ? internData.find(d => d.department === dept.careerCode) : null;
    const placeRow = dept?.careerCode ? placementData.find(d => d.department === dept.careerCode) : null;
    if (!dept) return <div className="p-10 text-white">Department data loading...</div>;
    return (
      <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
        {/* Detail Header */}
        <div className="flex items-center gap-4 pt-10 px-6 mb-4 pb-4 border-b border-gray-900 sticky top-0 bg-gray-950/90 backdrop-blur-md z-10">
          <button onClick={() => setSelectedDept(null)} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-lg font-bold truncate">{selectedDept}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20">
          {/* HOD Card */}
          {dept.hod && (
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">👤</div>
                <div>
                  <p className="text-[10px] font-bold text-blue-300/70 uppercase tracking-widest">Head of Department</p>
                  <h2 className="text-lg font-black text-blue-55">{dept.hod.name}</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => window.open(`mailto:${dept.hod.email}`)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">✉️ Email</button>
                <button onClick={() => window.open(`tel:${dept.hod.mob}`)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">📞 Call</button>
              </div>
            </div>
          )}


          {/* Career Stats */}
          {(internRow || placeRow) && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2">📈 Career Trends</h3>
              {internRow && <CareerTrendChart title="Internship Offers" dataRow={internRow} colorClass="bg-blue-500/80 text-blue-400" />}
              {placeRow && <CareerTrendChart title="Full-Time Placements" dataRow={placeRow} colorClass="bg-teal-500/80 text-teal-400" />}
            </div>
          )}
          {/* Mini JoSAA Ranks */}
          <MiniJosaaRanks departmentName={selectedDept} />
          {/* Quick Facts & Overview */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-5 mb-6 flex divide-x divide-gray-800">
            {dept.about?.year && (
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Established</p>
                <p className="text-sm font-black mt-1">{dept.about.year}</p>
              </div>
            )}
            {dept.about?.students && (
              <div className="flex-1 pl-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Students</p>
                <p className="text-sm font-black mt-1 leading-tight">{dept.about.students}</p>
              </div>
            )}
          </div>

          <h3 className="text-lg font-black mb-3">Overview</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-8 whitespace-pre-line">{dept.overview}</p>

          {/* Courses */}
          {dept.courses && dept.courses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black mb-3">Courses Offered</h3>
              <ul className="space-y-2">
                {dept.courses.map((c, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-400"><span className="text-gray-600 mt-1">•</span>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Research Areas */}
          {dept.research && dept.research.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black mb-4">Research Areas</h3>
              <div className="flex flex-wrap gap-2">
                {dept.research.map((r, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-700">{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {dept.facilities && dept.facilities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black mb-3">Facilities & Labs</h3>
              <ul className="space-y-2">
                {dept.facilities.map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-400"><span className="text-gray-600 mt-1">•</span>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Organisations */}
          {dept.importantOrgs && dept.importantOrgs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black mb-4">Important Organizations</h3>
              <div className="flex flex-wrap gap-2">
                {dept.importantOrgs.map((org, i) => (
                  <span key={i} className="bg-indigo-900/30 text-indigo-300 px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-500/30">{org}</span>
                ))}
              </div>
            </div>
          )}

          {/* Recruiting Companies */}
          {dept.recruiting && dept.recruiting.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black mb-4">Recruiting Companies</h3>
              <div className="flex flex-wrap gap-2">
                {dept.recruiting.map((company, i) => (
                  <span key={i} className="bg-emerald-900/30 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/30">{company}</span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {dept.achievements && dept.achievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-black mb-4">Achievements</h3>
              <div className="space-y-3">
                {dept.achievements.map((a, i) => (
                  <div key={i} className="bg-amber-900/10 border border-amber-500/10 p-4 rounded-xl flex gap-3">
                    <span className="text-amber-500 text-lg shrink-0">🏆</span>
                    <p className="text-sm text-gray-300 leading-snug pt-0.5">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- MAIN LIST VIEW ----
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 pt-10 px-6 mb-4">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition shrink-0">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-tight">Departments</h1>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg">🔍</span>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments..." 
            className="w-full bg-gray-900/80 border border-gray-800 text-white text-sm rounded-2xl pl-12 pr-4 py-3 focus:border-indigo-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* Global JoSAA Analytics Card */}
        {!searchQuery && (
          <div 
            onClick={() => navigate('/josaa')}
            className="mx-6 mb-8 bg-gradient-to-br from-indigo-900 to-blue-900 border border-indigo-500/30 p-6 rounded-3xl cursor-pointer hover:shadow-[0_8px_30px_rgba(99,102,241,0.3)] transition group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">
                📊
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">JoSAA Rankings Dashboard</h2>
                <p className="text-xs text-indigo-200 mt-1">Global admission analytics for all departments (2024-2025)</p>
              </div>
              <span className="text-indigo-300 shrink-0">▶</span>
            </div>
          </div>
        )}

        {/* Campus Overview Mini-Charts */}
        {!searchQuery && internData.length > 0 && placementData.length > 0 && (
          <div className="px-6 mb-8">
            <h2 className="text-lg font-black tracking-tight mb-1">Campus Overview</h2>
            <p className="text-[10px] text-gray-500 font-bold mb-4">YEARLY COMPARISON OF ALL DEPARTMENTS</p>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* Internship Card */}
              <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-3xl min-w-[280px] flex-shrink-0 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm">Internships 2025-26</h3>
                  <span className="bg-blue-500/10 text-blue-400 text-[8px] font-black px-2 py-1 rounded">INTERN</span>
                </div>
                <div className="flex-1 min-h-[100px]">
                  <ComparativeChart data={internData} yearKey="2025-26" colorClass="bg-blue-500" />
                </div>
              </div>

              {/* Placement Card */}
              <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-3xl min-w-[280px] flex-shrink-0 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm">Placements 2025-26</h3>
                  <span className="bg-teal-500/10 text-teal-400 text-[8px] font-black px-2 py-1 rounded">PLACE</span>
                </div>
                <div className="flex-1 min-h-[100px]">
                  <ComparativeChart data={placementData} yearKey="2025-26" colorClass="bg-teal-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Department List */}
        <div className="px-6 pb-20">
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Academic Departments</h2>
          
          {filteredNames.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 text-sm">No departments found.</p>
          ) : (
            <div className="space-y-3">
              {filteredNames.map((name, idx) => {
                const dept = departmentsData[name];
                const color = getColorForDept(name);
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDept(name)}
                    className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-center cursor-pointer hover:bg-gray-800/80 transition"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 shrink-0"
                      style={{ backgroundColor: `${color}1A` }}
                    >
                      {dept?.emoji || '🏛️'}
                    </div>
                    <div className="flex-1 pr-2">
                      <h3 className="font-bold text-gray-200 text-sm leading-snug">{name}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
                        <span className="text-[10px] font-bold text-gray-500">Detailed info available</span>
                      </div>
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">▶</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ================= 3.5 MINI JOSAA RANKS COMPONENT =================
const MiniJosaaRanks = ({ departmentName }) => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  
  const [data2024, setData2024] = useState([]);
  const [data2025, setData2025] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from local backend via resourceService
  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const [d24, d25] = await Promise.all([
          getJosaaCutoffs('2024').catch(() => []),
          getJosaaCutoffs('2025').catch(() => [])
        ]);
        
        setData2024(d24);
        setData2025(d25);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanks();
  }, []);

  // Map UI department name to JSON branch name
  const targetBranch = useMemo(() => {
    const mapping = {
      'Agriculture & Food Engineering': 'Agricultural and Food Engineering',
      'Architecture & Regional Planning': 'Architecture',
      'Computer Science & Engineering': 'Computer Science and Engineering',
      'Electronics & Electrical Communication Engineering': 'Electronics and Electrical Communication Engineering',
      'Humanities & Social Sciences': 'Economics',
      'Industrial & Systems Engineering': 'Industrial and Systems Engineering',
      'Mathematics': 'Mathematics and Computing',
      'Metallurgical & Materials Engineering': 'Metallurgical and Materials Engineering',
      'Ocean Engineering & Naval Architecture': 'Ocean Engineering and Naval Architecture',
      'Geology & Geophysics': 'Applied Geology',
    };
    let mapped = mapping[departmentName] || departmentName;
    if (mapped === departmentName && mapped.includes('&')) {
      mapped = mapped.replace('&', 'and');
    }
    return mapped.toLowerCase();
  }, [departmentName]);

  // Active dataset
  const activeData = useMemo(() => {
    const source = selectedYear === '2025' ? data2025 : data2024;
    return source.filter(r => r.branch && r.branch.toLowerCase() === targetBranch);
  }, [selectedYear, data2024, data2025, targetBranch]);

  const categories = ['ALL', ...Array.from(new Set(activeData.map(r => r.category))).sort()];

  // Final filtered list
  const filtered = activeData.filter(r => {
    const matchCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchGen = selectedGender === 'ALL' || r.gender.toLowerCase().includes(selectedGender.toLowerCase().split('-')[0]);
    return matchCat && matchGen;
  });

  if (loading) {
    return <div className="text-center p-6"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  if (activeData.length === 0) {
    return null; // Don't show the box if no rank data exists for this dept
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-indigo-950/20 border border-indigo-500/20 rounded-3xl p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-indigo-400 text-lg">🏅</span>
        <h3 className="text-sm font-black text-white">JoSAA Admission Ranks</h3>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
        <MiniDropdown label="Year" value={selectedYear} options={['2025', '2024']} onChange={(v) => { setSelectedYear(v); setSelectedCategory('ALL'); }} />
        <MiniDropdown label="Category" value={selectedCategory} options={categories} onChange={setSelectedCategory} />
        <MiniDropdown label="Gender" value={selectedGender} options={['ALL', 'Gender-Neutral', 'Female-only']} onChange={setSelectedGender} />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">No data for selected filters</p>
      ) : (
        <div className="mt-3 bg-gray-950/50 border border-gray-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-3 text-[9px] font-black uppercase text-gray-500">Degree</th>
                <th className="p-3 text-[9px] font-black uppercase text-gray-500">Seat</th>
                <th className="p-3 text-[9px] font-black uppercase text-blue-400">Open</th>
                <th className="p-3 text-[9px] font-black uppercase text-teal-400">Close</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-800/30">
                  <td className="p-3">
                    <p className="text-[11px] font-bold text-gray-300">{r.degree}</p>
                    <p className="text-[9px] text-gray-500">{r.gender.includes('Female') ? 'Female' : 'Neutral'}</p>
                  </td>
                  <td className="p-3 text-[11px] text-gray-400 font-medium">{r.category}</td>
                  <td className="p-3 text-[11px] font-black text-blue-400">{r.open}</td>
                  <td className="p-3 text-[11px] font-black text-teal-400">{r.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const MiniDropdown = ({ label, value, options, onChange }) => (
  <div className="flex items-center gap-1.5 bg-gray-950/50 border border-gray-800 rounded-lg px-2 py-1.5 shrink-0">
    <span className="text-[9px] font-bold text-gray-500">{label}:</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-[10px] font-bold text-gray-300 outline-none cursor-pointer">
      {options.map((o, i) => <option key={i} value={o} className="bg-gray-900 text-xs">{o}</option>)}
    </select>
  </div>
);

export default DepartmentsScreen;