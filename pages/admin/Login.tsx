import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('kl_admin_token');
    if (token === 'true') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials for demo purposes
    if (email === 'nafimbaris004@gmail.com' && password === 'admin123') {
      localStorage.setItem('kl_admin_token', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-brand-900 p-8 text-center relative">
            <Link to="/" className="absolute left-4 top-4 text-brand-300 hover:text-white transition-colors" title="Back to Home">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-brand-200 text-sm mt-1">KL Softwash LLC</p>
        </div>
        
        <div className="p-8">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-red-100">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                            placeholder="nafimbaris004@gmail.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link to="/admin/forgot-password" className="text-sm text-brand-600 hover:text-brand-800 font-medium">
                        Forgot Password?
                    </Link>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg transition shadow-md"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400">
                <p>For Demo: nafimbaris004@gmail.com / admin123</p>
            </div>
        </div>
      </div>
    </div>
  );
};