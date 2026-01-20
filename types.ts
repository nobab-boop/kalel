import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  includes: string[];
  icon: React.ReactNode;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  link?: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  date: string;
  time: string;
  instructions: string;
}