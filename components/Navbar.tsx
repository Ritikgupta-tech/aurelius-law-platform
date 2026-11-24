'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  User,
  Search,
  Volume2,
  VolumeX,
  Phone,
  Globe2,
} from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle acoustic sound feedback using Web Audio API (0 dependencies)
  const playHapticTone = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note, elegant chime
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // AudioContext muted or blocked
    }
  };

  const isHome = pathname === '/';
  const navBackground = scrolled
    ? 'bg-[#07182E]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-[#C6A36B]/20 py-3.5'
    : isHome
    ? 'bg-transparent py-5'
    : 'bg-[#07182E] border-b border-[#C6A36B]/20 py-4';

  const navLinks = [
    { label: 'The Firm', href: '/about' },
    { label: 'Practice Areas', href: '/practice-areas' },
    { label: 'Our Attorneys', href: '/attorneys' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Insights', href: '/insights' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBackground}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              onClick={playHapticTone}
              className="flex items-center gap-3 group shrink-0"
              aria-label="Aurelius & Co. Home"
            >
              <div className="w-9 h-9 border border-[#C6A36B] text-[#C6A36B] flex items-center justify-center rotate-45 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(198,163,107,0.35)]">
                <Scale size={18} className="-rotate-45" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-wider text-white font-medium group-hover:text-[#F8F5EF] transition-colors">
                  Aurelius <i className="text-[#C6A36B] not-italic">&</i> Co.
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#C6A36B] font-sans font-semibold">
                  Legal Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={playHapticTone}
                    className={`text-[10px] xl:text-[11px] whitespace-nowrap uppercase tracking-[0.14em] xl:tracking-[0.16em] font-medium transition-colors relative py-1 ${
                      isActive ? 'text-[#C6A36B]' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A36B] animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Icon Trigger */}
              <button
                onClick={() => {
                  playHapticTone();
                  setSearchModalOpen(true);
                }}
                className="p-2 text-slate-300 hover:text-[#C6A36B] transition-colors flex items-center gap-1.5 text-xs"
                title="Search (Cmd+K)"
              >
                <Search size={15} />
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-white/20 rounded-xs text-slate-400">
                  ⌘K
                </span>
              </button>

              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-slate-400 hover:text-[#C6A36B] transition-colors"
                title={soundEnabled ? 'Mute Chambers Audio Tone' : 'Enable Subtle Acoustic Feedback'}
              >
                {soundEnabled ? <Volume2 size={15} className="text-[#C6A36B]" /> : <VolumeX size={15} />}
              </button>

              <Link
                href="/portal"
                onClick={playHapticTone}
                className="text-[11px] uppercase tracking-[0.14em] font-medium text-slate-300 hover:text-[#C6A36B] flex items-center gap-1.5 transition-colors"
              >
                <User size={13} />
                Client Portal
              </Link>

              <Link
                href="/book-consultation"
                onClick={playHapticTone}
                className="px-5 py-2.5 bg-[#C6A36B] text-[#07182E] text-[11px] uppercase tracking-[0.14em] font-semibold flex items-center gap-2 hover:bg-[#d5b682] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(198,163,107,0.3)]"
              >
                Book Consultation
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Mobile Actions: Search Trigger & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="text-slate-300 hover:text-[#C6A36B] p-2"
                aria-label="Search site"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-200 hover:text-[#C6A36B] p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen / Slide Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#07182E] border-b border-[#C6A36B]/20 px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
            {/* Direct Chambers Call Banner */}
            <div className="p-3 bg-[#0B2340] border border-[#C6A36B]/30 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Globe2 size={14} className="text-[#C6A36B]" />
                <span>London & NY Chambers Active</span>
              </div>
              <a href="tel:+442079460912" className="text-[#C6A36B] font-mono font-bold flex items-center gap-1">
                <Phone size={12} /> Call
              </a>
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    playHapticTone();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs uppercase tracking-wider text-slate-200 hover:text-[#C6A36B] py-3 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/portal"
                onClick={() => {
                  playHapticTone();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 border border-[#C6A36B]/50 text-[#C6A36B] text-xs uppercase tracking-wider font-semibold"
              >
                Access Client Portal
              </Link>
              <Link
                href="/book-consultation"
                onClick={() => {
                  playHapticTone();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-3.5 bg-[#C6A36B] text-[#07182E] text-xs uppercase tracking-wider font-bold shadow-lg"
              >
                Book Executive Consultation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
