import React from 'react';
import { 
  Home, Briefcase, Sparkles, Truck, Box, ShieldCheck, Clock, UserCheck, 
  Leaf, Headphones, Users, CalendarClock, Sliders,
  Waves, Umbrella, Footprints, AlignJustify, CloudRain, Layers, Package
} from 'lucide-react';
import { Service, Testimonial } from './types';

export const SERVICES: Service[] = [
  {
    id: 'roof',
    title: 'Roof Softwashing',
    description: 'Safely removes algae, moss, lichen, and black streaks. Extends roof lifespan with a non-pressure, manufacturer-approved method.',
    includes: ['Algae & Moss Removal', 'Asphalt, Tile & Metal', 'Non-Pressure Method', 'Black Streak Removal'],
    icon: <Home className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1704644067083-a1acb57d5b44?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'exterior',
    title: 'House Exterior Softwashing',
    description: 'Full exterior wash using low-pressure cleaning. Safe for vinyl, stucco, brick, and wood.',
    includes: ['Mold & Mildew Removal', 'Vinyl & Stucco', 'Painted Surfaces', 'Dirt & Pollen Removal'],
    icon: <Waves className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'driveway',
    title: 'Driveway & Sidewalk Cleaning',
    description: 'Removes oil stains, dirt, algae, and tire marks. Improves curb appeal and safety.',
    includes: ['Oil Stain Removal', 'Concrete & Pavers', 'Tire Mark Removal', 'Safer Walking Surfaces'],
    icon: <Footprints className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1591807104244-782609d50a70?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'patio',
    title: 'Patio Cleaning',
    description: 'Softwash treatment for patios and outdoor living areas. Eliminates slippery algae and mold.',
    includes: ['Concrete & Brick', 'Stone & Pavers', 'Slip Hazard Removal', 'Gentle Cleaning'],
    icon: <Umbrella className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1621506821950-f5c98fa9ff62?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'fence',
    title: 'Fence Cleaning',
    description: 'Cleans wood, vinyl, and composite fences. Restores original appearance without damage.',
    includes: ['Wood, Vinyl & Composite', 'Mold Removal', 'Discoloration Treatment', 'Build-up Removal'],
    icon: <AlignJustify className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1530328881134-8c525cc57036?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'gutter',
    title: 'Gutter Cleaning & Brightening',
    description: 'Complete debris removal and exterior brightening to remove tiger stripes and improve flow.',
    includes: ['Debris Removal', 'Tiger Stripe Removal', 'Improved Water Flow', 'Exterior Brightening'],
    icon: <CloudRain className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1654531015087-8cc3d04d1b2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'commercial',
    title: 'Commercial Softwashing',
    description: 'Professional cleaning for storefronts, office buildings, warehouses, and HOA properties.',
    includes: ['Storefronts', 'Office Buildings', 'Apartment Complexes', 'HOA Properties'],
    icon: <Briefcase className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'algae',
    title: 'Roof & Exterior Algae Treatment',
    description: 'Preventative treatment to slow regrowth and provide long-lasting protection.',
    includes: ['Preventative Care', 'Slows Regrowth', 'Long-lasting Protection', 'Maintenance Plans'],
    icon: <ShieldCheck className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1587061633437-187ac80e8e7a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'paver',
    title: 'Paver & Stone Softwashing',
    description: 'Gentle cleaning for decorative stone. Removes organic growth without etching.',
    includes: ['Decorative Stone', 'No Etching', 'Organic Growth Removal', 'Sealing Prep'],
    icon: <Layers className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1681241942875-7a1ea65899b4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'bundle',
    title: 'Multi-Surface Property Wash',
    description: 'Bundle service for full property cleaning. Comprehensive clean for your entire home exterior.',
    includes: ['Full Property Clean', 'Bundle Pricing', 'Multiple Surfaces', 'Complete Transformation'],
    icon: <Package className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Debbie Rosine',
    role: 'Homeowner',
    content: 'Right off the bat, in my opinion, there is nothing better than a family owned company, so I will ALWAYS highly recommend! They make you feel like family and give it their all. They did an amazing job on my home and driveway! Dirt & grime gone from the home, and all stains from the driveway gone! Will definitely have them return in the future',
    rating: 5,
    avatar: 'https://picsum.photos/100/100?random=11',
    link: 'https://www.facebook.com/share/p/1872fUCWPF/'
  },
  {
    id: '2',
    name: 'Nick Jagger',
    role: 'Homeowner',
    content: 'Highly recommended! Kenny came out and did an amazing job pressure washing my home, he went above and beyond, very detailed and friendly. I recommend this company for anyone that needs pressure washing! Locally owned and operated too! Will be doing business again in the future, thanks again!',
    rating: 5,
    avatar: 'https://picsum.photos/100/100?random=12',
    link: 'https://www.facebook.com/share/p/1GDrgfra48/'
  },
  {
    id: '3',
    name: 'Sky Nolan',
    role: 'Customer',
    content: 'If you’re looking for reliable, hard working, reliable and beautiful work, Kenny is your man! He responded in a very timely manner and made sure I was happy with his services before he even packed up to leave! Thank you for making my driveway look brand new!! We will definitely be contacting you again!',
    rating: 5,
    avatar: 'https://picsum.photos/100/100?random=13',
    link: 'https://www.facebook.com/share/p/183rRF8nxU/'
  },
  {
    id: '4',
    name: 'Timothy McLenon',
    role: 'Repeat Customer',
    content: 'I am extremely pleased with the service provided by Kenny @ KL Softwash, LLC. After an outstanding initial job, I didn\'t hesitate to call them back for a second pressure washing task. Once again, they exceeded my expectations! Kenny was punctual, professional, and thorough. My property looks amazing.',
    rating: 5,
    avatar: 'https://picsum.photos/100/100?random=14',
    link: 'https://www.facebook.com/share/p/1LTGpRr6uh/'
  }
];

