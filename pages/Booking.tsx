import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { SERVICES } from '../constants';
import { BookingFormData } from '../types';
import gsap from 'gsap';

export const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedService = searchParams.get('service');
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    serviceType: preSelectedService || 'residential',
    date: '',
    time: '',
    instructions: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, serviceType: preSelectedService }));
    }
  }, [preSelectedService]);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".booking-card", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        gsap.from(".sidebar-item", {
            x: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.4,
            ease: "power2.out"
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to LocalStorage to simulate backend database
    // Add randomness to ID to prevent collisions and ensure uniqueness for delete operations
    const newLead = {
      ...formData,
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      status: 'New',
      submittedAt: new Date().toISOString()
    };

    const existingLeads = JSON.parse(localStorage.getItem('kl_leads') || '[]');
    const updatedLeads = [newLead, ...existingLeads];
    localStorage.setItem('kl_leads', JSON.stringify(updatedLeads));

    console.log('Form Submitted and Saved:', newLead);
    setIsSubmitted(true);
    window.scrollTo(0,0);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received!</h2>
          <p className="text-slate-600 mb-8">
            Thank you, {formData.name}. We've received your quote request for <strong>{formData.serviceType}</strong> cleaning. 
            Our team will contact you at {formData.phone} shortly to confirm details.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row booking-card">
          
          {/* Form Section */}
          <div className="md:w-2/3 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Get a Free Quote</h1>
            <p className="text-slate-500 mb-8">Fill out the form below and we'll get back to you within 2 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition bg-white"
                >
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      required
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition bg-white"
                    >
                      <option value="" disabled>Select time...</option>
                      <option value="morning">Morning (8am - 12pm)</option>
                      <option value="afternoon">Afternoon (12pm - 4pm)</option>
                      <option value="evening">Evening (4pm - 7pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Instructions (Optional)</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                  placeholder="Do you have pets? Gate codes? Specific areas to focus on?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Info Side Panel */}
          <div className="md:w-1/3 bg-brand-900 text-brand-50 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 sidebar-item">Why Book With Us?</h3>
              <ul className="space-y-6">
                <li className="flex gap-4 sidebar-item">
                  <div className="bg-brand-800 p-2 rounded-lg h-fit">
                    <ShieldCheck className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Fully Insured</h4>
                    <p className="text-sm text-brand-200 mt-1">We are licensed, bonded, and insured for your protection.</p>
                  </div>
                </li>
                <li className="flex gap-4 sidebar-item">
                  <div className="bg-brand-800 p-2 rounded-lg h-fit">
                    <CreditCard className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Cashless Payment</h4>
                    <p className="text-sm text-brand-200 mt-1">Secure online invoices. No need to have cash on hand.</p>
                  </div>
                </li>
                <li className="flex gap-4 sidebar-item">
                   <div className="bg-brand-800 p-2 rounded-lg h-fit">
                    <Calendar className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Flexible Schedule</h4>
                    <p className="text-sm text-brand-200 mt-1">Reschedule for free up to 24 hours before your booking.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-12 pt-8 border-t border-brand-800 sidebar-item">
               <p className="text-sm text-brand-300">Need help? Call us at</p>
               <p className="text-2xl font-bold text-white mt-1">239-537-6973</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
