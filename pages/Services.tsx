import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { SERVICES } from '../constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".services-header > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Service Cards Animation
      gsap.from(".service-item", {
        scrollTrigger: {
          trigger: ".service-list",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-900 text-white py-20 services-header relative overflow-hidden">
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-800 to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-brand-200 text-lg max-w-2xl mx-auto">
            Comprehensive cleaning solutions tailored to your unique needs. 
            From routine maintenance to deep cleaning transformations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 service-list">
        <div className="grid grid-cols-1 gap-12">
          {SERVICES.map((service, index) => (
            <div 
              key={service.id} 
              id={service.id}
              className={`bg-brand-50 border border-brand-100 rounded-3xl shadow-lg overflow-hidden flex flex-col service-item ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              <div className="lg:w-1/2 h-64 lg:h-auto relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-brand-100 text-brand-600 mb-6 shadow-sm">
                  {service.icon}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">What's Included:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700">
                        <Check className="w-5 h-5 text-eco-500 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link 
                    to={`/contact?service=${service.id}`}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-md"
                  >
                    Book This Service
                  </Link>
                  <span className="text-sm text-slate-500 font-medium">
                     Available Weekly • Bi-Weekly • Monthly
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};