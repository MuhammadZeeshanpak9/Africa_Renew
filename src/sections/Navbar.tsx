import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Target, Users, Layout, BarChart, Rocket,
  Globe
} from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, any> = {
  Target,
  Users,
  Layout,
  BarChart,
  Rocket
};

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nav,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: 'expo.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* DESKTOP SLIM SIDEBAR */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 h-screen w-20 z-50 hidden lg:flex flex-col items-center bg-white/40 backdrop-blur-2xl border-r border-primary/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        {/* Sidebar Header: Logo */}
        <div className="py-10">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }}
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-bold text-xl drop-shadow-sm">A</span>
            </div>
          </a>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 flex flex-col items-center gap-4 px-2">
          {NAV_LINKS.map((link, index) => {
            const Icon = iconMap[link.icon as string] || Target;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:bg-white/60"
              >
                <div className={`relative z-10 transition-colors duration-300 ${hoveredIndex === index ? 'text-primary scale-110' : 'text-muted-foreground'}`}>
                  <Icon size={22} />
                </div>

                {/* Tooltip-style Label */}
                <div className={`absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl`}>
                  {link.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
                </div>

                {/* Active Indicator */}
                {hoveredIndex === index && (
                  <motion.div 
                    layoutId="sidebar-accent"
                    className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="pb-10 flex flex-col items-center gap-6">
          <a
            href="#cta"
            onClick={(e) => { e.preventDefault(); scrollToSection('#cta'); }}
            className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg shadow-foreground/10 hover:bg-primary transition-colors group"
          >
            <Rocket size={20} className="group-hover:translate-y-[-2px] transition-transform" />
          </a>

          <div className="text-muted-foreground/20 hover:text-primary transition-colors duration-500">
            <Globe size={18} />
          </div>
        </div>
      </nav>

      {/* MOBILE TOP BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden p-4 flex items-center justify-between pointer-events-none">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center pointer-events-auto shadow-lg shadow-primary/20">
          <span className="text-white font-bold">A</span>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl border border-white flex items-center justify-center pointer-events-auto shadow-xl"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-bold text-xl">Africa<span className="text-primary italic">Renew</span></span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-primary/5 text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              {NAV_LINKS.map((link, i) => {
                const Icon = iconMap[link.icon as string] || Target;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="flex items-center gap-6 text-3xl font-bold text-foreground group"
                  >
                    <Icon className="text-primary group-hover:scale-110 transition-transform" size={32} />
                    {link.label}
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-auto p-10 bg-primary/5 rounded-[40px] text-center">
              <h3 className="text-xl font-bold mb-4">Start Your Journey</h3>
              <a
                href="#cta"
                onClick={(e) => { e.preventDefault(); scrollToSection('#cta'); }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30"
              >
                Get Started <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
