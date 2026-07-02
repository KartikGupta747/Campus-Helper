import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJosaaCutoffs } from '../services/resourceService';

const JosaaRankDashboard = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [ranks2024, setRanks2024] = useState([]);
  const [ranks2025, setRanks2025] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const [data2024, data2025] = await Promise.all([
          getJosaaCutoffs('2024'),
          getJosaaCutoffs('2025')
        ]);

        setRanks2024(data2024 || []);
        setRanks2025(data2025 || []);
        setIsLoaded(true);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error loading JoSAA cutoffs from backend");
        setIsLoaded(true);
      }
    };
    fetchRanks();
  }, []);

  const activeData = useMemo(() => (selectedYear === '2025' ? ranks2025 : ranks2024), [selectedYear, ranks2024, ranks2025]);

  const categories = useMemo(() => ['ALL', ...new Set(activeData.map(r => r.category))].sort(), [activeData]);
  const departments = useMemo(() => ['ALL', ...new Set(activeData.map(r => r.branch))].sort(), [activeData]);

  const filteredRanks = useMemo(() => {
    return activeData.filter((r) => {
      const matchesDept = selectedDepartment === 'ALL' || r.branch === selectedDepartment;
      const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
      const matchesGender = selectedGender === 'ALL' || r.gender.toLowerCase().includes(selectedGender.toLowerCase().split('-')[0]);
      const matchesSearch = searchQuery === '' || r.branch.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesCat && matchesGender && matchesSearch;
    });
  }, [activeData, selectedDepartment, selectedCategory, selectedGender, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col pb-10">
      <div className="flex items-center gap-4 pt-10 px-6 mb-4">
        <button onClick={() => navigate('/depts')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-tight">JoSAA Rankings</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase">Global Admission Dashboard</p>
        </div>
      </div>

      {!isLoaded ? (
        <div className="flex-1 flex justify-center items-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : error ? (
        <div className="p-10 text-center text-red-400 font-bold">{error}</div>
      ) : (
        <>
          <div className="px-6 mb-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter by branch..." className="w-full bg-gray-950 border border-gray-800 text-white text-xs rounded-xl px-4 py-2.5 mb-4 focus:border-indigo-500 outline-none" />
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <FilterDropdown label="Year" value={selectedYear} options={['2025', '2024']} onChange={setSelectedYear} />
                <FilterDropdown label="Category" value={selectedCategory} options={categories} onChange={setSelectedCategory} />
                <FilterDropdown label="Gender" value={selectedGender} options={['ALL', 'Gender-Neutral', 'Female-only']} onChange={setSelectedGender} />
              </div>
              <div className="mt-2"><FilterDropdown label="Dept" value={selectedDepartment} options={departments} onChange={setSelectedDepartment} full /></div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto px-6">
            <table className="w-full text-left border-collapse min-w-[600px] bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <thead className="bg-gray-900">
                <tr>
                  <th className="p-4 text-[10px] uppercase text-gray-400">Academic Program</th>
                  <th className="p-4 text-[10px] uppercase text-gray-400">Category</th>
                  <th className="p-4 text-[10px] uppercase text-blue-400">Open</th>
                  <th className="p-4 text-[10px] uppercase text-teal-400">Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredRanks.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-800/30 transition">
                    <td className="p-4"><p className="text-xs font-bold text-gray-200">{r.branch}</p><p className="text-[9px] text-gray-500">{r.degree} | {r.gender}</p></td>
                    <td className="p-4 text-xs">{r.category}</td>
                    <td className="p-4 text-xs font-black text-blue-400">{r.open}</td>
                    <td className="p-4 text-xs font-black text-teal-400">{r.close}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const FilterDropdown = ({ label, value, options, onChange, full }) => (
  <div className={`flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 ${full ? 'w-full' : 'shrink-0'}`}>
    <span className="text-[10px] font-bold text-gray-500">{label}:</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-xs font-bold text-gray-200 outline-none cursor-pointer w-full">
      {options.map((o, i) => <option key={i} value={o} className="bg-gray-900">{o}</option>)}
    </select>
  </div>
);

export default JosaaRankDashboard;