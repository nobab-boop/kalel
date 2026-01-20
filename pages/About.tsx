import React, { useEffect, useRef } from 'react';
import { UserCheck, Heart, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-header > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from(".about-image", {
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 75%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".about-text", {
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 75%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      });

      // Value Cards animation removed to fix visibility issue
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div className="bg-brand-900 py-16 lg:py-24 about-header relative overflow-hidden">
         {/* Bottom Gradient */}
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-800 to-transparent opacity-50"></div>
         
         <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">More Than Just Cleaning</h1>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto">
               We founded KL Softwash LLC with a simple mission: to give busy families their weekends back, while providing honest work for our community.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12 about-content">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative about-image max-w-md mx-auto">
               <img 
                  src="https://i.imgur.com/pvHyvrU.jpeg" 
                  alt="Our Team" 
                  className="rounded-[2rem] shadow-2xl z-10 relative w-full"
               />
               <div className="absolute top-6 -left-6 w-full h-full border-4 border-brand-100 rounded-[2rem] -z-0 hidden md:block"></div>
            </div>
            <div className="about-text">
               <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
               <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                     KL Softwash LLC is a professional exterior cleaning company dedicated to providing safe, effective, and reliable soft washing and pressure washing services. We specialize in restoring and protecting homes and commercial properties by removing dirt, mold, mildew, algae, and other organic buildup without causing damage to surfaces.
                  </p>
                  <p>
                     Our team uses industry-approved soft washing techniques, eco-friendly cleaning solutions, and modern equipment to deliver long-lasting results. Whether it’s roofs, siding, driveways, patios, or other exterior surfaces, we take pride in our attention to detail and commitment to quality workmanship.
                  </p>
                  <p>
                     At KL Softwash LLC, customer satisfaction is our top priority. We believe in honest communication, dependable service, and treating every property as if it were our own. Our goal is to help our customers maintain clean, attractive, and well-protected properties year-round.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-slate-50 py-20 values-section">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm value-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-500 border border-brand-100">
                     <UserCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">People First</h3>
                  <p className="text-slate-600 leading-relaxed">We treat our staff with respect and pay above-market rates, which translates to better service for you.</p>
               </div>
               <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm value-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-500 border border-brand-100">
                     <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Community Focused</h3>
                  <p className="text-slate-600 leading-relaxed">We donate free cleanings to cancer patients and local shelters every month.</p>
               </div>
               <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm value-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-500 border border-brand-100">
                     <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence</h3>
                  <p className="text-slate-600 leading-relaxed">We don't cut corners, we clean them. Our 50-point checklist ensures nothing is missed.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};