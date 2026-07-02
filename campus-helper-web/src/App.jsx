import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import StudyMaterial from './components/StudyMaterial';
import PYQRepository from './components/PYQRepository';
import FAQScreen from './components/FAQScreen';
import SocietiesScreen from './components/SocietiesScreen';
import DepartmentsScreen from './components/DepartmentsScreen';
import JosaaRankDashboard from './components/JosaaRankDashboard';
import LingoScreen from './components/LingoScreen';
import EventsScreen from './components/EventsScreen';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Splash / Welcome route */}
        <Route path="/" element={<WelcomeFlow user={user} />} />
        
        {/* Auth routes */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />
        
        {/* Protected routes */}
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/study" element={user ? <StudyMaterial /> : <Navigate to="/login" />} />
        <Route path="/pyq" element={user ? <PYQRepository /> : <Navigate to="/login" />} />
        <Route path="/faq" element={user ? <FAQScreen /> : <Navigate to="/login" />} />
        <Route path="/societies" element={user ? <SocietiesScreen /> : <Navigate to="/login" />} />
        <Route path="/depts" element={user ? <DepartmentsScreen /> : <Navigate to="/login" />} />
        <Route path="/josaa" element={user ? <JosaaRankDashboard /> : <Navigate to="/login" />} />
        <Route path="/lingo" element={user ? <LingoScreen /> : <Navigate to="/login" />} />
        <Route path="/events" element={user ? <EventsScreen /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Separate component to handle the splash screen timer and conditional navigation
const WelcomeFlow = ({ user }) => {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (user) {
      // Authenticated users enter the application directly
      navigate('/home', { replace: true });
    } else {
      // Welcome screen timer logic (2.5 sec fade, 3.5 sec login navigation)
      const fadeTimer = setTimeout(() => setIsFadingOut(true), 2500);
      const screenTimer = setTimeout(() => navigate('/login', { replace: true }), 3500);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(screenTimer);
      };
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center font-sans">
      <div className={`text-center relative ${isFadingOut ? 'animate-fadeOut' : ''}`}>
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2"></div>
        <div className={`relative ${!isFadingOut ? 'animate-fadeIn' : ''}`}>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">Campus</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 ml-2">Helper</span>
          </h1>
          <p className={`text-2xl md:text-3xl text-gray-400 font-light tracking-wide ${!isFadingOut ? 'animate-fadeInUp delay-300' : ''}`}>
            Welcomes <span className="text-gray-200 font-medium">You...</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;