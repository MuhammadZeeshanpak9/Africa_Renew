import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    const section = sectionRef.current;
    
    if (!section) return;

    const ctx = gsap.context(() => {
      // Create scroll-driven animation timeline for pinning
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 0.8,
        },
      });

      // Exit animations for HERO overlay text going up and fading out as scroll building occurs
      scrollTl
        .to('.hero-overlay-content', {
          y: -150,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: 0.05
        }, 0)
        .to('.hero-bottom-text', {
          opacity: 1,
          y: -50,
          duration: 0.4,
          ease: 'power2.out',
        }, 0.5);

    }, section);

    return () => ctx.revert();
  }, []);

  // Split text into characters for premium staggered reveal
  const title1 = "REDEFINING";
  const title2 = "CONTINENTAL";
  
  const charVariants: Variants = {
    hidden: { opacity: 0, y: 100, rotateX: -60 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-white z-[5]"
    >
      {/* 2D Background removed - now global */}

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)] pointer-events-none" />

      {/* Main Content Layout */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full px-6 sm:px-10 lg:px-20 pt-32 pb-16 flex flex-col justify-between"
      >
        <div className="flex-1 flex flex-col justify-start max-w-7xl mx-auto w-full">
          
          <div className="w-full relative hero-overlay-content pt-10 md:pt-20">
            {/* Dynamic Intro Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
              className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 rounded-full bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-bold tracking-wider text-foreground uppercase">
                Building The Future
              </span>
            </motion.div>

            {/* Asymmetrical Premium Typography */}
            <div className="relative z-20 mix-blend-multiply">
              <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-foreground flex overflow-hidden">
                {title1.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={charVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 + index * 0.04 }}
                    className="inline-block origin-bottom"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mt-4 md:mt-2">
                <div className="h-0.5 w-16 md:w-32 bg-primary ml-2 rounded-full hidden md:block" />
                <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary flex overflow-hidden lg:ml-24">
                  {title2.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      variants={charVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 + index * 0.04 }}
                      className="inline-block origin-bottom"
                    >
                      {char}
                    </motion.span>
                  ))}
                </h1>
              </div>
            </div>

            {/* Subtext and Context */}
            <motion.div 
              className="mt-12 md:mt-20 max-w-xl md:ml-auto grid gap-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            >
              <p className="text-lg md:text-xl font-medium text-foreground/80 leading-relaxed border-l-4 border-primary pl-6 py-2">
                A synchronized ecosystem of leadership and infrastructure.
                Watch the transformation happen from the ground up as we turn vision into unified reality.
              </p>

              <div className="flex flex-wrap items-center gap-4 pl-6">
                <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-primary px-8 h-14 text-base font-semibold group transition-all duration-300">
                  Explore Movement
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full w-14 h-14 border-foreground/20 hover:border-primary hover:bg-primary/5">
                  <Globe className="w-5 h-5 text-foreground" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator & Progress Text (Static at bottom until scroll) */}
        <div className="w-full flex justify-between items-end pb-8 hero-overlay-content pointer-events-none">
          <div className="hidden md:block">
            <p className="text-xs font-bold tracking-widest text-foreground/50 uppercase mb-2">System Status</p>
            <p className="font-mono text-sm text-primary">INITIALIZING_GRID_v2.0</p>
          </div>
          
          <div className="flex flex-col items-center gap-4 mx-auto md:mx-0">
            <motion.div
              animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-[2px] h-16 bg-gradient-to-b from-transparent via-primary to-transparent relative overflow-hidden"
            >
              <div className="absolute w-full bg-primary shadow-[0_0_10px_2px_#4fc3f7]" />
            </motion.div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">Scroll to Build</span>
          </div>
        </div>
        
        {/* Hidden text that reveals during scroll */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none hero-bottom-text z-0 text-center px-6">
          <h2 className="text-[10vw] font-black text-black/5 mix-blend-overlay tracking-tighter outline-text uppercase leading-none">
            The Greatest 
            <br />
            African Project
          </h2>
        </div>
      </div>
    </section>
  );
}
