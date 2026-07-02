import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      alert(`🎉 Login Successful! Welcome ${data.user.name}`);
      
      // Save user to localStorage to persist sessions
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onSuccess(data.user); // Triggers state change in App.jsx
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.error || "Invalid Credentials or Server Error!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back!</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow-2xl border border-gray-800 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 transition" placeholder="you@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 transition" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition transform hover:-translate-y-0.5">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
             <button onClick={() => navigate('/register')} type="button" className="text-blue-400 hover:underline text-sm">
                Don't have an account? Register
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;