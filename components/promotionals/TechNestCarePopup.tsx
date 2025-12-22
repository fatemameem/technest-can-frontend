'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const POPUP_KEY = 'technest-care-popup';
const EXPIRY_HOURS = 2;

interface PopupData {
  dismissed: boolean;
  timestamp: number;
}

export function TechNestCarePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup should be shown
    const checkPopupStatus = () => {
      try {
        const stored = localStorage.getItem(POPUP_KEY);
        
        if (!stored) {
          // First time - show after 3 seconds
          const timer = setTimeout(() => setIsOpen(true), 3000);
          return () => clearTimeout(timer);
        }

        const data: PopupData = JSON.parse(stored);
        const now = Date.now();
        const expiryTime = data.timestamp + (EXPIRY_HOURS * 60 * 60 * 1000); // 2 hours in milliseconds

        if (now > expiryTime) {
          // Expired - show popup again after 3 seconds
          const timer = setTimeout(() => setIsOpen(true), 3000);
          return () => clearTimeout(timer);
        }
        
        // Not expired yet - don't show
      } catch (error) {
        console.error('Error reading popup status:', error);
        // On error, show popup
        const timer = setTimeout(() => setIsOpen(true), 3000);
        return () => clearTimeout(timer);
      }
    };

    checkPopupStatus();
  }, []);

  const handleClose = () => {
    // Save dismissal with current timestamp
    const data: PopupData = {
      dismissed: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(POPUP_KEY, JSON.stringify(data));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl p-0 overflow-hidden border-cyan-500/20 bg-slate-950">
        <DialogHeader className="sr-only">
          <DialogTitle>Tech-Nest Care - Free Trial Offer</DialogTitle>
          <DialogDescription>
            Discover our AI-assisted cybersecurity monitoring platform with a free trial until March 31, 2026.
          </DialogDescription>
        </DialogHeader>

        {/* Promotional Image - No forced aspect ratio, image determines size */}
        <div className="relative w-full">
          <Image
            src="/images/technest-care.jpeg"
            alt="Tech-Nest Care - AI-assisted cybersecurity monitoring platform with free trial until March 31, 2026"
            width={768}
            height={1024}
            className="w-full h-auto max-h-[80vh]"
            priority
            quality={95}
          />
        </div>

        {/* Action Button - Overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent">
          <Link href="/contact?subject=Request a demo of Tech-Nest Care" onClick={handleClose}>
            <Button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 text-sm lg:text-lg shadow-lg shadow-cyan-500/20 transition-all duration-300"
              size="lg"
            >
              Contact Us - Request Your Free Trial
            </Button>
          </Link>
          <p className="text-center text-xs sm:text-sm text-slate-400 mt-3">
            Free trial available until <span className="text-cyan-400 font-medium">March 31, 2026</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}