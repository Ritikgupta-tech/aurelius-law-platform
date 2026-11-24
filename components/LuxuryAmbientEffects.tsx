'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function LuxuryAmbientEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = (totalScroll / windowHeight) * 100;
        setScrollProgress(progress);
        setShowScrollTop(totalScroll > 500);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Champagne Gold Reading Progress Bar at top edge */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[120] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#A87948] via-[#C6A36B] to-[#F6F3ED] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(198,163,107,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Subdued ambient cursor spotlight (desktop non-touch only) */}
      {!isTouchDevice && (
        <div
          className="fixed pointer-events-none z-30 transition-opacity duration-300 hidden md:block"
          style={{
            transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(198,163,107,0.04) 0%, rgba(198,163,107,0) 70%)',
            borderRadius: '50%',
            opacity: mousePos.x > 0 ? 1 : 0,
          }}
        />
      )}

      {/* 3. Floating Scroll to Top Pill */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 p-3 bg-[#07182E]/90 hover:bg-[#C6A36B] text-[#C6A36B] hover:text-[#07182E] border border-[#C6A36B]/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <ArrowUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </>
  );
}
