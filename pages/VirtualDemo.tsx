import React from 'react';
import { Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VirtualDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wand2 className="w-10 h-10 text-brand-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Virtual Demo Temporarily Unavailable</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
            We are upgrading our AI systems to provide better results. Please check back later or contact us for a real-world quote.
        </p>
        <Link 
            to="/contact"
            className="inline-block bg-brand-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-brand-600 transition"
        >
            Get a Free Quote
        </Link>
      </div>
    </div>
  );
};