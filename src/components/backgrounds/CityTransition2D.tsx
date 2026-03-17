import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface CityTransitionProps {
  scrollContainer?: React.RefObject<HTMLElement | null>;
}

export default function CityTransition2D({ scrollContainer }: CityTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup Framer Motion scroll tracking
  // We use useScroll linked to the target section or window
  const targetObj = scrollContainer || containerRef;
  const { scrollYProgress } = useScroll({
    target: targetObj,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress so animations feel less rigid
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Layer 1: Old City (Dilapidated, basic blocks)
  // Fades out slightly and moves down on scroll
  const oldCityOpacity = useTransform(smoothProgress, [0, 0.4, 0.8], [1, 0.8, 0.2]);
  const oldCityY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const oldCityScale = useTransform(smoothProgress, [0, 1], [1, 0.95]);

  // Layer 2: New City (Glowing, modern skyscrapers)
  // Fades in, scales up, and moves up
  const newCityOpacity = useTransform(smoothProgress, [0.2, 0.7, 1], [0, 0.8, 1]);
  const newCityY = useTransform(smoothProgress, [0, 1], ["10%", "0%"]);
  const newCityScale = useTransform(smoothProgress, [0, 1], [0.95, 1.05]);

  // Clip Path wipe effect for the new city
  const newCityClip = useTransform(
    smoothProgress, 
    [0.1, 0.9], 
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  // Construction Grid/Lines (Scaffolding that appears in the middle of transition)
  const scaffoldOpacity = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, 0.6, 0]);
  const scaffoldY = useTransform(smoothProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-background">
      
      {/* Background Ambient Glow */}
      <motion.div 
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,rgba(159,129,185,0.15),transparent_70%)]"
        style={{ opacity: newCityOpacity }}
      />

      {/* ----------- LAYER 1: OLD CITY ----------- */}
      <motion.div 
        className="absolute bottom-0 w-full h-[60vh] z-10 flex items-end justify-center"
        style={{ opacity: oldCityOpacity, y: oldCityY, scale: oldCityScale }}
      >
        <svg viewBox="0 0 1440 400" className="w-full h-full object-cover origin-bottom opacity-40 grayscale sepia-[0.3]">
          {/* Base ground layer */}
          <rect x="0" y="380" width="1440" height="20" fill="currentColor" />
          
          {/* Old Buildings - Blocky, simple, damaged */}
          <path d="M50 380 V250 H120 V380 Z" fill="currentColor" opacity="0.8" />
          <path d="M150 380 V180 H250 V380 Z" fill="currentColor" opacity="0.7" />
          <path d="M280 380 V120 H380 V150 H420 V380 Z" fill="currentColor" opacity="0.6" />
          <path d="M480 380 V200 L520 180 V380 Z" fill="currentColor" opacity="0.8" />
          <path d="M560 380 V100 H700 V120 H740 V380 Z" fill="currentColor" opacity="0.9" />
          
          <path d="M780 380 V160 H850 V380 Z" fill="currentColor" opacity="0.5" />
          <path d="M880 380 V220 H980 V380 Z" fill="currentColor" opacity="0.7" />
          <path d="M1020 380 V90 H1120 V140 H1160 V380 Z" fill="currentColor" opacity="0.8" />
          <path d="M1200 380 V240 H1300 V380 Z" fill="currentColor" opacity="0.6" />
          <path d="M1350 380 V170 H1420 V380 Z" fill="currentColor" opacity="0.7" />

          {/* Random old windows (dark) */}
          {[...Array(30)].map((_, i) => (
            <rect 
              key={`old-win-${i}`}
              x={100 + (i * 41) % 1200} 
              y={150 + (i * 67) % 200} 
              width="8" height="12" 
              fill="#000" 
              opacity="0.3" 
            />
          ))}
        </svg>
      </motion.div>

      {/* ----------- LAYER 1.5: SCAFFOLDING / CONSTRUCTION ----------- */}
      <motion.div
        className="absolute bottom-0 w-full h-[70vh] z-20"
        style={{ opacity: scaffoldOpacity, y: scaffoldY }}
      >
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(79,195,247,0.1)_1px,transparent_1px),linear-gradient(rgba(79,195,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black_80%)]" />
        
        {/* Animated Construction Laser Lines */}
        <motion.div 
          className="absolute bottom-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_#4fc3f7]"
          style={{ y: useTransform(smoothProgress, [0.3, 0.7], ["0vh", "-60vh"]) }}
        />
        <motion.div 
          className="absolute w-[2px] h-[60vh] bottom-0 left-1/4 bg-primary/40"
          style={{ scaleY: useTransform(smoothProgress, [0.3, 0.6], [0, 1]), originY: 1 }}
        />
        <motion.div 
          className="absolute w-[2px] h-[70vh] bottom-0 left-1/2 bg-secondary/40"
          style={{ scaleY: useTransform(smoothProgress, [0.4, 0.7], [0, 1]), originY: 1 }}
        />
        <motion.div 
          className="absolute w-[2px] h-[55vh] bottom-0 right-1/4 bg-primary/40"
          style={{ scaleY: useTransform(smoothProgress, [0.2, 0.5], [0, 1]), originY: 1 }}
        />
      </motion.div>


      {/* ----------- LAYER 2: NEW CITY ----------- */}
      <motion.div 
        className="absolute bottom-0 w-full h-[75vh] z-30 flex items-end justify-center drop-shadow-[0_-10px_30px_rgba(159,129,185,0.2)]"
        style={{ 
          opacity: newCityOpacity, 
          y: newCityY, 
          scale: newCityScale,
          clipPath: newCityClip 
        }}
      >
        <svg viewBox="0 0 1440 500" className="w-full h-full object-cover origin-bottom text-foreground">
          <defs>
            <linearGradient id="newCityGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9f81b9" />
              <stop offset="100%" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id="newCityGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4fc3f7" />
              <stop offset="100%" stopColor="currentColor" />
            </linearGradient>
          </defs>

          {/* New Modern Skyscrapers - Sleek, angular, overlapping */}
          
          {/* Back layer new buildings */}
          <path d="M120 500 L160 200 H280 L320 500 Z" fill="url(#newCityGrad1)" opacity="0.4" />
          <path d="M400 500 L420 150 H500 L540 500 Z" fill="url(#newCityGrad2)" opacity="0.3" />
          <path d="M800 500 L850 120 H950 L1000 500 Z" fill="url(#newCityGrad1)" opacity="0.4" />
          <path d="M1100 500 L1150 180 H1250 L1300 500 Z" fill="url(#newCityGrad2)" opacity="0.3" />

          {/* Front layer hero new buildings */}
          <path d="M200 500 V150 L250 100 L300 150 V500 Z" fill="currentColor" />
          <path d="M350 500 V220 L400 180 V500 Z" fill="currentColor" />
          <path d="M500 500 V80 L580 40 H680 V500 Z" fill="currentColor" />
          <path d="M720 500 V180 L760 140 H840 L880 180 V500 Z" fill="currentColor" />
          <path d="M920 500 V120 L960 80 H1020 V500 Z" fill="currentColor" />
          <path d="M1060 500 V250 H1180 V500 Z" fill="currentColor" />
          
          {/* Glowing Windows Patterns */}
          <g opacity="0.8">
            {[...Array(50)].map((_, i) => (
              <rect 
                key={`new-win-${i}`}
                x={220 + (i * 37) % 950} 
                y={100 + (i * 53) % 350} 
                width={4 + (i%3)*2} 
                height={15 + (i%2)*10} 
                fill={(i % 5 === 0) ? "#4fc3f7" : (i % 3 === 0) ? "#9f81b9" : "#ffffff"} 
                className="animate-pulse"
                style={{ animationDelay: `${(i % 5) * 0.5}s`, animationDuration: `${2 + (i % 3)}s` }}
              />
            ))}
          </g>
        </svg>
      </motion.div>

    </div>
  );
}
