import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Calendar, MousePointerClick, Leaf, Facebook, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { SERVICES, TESTIMONIALS, WHY_CHOOSE_US, FAQS, SERVICE_AREAS_LIST } from '../constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    // Hero Animation
    const heroCtx = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
      gsap.from(".hero-image", {
        x: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out"
      });
    }, heroRef);

    // Steps Animation
    const stepsCtx = gsap.context(() => {
      const cards = gsap.utils.toArray('.step-card');
      cards.forEach((card: any, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1, 
          ease: "back.out(1.7)"
        });
      });
    }, stepsRef);

    // Services Animation
    const servicesCtx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReducedMotion) {
        gsap.from(".service-card-anim", {
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 85%",
            },
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          clearProps: "transform,opacity"
        });
      }
    }, servicesRef);

    // Why Choose Us Animation
    const whyUsCtx = gsap.context(() => {
      gsap.from(".why-us-card-anim", {
        scrollTrigger: {
          trigger: whyUsRef.current,
          start: "top 85%",
        },
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all" 
      });
    }, whyUsRef);

    // CTA Animation
    const ctaCtx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)"
      });
    }, ctaRef);

    return () => {
      heroCtx.revert();
      stepsCtx.revert();
      ctaCtx.revert();
      servicesCtx.revert();
      whyUsCtx.revert();
    };
  }, []);

  return (
    <div>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 120s linear infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.98); }
          }
          .animate-blink {
            animation: blink 2s ease-in-out infinite;
          }
           .pop-up-card {
             transition: transform 0.3s ease, box-shadow 0.3s ease;
           }
           .pop-up-card:hover {
             transform: translateY(-8px);
             box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
           }
        `}
      </style>
      
      {/* Hero Section - Reduced height from min-h-screen to min-h-[85vh] to reduce header gap */}
      <section ref={heroRef} className="relative bg-brand-50 min-h-[85vh] w-full flex items-center justify-center m-0 p-0">
        
        {/* Background decorative elements wrapper - Overflow hidden here to contain shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-brand-100 rounded-full blur-3xl opacity-30"></div>
           <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center h-full py-10 md:py-0">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 w-full max-w-7xl">
            
            {/* Left Content */}
            <div className="lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-2 lg:space-y-5 hero-content">
              <div className="inline-block bg-white text-brand-600 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-sm border border-brand-100 animate-blink mb-1">
                100% Recommendation on Facebook
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-900 via-brand-600 to-brand-500 pb-1">
                KL Softwash LLC
              </h1>
              
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-slate-600 leading-tight">
                Experience the Joy of a <span className="text-brand-500">Spotless Home</span>
              </h2>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-md lg:max-w-xl leading-relaxed">
                Professional, reliable, and eco-friendly cleaning services tailored to your lifestyle.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full text-center font-bold text-base lg:text-lg shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  Book Now
                </Link>
                <Link
                  to="/services"
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-full text-center font-semibold text-base lg:text-lg transition-all w-full sm:w-auto"
                >
                  View Services
                </Link>
              </div>

            </div>

            {/* Right Image - Constrained Height for 100svh fit */}
            <div className="lg:w-1/2 relative hero-image flex justify-center lg:justify-end mt-4 lg:mt-0">
               <div className="absolute inset-0 bg-brand-200 rounded-[2rem] rotate-3 transform scale-95 opacity-50 blur-2xl"></div>
              <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-xl">
                <img 
                    src="https://images.unsplash.com/photo-1639765111755-6979645e1367?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Living room clean" 
                    className="relative rounded-3xl shadow-2xl z-10 w-full object-cover h-[25vh] sm:h-[35vh] lg:h-[45vh] animate-float"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl shadow-xl z-20 flex items-center gap-2 animate-bounce hidden sm:flex border border-brand-50">
                    <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-sm">Satisfaction Guaranteed</p>
                        <p className="text-[10px] text-slate-500">Or we reclean for free</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-24 bg-brand-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4 opacity-80">
              <div className="h-px w-12 bg-white/50"></div>
              <span className="uppercase tracking-widest text-sm font-semibold text-brand-100">How to get started</span>
              <div className="h-px w-12 bg-white/50"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Book in under 60 seconds!</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group step-card">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-brand-800/20 transform group-hover:scale-110 transition-transform duration-300">
                <MousePointerClick className="w-10 h-10 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Pick a cleaning type</h3>
              <p className="text-brand-100 leading-relaxed max-w-xs text-lg">Choose the service type that best fits your needs.</p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:block absolute top-10 left-[28%] w-[12%] text-brand-300 opacity-40 step-card">
               <svg viewBox="0 0 100 30" fill="none" stroke="currentColor" className="w-full">
                 <path d="M0,15 Q50,-10 100,15" strokeWidth="2" strokeDasharray="4 4" />
                 <path d="M90,10 L100,15 L90,20" strokeWidth="2" />
               </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group step-card">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-brand-800/20 transform group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-10 h-10 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Pick a date and time</h3>
              <p className="text-brand-100 leading-relaxed max-w-xs text-lg">Choose a time that you want. Same day service available.</p>
            </div>

             {/* Arrow 2 */}
             <div className="hidden md:block absolute top-10 right-[28%] w-[12%] text-brand-300 opacity-40 step-card">
               <svg viewBox="0 0 100 30" fill="none" stroke="currentColor" className="w-full">
                 <path d="M0,15 Q50,-10 100,15" strokeWidth="2" strokeDasharray="4 4" />
                 <path d="M90,10 L100,15 L90,20" strokeWidth="2" />
               </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group step-card">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-brand-800/20 transform group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-10 h-10 text-brand-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Watch us clean</h3>
              <p className="text-brand-100 leading-relaxed max-w-xs text-lg">Let the professionals do your dirty work.</p>
            </div>
          </div>
          
          <div className="text-center mt-16">
             <Link 
                to="/contact" 
                className="inline-block bg-white text-brand-600 px-10 py-4 rounded-full font-bold shadow-lg hover:bg-brand-50 transition transform hover:-translate-y-1 step-card text-lg"
             >
                Start Booking Now
             </Link>
          </div>
        </div>
      </section>

      {/* Services Preview - Limited to first 4 */}
      <section ref={servicesRef} className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Cleaning Services</h2>
            <p className="text-slate-600 text-lg">We offer a full range of cleaning solutions for every need. Custom plans available.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.slice(0, 4).map((service, index) => (
              <div 
                key={service.id} 
                className="bg-brand-50 border border-brand-100 rounded-2xl shadow-sm pop-up-card flex flex-col overflow-hidden service-card-anim group"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-brand-600 shadow-sm transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 hover:text-brand-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-500 text-base mb-4 line-clamp-3 flex-grow">{service.description}</p>
                  <div className="mt-auto pt-4 border-t border-brand-100">
                    <Link to="/services" className="text-brand-500 font-semibold text-base flex items-center gap-1 hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-brand-600 bg-brand-100 hover:bg-brand-200 transition">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyUsRef} className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why KL Softwash?</h2>
            <p className="text-slate-600 text-lg">
              We're not just another cleaning company. We're a team of dedicated professionals committed to excellence, sustainability, and your peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <div 
                key={item.title} 
                className="p-6 rounded-2xl bg-brand-50 border border-brand-100 flex flex-row items-start gap-5 why-us-card-anim group hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-brand-500 shadow-sm shrink-0 border border-brand-100 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-10">
          <div className="text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by Locals</h2>
             <div className="flex items-center justify-center gap-2 mb-2">
               <div className="flex text-yellow-400">
                 {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
               </div>
               <span className="font-bold text-slate-900">5.0/5</span>
             </div>
             <p className="text-slate-500">Based on Facebook Reviews</p>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full">
           <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
           <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
           
           <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
              {/* Render loop 3 times to ensure smooth scrolling */}
              {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, index) => (
                <div key={`${t.id}-${index}`} className="w-[320px] mx-4 bg-brand-50 p-6 rounded-3xl shadow-sm relative border border-brand-100 hover:shadow-md transition-shadow shrink-0 flex flex-col">
                  <a 
                    href={t.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute top-6 right-6 text-[#1877F2] hover:scale-110 transition-transform"
                    title="View on Facebook"
                  >
                     <Facebook className="w-5 h-5 fill-current" />
                  </a>
                  
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} fill="currentColor" className="w-3 h-3" />)}
                    </div>
                    <a 
                      href={t.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-medium text-[#1877F2] bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Verified by Facebook
                    </a>
                  </div>
                  
                  <p className="text-slate-800 font-bold mb-4 text-base leading-relaxed flex-grow">"{t.content}"</p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-24 bg-slate-100">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-brand-600 font-bold uppercase tracking-wider text-sm">Common Questions</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Frequently Asked Questions</h2>
                <p className="text-slate-600 text-lg">Everything you need to know about our services and process.</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-4">
                {FAQS.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 faq-item ${
                            openFaqIndex === index 
                            ? 'border-brand-500 shadow-lg ring-1 ring-brand-100' 
                            : 'border-slate-200 shadow-sm hover:border-brand-300'
                        }`}
                    >
                        <button
                            onClick={() => toggleFaq(index)}
                            className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                        >
                            <span className={`text-xl md:text-2xl font-bold transition-colors ${openFaqIndex === index ? 'text-brand-600' : 'text-slate-900'}`}>
                                {faq.question}
                            </span>
                            {openFaqIndex === index ? (
                                <ChevronUp className="w-6 h-6 text-brand-600" />
                            ) : (
                                <ChevronDown className="w-6 h-6 text-slate-400" />
                            )}
                        </button>
                        
                        <div 
                            className={`px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                                openFaqIndex === index ? 'max-h-[600px] opacity-100 pb-8' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <p className="text-slate-700 text-lg leading-relaxed border-t border-slate-100 pt-6">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
             <div className="text-center mt-12">
                <p className="text-slate-500 mb-4">Still have questions?</p>
                <Link to="/contact" className="text-brand-600 font-bold flex items-center justify-center gap-2 hover:underline">
                    Contact Support <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
      </section>

      {/* Areas We Serve - Modified Background Color */}
      <section className="py-20 bg-brand-600 text-white relative overflow-hidden">
        {/* Background decorative map-like elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-brand-500 rounded-full"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border-2 border-brand-400 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Areas We Serve</h2>
            <p className="text-brand-200 text-lg">
              Proudly providing top-rated exterior cleaning services across Southwest Florida.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             {SERVICE_AREAS_LIST.map((area, index) => (
               <div key={index} className="bg-brand-800/50 backdrop-blur-sm border border-brand-700 p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors group">
                  <MapPin className="w-4 h-4 text-brand-400 group-hover:text-white transition-colors" />
                  <span className="font-semibold">{area}</span>
               </div>
             ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-brand-300 text-sm">Don't see your area listed? Call us at <a href="tel:+12395376973" className="text-white font-bold hover:underline">239-537-6973</a></p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-900 cta-content">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for a Cleaner Home?</h2>
          <div className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto flex flex-col gap-2">
            <p className="font-bold">Book your service in less than 60 seconds.</p>
            <p className="text-sm font-semibold opacity-90">No credit card required to request a quote.</p>
          </div>
          <Link
            to="/contact"
            className="bg-brand-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-brand-700 transition transform hover:-translate-y-1 inline-block"
          >
            Get My Free Estimate
          </Link>
        </div>
      </section>
    </div>
  );
};