export const TRUST_SIGNALS = [
  {
    id: 'licensed',
    title: 'Licensed & Insured',
    description: 'Full liability insurance for your peace of mind.',
    icon: <ShieldCheck className="w-8 h-8 text-eco-500" />
  },
  {
    id: 'background',
    title: 'Vetted Staff',
    description: 'Every cleaner undergoes strict background checks.',
    icon: <UserCheck className="w-8 h-8 text-eco-500" />
  },
  {
    id: 'satisfaction',
    title: '100% Guarantee',
    description: 'Not happy? We will re-clean for free within 24 hours.',
    icon: <Clock className="w-8 h-8 text-eco-500" />
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Personalized Service",
    description: "Tailored to your exact specifications, ensuring every detail is handled with care.",
    icon: <Sliders className="w-6 h-6" />
  },
  {
    title: "Green Cleaning",
    description: "Our team only use environmentally safe products and techniques, providing you with a healthy and sustainable clean for your home or business.",
    icon: <Leaf className="w-6 h-6" />
  },
  {
    title: "Support",
    description: "Our Highly trained support team is on call for you through our dedicated direct texting line from 8am-7pm.",
    icon: <Headphones className="w-6 h-6" />
  },
  {
    title: "Licensed and Insured",
    description: "Rest easy knowing we are fully insured. We provide all up to date documentation. We can also provide a list of references.",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    title: "Qualified Labor",
    description: "Kind, energetic and hard working individuals. Our team is well guided through all of our processes to be on point.",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Recurring Cleanings",
    description: "Ease of scheduling for Weekly, Biweekly and Monthly cleanings.",
    icon: <CalendarClock className="w-6 h-6" />
  }
];

export const FAQS = [
  {
    question: "Are your cleaning solutions safe for my home, family and pets?",
    answer: "Absolutely. We use only EPA Safer Choice and Green Seal certified, plant-based formulas. Our softwash methods reduce chemical usage compared to traditional methods—tough on grime but safe for kids, pets, and your landscape. All Safety Data Sheets (SDS) available upon request."
  },
  {
    question: "Do I need to be home during the service?",
    answer: "No, it's entirely up to you. Many of our clients prefer to go about their day while we handle the exterior cleaning. Just let us know how to access the property (e.g., unlocked gates) and ensure water access, and we'll take care of the rest."
  },
  {
    question: "Does your cleaning include stain removal?",
    answer: "Yes. Our cleaning services include treating organic spots and stains like algae, mold, and mildew. For tough surface stains on driveways like oil or rust, we use specialized treatments to restore the surface appearance."
  },
  {
    question: "Can you treat exterior odors and mildew smells?",
    answer: "Yes. Our exclusive softwash treatments eliminate organic growth and bacteria deep in the pores of your siding or roof. This removes the source of offensive odors, leaving your home's exterior fresh and sanitized."
  },
  {
    question: "What do I have to do in preparation of my service?",
    answer: "We typically ask 3 things from our clients: Close all windows and doors tightly. Remove small breakables or delicate items from the patio/porch areas we will be cleaning. Ensure the outdoor water spigots are accessible."
  },
  {
    question: "Are you licensed and insured?",
    answer: "Yes. KL Softwash LLC is fully licensed and insured with comprehensive Liability Insurance. All team members are background-checked and trained for your peace of mind."
  }
];

export const SERVICE_AREAS_LIST = [
  "Naples",
  "North Naples",
  "Bonita Springs",
  "Estero",
  "Marco Island",
  "Golden Gate",
  "Vineyards",
  "Lely Resort",
  "Pelican Bay",
  "Park Shore"
];