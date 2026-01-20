import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const AdminForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setTimeout(() => {
        setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-brand-900 p-6">
            <Link to="/admin" className="text-brand-200 hover:text-white flex items-center gap-1 text-sm mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>
        
        <div className="p-8">
            {isSubmitted ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h3>
                    <p className="text-slate-600 mb-6">
                        We've sent password reset instructions to <strong>{email}</strong>.
                    </p>
                    <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-brand-600 font-bold hover:underline"
                    >
                        Try with a different email
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-slate-600 text-sm">
                        Enter the email address associated with your admin account and we'll send you a link to reset your password.
                    </p>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
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

                    <button 
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg transition shadow-md"
                    >
                        Send Reset Link
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};