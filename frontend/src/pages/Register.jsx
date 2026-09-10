import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await registerUser(form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between items-center px-4 py-8 relative font-sans selection:bg-purple-500/30">
      
      {/* Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full"></div>
      </div>

      {/* Top Header Placeholder */}
      <div className="w-full max-w-md mx-auto relative z-10 flex items-center justify-between text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">
          ← Back to ResumeAI
        </Link>
      </div>

      {/* Main Centered Auth Card (Matching NexSpend Reference) */}
      <div className="w-full max-w-md mx-auto my-auto relative z-10">
        <div className="bg-[#121827] border border-slate-800/90 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          
          {/* Card Top Brand Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-md shadow-purple-600/30">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ResumeAI</span>
            </Link>
            <p className="text-xs text-slate-400">Manage your career with ease</p>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">Create your account</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your details below to register your account</p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl mb-5 flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input 
                type="text" 
                required
                placeholder="Jane Doe"
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <input 
                type="email" 
                required
                placeholder="m@example.com"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                style={{ height: '44px' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  style={{ height: '44px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input 
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500/20 accent-purple-600 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-300 cursor-pointer select-none">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn-purple w-full justify-center text-sm py-3 mt-2 rounded-full font-semibold cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-xs">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </div>

        </div>
      </div>

      {/* Floating Bottom Right Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#131b2e] border border-slate-800 shadow-2xl max-w-sm flex items-center justify-between gap-4 backdrop-blur-md">
          <div>
            <div className="text-xs font-bold text-white mb-0.5">Install ResumeAI App</div>
            <div className="text-[11px] text-slate-400">Add to home screen for near-native experience & offline access.</div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/register" className="btn-purple text-xs px-3.5 py-1.5 shrink-0">
              Install
            </Link>
            <button 
              onClick={() => setShowInstallBanner(false)} 
              className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center text-[11px] text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
      </div>

    </div>
  );
};

export default Register;
