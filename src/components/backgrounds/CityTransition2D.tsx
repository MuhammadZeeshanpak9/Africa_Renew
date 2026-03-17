import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function CityTransition2D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup Framer Motion scroll tracking for the whole page
  const { scrollYProgress } = useScroll();

  // Smooth the scroll progress so animations feel less rigid
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Layer 1: Old City (Dilapidated, basic blocks)
  // Visible at start, fades out specifically between 10% and 50% scroll
  const oldCityOpacity = useTransform(smoothProgress, [0, 0.2, 0.5], [1, 1, 0]);
  const oldCityY = useTransform(smoothProgress, [0, 0.5], ["0%", "10%"]);
  const oldCityScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);

  // Layer 2: New City (Glowing, modern skyscrapers)
  // Starts appearing around 20% scroll, fully realized by 80%
  const newCityOpacity = useTransform(smoothProgress, [0.2, 0.6, 1], [0, 1, 1]);
  const newCityY = useTransform(smoothProgress, [0, 0.5, 1], ["10%", "5%", "0%"]);
  const newCityScale = useTransform(smoothProgress, [0, 1], [0.95, 1.05]);

  // Clip Path wipe effect for the new city - matches the transformation start
  const newCityClip = useTransform(
    smoothProgress, 
    [0.2, 0.7], 
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  // Construction Grid/Lines (Scaffolding that appears in the middle of transition)
  const scaffoldOpacity = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, 0.6, 0]);
  const scaffoldY = useTransform(smoothProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-white">
      
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
        <svg viewBox="0 0 1440 400" className="w-full h-full object-cover origin-bottom opacity-20 grayscale brightness-50">
          {/* Base ground layer */}
          <rect x="0" y="380" width="1440" height="20" fill="currentColor" />
          
          {/* Old Buildings - Blocky, simple, damaged */}
          <path d="M50 380 V250 H120 V380 Z" fill="#1A1A1A" opacity="0.8" />
          <path d="M150 380 V180 H250 V380 Z" fill="#2A2A2A" opacity="0.7" />
          <path d="M280 380 V120 H380 V150 H420 V380 Z" fill="#1F1F1F" opacity="0.6" />
          <path d="M480 380 V200 L520 180 V380 Z" fill="#262626" opacity="0.8" />
          <path d="M560 380 V100 H700 V120 H740 V380 Z" fill="#151515" opacity="0.9" />
          
          <path d="M780 380 V160 H850 V380 Z" fill="#1A1A1A" opacity="0.5" />
          <path d="M880 380 V220 H980 V380 Z" fill="#222222" opacity="0.7" />
          <path d="M1020 380 V90 H1120 V140 H1160 V380 Z" fill="#1F1F1F" opacity="0.8" />
          <path d="M1200 380 V240 H1300 V380 Z" fill="#2A2A2A" opacity="0.6" />
          <path d="M1350 380 V170 H1420 V380 Z" fill="#1A1A1A" opacity="0.7" />

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
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(79,195,247,0.08)_1.5px,transparent_1.5px),linear-gradient(rgba(79,195,247,0.08)_1.5px,transparent_1.5px)] bg-[size:60px_60px] md:bg-[size:100px_100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(79,195,247,0.04)_1px,transparent_1px),linear-gradient(rgba(79,195,247,0.04)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:25px_25px]" />
        
        {/* Construction Visuals - Cranes & Scaffolding */}
        <svg viewBox="0 0 1440 600" className="absolute bottom-0 w-full h-[600px] text-primary/30">
          <defs>
            <pattern id="scaffoldPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 0 L40 40 M40 0 L0 40 M0 20 H40 M20 0 V40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Scaffolding Blocks */}
          <rect x="200" y="200" width="100" height="400" fill="url(#scaffoldPattern)" />
          <rect x="550" y="100" width="120" height="500" fill="url(#scaffoldPattern)" />
          <rect x="950" y="150" width="80" height="450" fill="url(#scaffoldPattern)" />

          {/* Construction Cranes */}
          <g className="crane-1">
            <motion.g
              style={{ 
                rotate: useTransform(smoothProgress, [0.2, 0.6], [0, -15]),
                originX: "400px",
                originY: "500px"
              }}
            >
              <path d="M380 600 V150 H420 V600" fill="currentColor" opacity="0.4" />
              <path d="M400 150 L600 120 V140 L400 160 Z" fill="currentColor" opacity="0.6" />
              <path d="M400 150 L250 165 V175 L400 160 Z" fill="currentColor" opacity="0.3" />
            </motion.g>
          </g>

          <g className="crane-2">
            <motion.g
              style={{ 
                rotate: useTransform(smoothProgress, [0.3, 0.7], [0, 20]),
                originX: "1100px",
                originY: "500px"
              }}
            >
              <path d="M1080 600 V80 H1120 V600" fill="currentColor" opacity="0.4" />
              <path d="M1100 80 L800 100 V120 L1100 100 Z" fill="currentColor" opacity="0.6" />
              <path d="M1100 80 L1200 70 V80 L1100 90 Z" fill="currentColor" opacity="0.3" />
            </motion.g>
          </g>
        </svg>

        {/* Animated Construction Laser Lines */}
        <motion.div 
          className="absolute bottom-0 w-full h-[3px] bg-primary/60 shadow-[0_0_20px_#4fc3f7] z-30"
          style={{ y: useTransform(smoothProgress, [0.2, 0.8], ["0vh", "-75vh"]) }}
        />
        
        {/* Floating Innovation Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-secondary rounded-full shadow-[0_0_10px_#4fc3f7]"
              initial={{ x: `${Math.random() * 100}%`, y: "100%", opacity: 0 }}
              animate={{ 
                y: ["100%", "20%"], 
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{ 
                duration: 3 + Math.random() * 4, 
                repeat: -1, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
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
          <path d="M200 500 V150 L250 100 L300 150 V500 Z" fill="#0F172A" />
          <path d="M350 500 V220 L400 180 V500 Z" fill="#1E293B" />
          <path d="M500 500 V80 L580 40 H680 V500 Z" fill="#020617" />
          <path d="M720 500 V180 L760 140 H840 L880 180 V500 Z" fill="#1E293B" />
          <path d="M920 500 V120 L960 80 H1020 V500 Z" fill="#0F172A" />
          <path d="M1060 500 V250 H1180 V500 Z" fill="#1E293B" />
          
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
