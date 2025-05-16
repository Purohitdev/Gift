'use client';
import React from 'react';
import { Headphones, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupportSection = () => {
  return (
    <section className="pb-16 px-10">
      <div className="container px-4 flex flex-col items-center text-center">
        {/* Headset Icon */}
        <div className="mb-6 p-6 rounded-full bg-white/70 border border-[#12121226]">
          <Headphones className="h-10 w-10 text-primary" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2D2D2D]">Still Confused?</h2>
        <p className="text-muted-foreground max-w-md mt-2">
          Talk to real humans, no bots.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <a href="tel:+1234567890">
            <Button variant="outline" className="bg-white/40 border-[#12121253] flex items-center gap-2 ">
              <Phone size={18} />
              call us
            </Button>
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="bg-white/40 border-[#12121253] flex items-center gap-2 ">
              <MessageCircle size={18} />
              whatsapp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
