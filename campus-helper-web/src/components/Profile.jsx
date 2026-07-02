import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 ">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between pt-4 mb-10">
        <button onClick={() => navigate('/home')} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold tracking-widest text-gray-400">USER PROFILE</h1>
        <div className="w-10"></div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 flex flex-col items-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-4">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="text-2xl font-bold">{user?.name || 'KGPian'}</h2>
        <p className="text-blue-400 text-sm font-medium">Verified Campus Member</p>
      </div>

      {/* Information Grid */}
      <div className="space-y-4">
        {[
          { label: 'Email Address', value: user?.email, icon: '📧' },
          { label: 'Hall of Residence', value: user?.hall, icon: '🏢' },
          { label: 'Phone Number', value: user?.phone, icon: '📞' }
        ].map((item, idx) => (
          <div key={idx} className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-5 flex items-center gap-5">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
              <p className="text-gray-200 font-medium">{item.value || 'Not Provided'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-12 space-y-4">
        <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-500/20 transition">
          LOGOUT SESSION
        </button>
      </div>
    </div>
  );
};

export default Profile;