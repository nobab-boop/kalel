import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { SERVICES, SERVICE_AREAS_LIST } from '../constants';
import { BookingFormData } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service');

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    serviceType: preSelectedService || 'roof', // Default to first service or specific fallback
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

  const openMap = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', FL')}`, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new lead object
    const newLead = {
      ...formData,
      // Generate a unique ID
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      status: 'New',
      submittedAt: new Date().toISOString()
    };

    // Save to LocalStorage
    const existingLeads = JSON.parse(localStorage.getItem('kl_leads') || '[]');
    const updatedLeads = [newLead, ...existingLeads];
    localStorage.setItem('kl_leads', JSON.stringify(updatedLeads));

    console.log('Contact Form Submitted and Saved:', newLead);
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Header Animation
        gsap.from(".contact-header > *", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Booking Card Animation
        gsap.from(".booking-card", {
            scrollTrigger: {
                trigger: ".booking-card",
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        gsap.from(".sidebar-item", {
             scrollTrigger: {
                trigger: ".booking-card",
                start: "top 85%",
            },
            x: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.4,
            ease: "power2.out"
        });

        // Contact Info Cards - Fixed Visibility
        // Using top 95% to ensure it triggers almost immediately when entering viewport
        gsap.from(".contact-card", {
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 95%", 
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all" // Important: removes inline styles after animation to prevent persistent invisibility
        });

        // Map Section
        gsap.from(".map-section", {
             scrollTrigger: {
                trigger: ".map-section",
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all"
        });

    }, containerRef);

    // Force refresh ScrollTrigger after a short delay to account for layout shifts
    const timer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    return () => {
        ctx.revert();
        clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
       <div className="bg-white pb-12 pt-20 contact-header">
          <div className="container mx-auto px-4 text-center">
             <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact & Free Estimate</h1>
             <p className="text-slate-600 max-w-xl mx-auto">Ready to restore your property's shine? Get a free quote instantly.</p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-12 -mt-10">
          
          {/* 1. Exact Booking Form Layout from Free Estimate Page */}
          <div className="max-w-6xl mx-auto mb-16 booking-card bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-brand-100">
            {isSubmitted ? (
                <div className="w-full p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received!</h2>
                    <p className="text-slate-600 mb-8">
                      Thank you, {formData.name}. We've received your quote request for <strong>{formData.serviceType}</strong> cleaning. 
                      Our team will contact you at {formData.phone} shortly to confirm details.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="bg-brand-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-600 transition"
                    >
                      Send Another Request
                    </button>
                </div>
            ) : (
                <>
                {/* Form Section */}
                <div className="md:w-2/3 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Get a Free Quote</h2>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {/* Removed Property Size as requested */}
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Info Side Panel - Sidebar */}
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
                </>
            )}
          </div>

          {/* 2. Contact Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 contact-grid">
             <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition group contact-card">
                <div className="w-12 h-12 bg-white text-brand-600 rounded-full flex items-center justify-center mb-4 border border-brand-100 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                   <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Call Us</h3>
                <p className="text-slate-500 mb-4">Mon-Fri from 8am to 6pm</p>
                <a href="tel:+12395376973" className="text-brand-600 font-bold hover:underline">239-537-6973</a>
             </div>

             <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition group contact-card">
                <div className="w-12 h-12 bg-white text-brand-600 rounded-full flex items-center justify-center mb-4 border border-brand-100 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                   <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-500 mb-4">We'll respond within 24 hours</p>
                <a href="mailto:klsoftwashllc@gmail.com" className="text-brand-600 font-bold hover:underline">klsoftwashllc@gmail.com</a>
             </div>

             <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition group contact-card">
                <div className="w-12 h-12 bg-white text-brand-600 rounded-full flex items-center justify-center mb-4 border border-brand-100 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                   <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Hours</h3>
                <p className="text-slate-500 text-sm">
                   Mon-Fri: 8:00 AM - 6:00 PM<br/>
                   Sat: 9:00 AM - 4:00 PM<br/>
                   Sun: Closed
                </p>
             </div>
          </div>

          {/* 3. Service Area Section */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-brand-100 map-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">Serving Naples & Beyond</h3>
                    </div>
                    
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        KL Softwash LLC is proud to provide top-rated residential and commercial cleaning services across <strong>Naples, Florida</strong> and the surrounding Southwest Florida region.
                        From the beaches of <strong>Marco Island</strong> to the communities in <strong>Estero</strong>, we bring the shine to you.
                    </p>

                    <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Tap a location to find us on maps:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {SERVICE_AREAS_LIST.map(area => (
                            <button 
                                key={area}
                                onClick={() => openMap(area)}
                                className="flex items-center justify-between px-4 py-3 bg-brand-50 hover:bg-brand-100 border border-brand-100 hover:border-brand-200 text-slate-700 hover:text-brand-700 rounded-xl text-sm font-medium transition-all group text-left"
                            >
                                <span>{area}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity text-brand-500" />
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-slate-400">
                      Don't see your area? Call us at <a href="tel:+12395376973" className="text-brand-500 underline">239-537-6973</a>
                    </div>
                </div>

                <div className="order-1 lg:order-2 h-full min-h-[300px]">
                    <div className="h-full w-full rounded-2xl overflow-hidden border border-brand-100 shadow-lg min-h-[300px]">
                         <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.53925916665!2d-81.87224424164316!3d26.14203578768826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88dae19b73c2d7ad%3A0x673f5a18dca46875!2sNaples%2C%20FL!5e0!3m2!1sen!2sus!4v1652882000000!5m2!1sen!2sus" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, minHeight: '300px' }} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Service Area Map"
                         ></iframe>
                    </div>
                </div>
            </div>
          </div>
       </div>
    </div>
  );
};