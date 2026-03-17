import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nav,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'expo.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  // Magnetic hover effect setup
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    setHoveredIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(e.currentTarget, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredIndex(null);
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 pointer-events-none flex justify-center"
      >
        <div
          ref={pillRef}
          className={`pointer-events-auto flex items-center justify-between transition-all duration-700 ease-out will-change-transform ${
            isScrolled
              ? 'w-full max-w-4xl py-2 px-4 md:px-6 bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full border border-white/40 translate-y-2'
              : 'w-full max-w-6xl py-4 px-6 md:px-10 bg-transparent border-transparent translate-y-0'
          }`}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="flex items-center gap-3 group relative z-10"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center overflow-hidden">
              <span className="text-white font-bold text-lg leading-none transform group-hover:scale-110 transition-transform duration-500">
                A
              </span>
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">
              Africa<span className="text-primary font-bold">Next</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 relative">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                  hoveredIndex === index ? 'text-white' : 'text-foreground'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-primary/90 rounded-full -z-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 relative z-10">
            <a
              href="#cta"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#cta');
              }}
              className="hidden md:inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-primary transition-colors duration-500"
            >
              Get Started
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Creative Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-3xl flex flex-col justify-between overflow-hidden"
          >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-secondary/20 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

            <div className="flex justify-between items-center p-6 md:p-10 relative z-10">
              <span className="font-semibold text-xl tracking-tight">
                Africa<span className="text-primary font-bold">Next</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 container mx-auto relative z-10">
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 40, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                    className="overflow-hidden"
                  >
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="group flex items-baseline gap-4 text-4xl sm:text-5xl md:text-7xl font-bold text-foreground py-2"
                    >
                      <span className="text-sm font-medium text-primary/50 tabular-nums">0{index + 1}</span>
                      <span className="group-hover:text-primary transition-colors duration-500">
                        {link.label}
                      </span>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="p-8 md:p-16 relative z-10"
            >
              <a
                href="#cta"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#cta');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-4 px-8 py-5 bg-foreground text-background text-lg font-medium rounded-2xl hover:bg-primary transition-all duration-500 group"
              >
                <span>Get Started</span>
                <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
