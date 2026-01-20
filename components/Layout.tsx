import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Menu, X, Phone, Facebook, Instagram, Twitter, MapPin, Mail, ArrowRight, Lock } from 'lucide-react';
import { ChatAssistant } from './ChatAssistant';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white">
      {/* Top Bar - Contact Info */}
      <div className="bg-brand-900 text-brand-100 text-xs py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+12395376973" className="flex items-center gap-1 hover:text-white transition-colors">
                <Phone className="w-3 h-3" /> 239-537-6973
            </a>
            <a href="mailto:klsoftwashllc@gmail.com" className="flex items-center gap-1 hidden sm:flex hover:text-white transition-colors">
                <Mail className="w-3 h-3" /> klsoftwashllc@gmail.com
            </a>
          </div>
          <div className="flex gap-3">
             <span>Serving Naples, FL & Surrounding Areas</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="https://i.imgur.com/Lh12vNF.png" 
                alt="KL Softwash LLC" 
                className="h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-extrabold text-lg md:text-xl text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors hidden sm:block">
                KL Softwash
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-bold transition-colors hover:text-brand-500 ${
                      isActive ? 'text-brand-600' : 'text-slate-600'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="flex items-center gap-3 ml-4">
                <a 
                   href="tel:+12395376973" 
                   className="hidden xl:flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-full transition shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
                >
                    <Phone className="w-4 h-4 fill-current" />
                    239-537-6973
                </a>
                <a 
                   href="tel:+12395376973" 
                   className="xl:hidden flex items-center justify-center w-9 h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-full transition shadow-md"
                   title="Call Us"
                >
                   <Phone className="w-4 h-4 fill-current" />
                </a>
                <Link
                    to="/contact"
                    className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    Free Estimate
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full h-screen overflow-y-auto pb-20 z-50">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-lg font-medium p-2 rounded-lg ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex flex-col gap-3 mt-4">
                 <a 
                   href="tel:+12395376973" 
                   className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                    <Phone className="w-5 h-5" />
                    Call 239-537-6973
                </a>
                <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-brand-500 text-white px-4 py-3 rounded-xl text-center font-bold shadow-md"
                >
                Free Estimate
                </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <ChatAssistant />

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                KL Softwash LLC
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Premier cleaning services in Naples, FL designed to give you back your time and peace of mind.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61551232046085" target="_blank" rel="noreferrer" className="hover:text-white transition"><Facebook className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-brand-400 transition">About Us</Link></li>
                <li><Link to="/services" className="hover:text-brand-400 transition">Our Services</Link></li>
                <li><Link to="/contact" className="hover:text-brand-400 transition">Book Now</Link></li>
                <li><Link to="/contact" className="hover:text-brand-400 transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact?service=roof" className="hover:text-brand-400 transition">Roof Softwashing</Link></li>
                <li><Link to="/contact?service=exterior" className="hover:text-brand-400 transition">House Exterior</Link></li>
                <li><Link to="/contact?service=driveway" className="hover:text-brand-400 transition">Driveway & Sidewalk</Link></li>
                <li><Link to="/contact?service=patio" className="hover:text-brand-400 transition">Patio Cleaning</Link></li>
                <li className="pt-2">
                  <Link to="/services" className="inline-flex items-center gap-1 text-brand-400 hover:text-white transition font-medium">
                    View All Services <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0" />
                  <a 
                    href="https://www.google.com/maps/place/Naples,+FL" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-brand-400 transition"
                  >
                    Naples, FL
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                  <a href="tel:2395376973" className="hover:text-brand-400 transition">239-537-6973</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-400 shrink-0" />
                  <a href="mailto:klsoftwashllc@gmail.com" className="hover:text-brand-400 transition">klsoftwashllc@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} KL Softwash LLC. All rights reserved.</p>
            <Link to="/admin" className="flex items-center gap-1 hover:text-brand-400 transition-colors opacity-70 hover:opacity-100">
                <Lock className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};