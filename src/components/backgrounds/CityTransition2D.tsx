import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function CityTransition2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const oldCityOpacity = useTransform(smoothProgress, [0, 0.2, 0.5], [1, 1, 0]);
  const oldCityY = useTransform(smoothProgress, [0, 0.5], ['0%', '10%']);
  const oldCityScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);

  const newCityOpacity = useTransform(smoothProgress, [0.2, 0.6, 1], [0, 1, 1]);
  const newCityY = useTransform(smoothProgress, [0, 0.5, 1], ['10%', '5%', '0%']);
  const newCityScale = useTransform(smoothProgress, [0, 1], [0.95, 1.05]);
  const newCityClip = useTransform(
    smoothProgress,
    [0.2, 0.7],
    ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']
  );

  const scaffoldOpacity = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, 0.6, 0]);
  const scaffoldY = useTransform(smoothProgress, [0, 1], ['5%', '-5%']);

  // Generates glass reflections instead of dotted windows
  const glassReflections = (
    bx: number, by: number, bw: number, bh: number, stripeW: number, gap: number
  ) => {
    const els: JSX.Element[] = [];
    const numStripes = Math.floor(bx / (stripeW + gap));
    for (let x = bx + gap; x < bx + bw - stripeW; x += stripeW + gap) {
      els.push(
        <rect
          key={`gl-${bx}-${x}`}
          x={x} y={by} width={stripeW} height={bh}
          fill="url(#nc-glass-reflect)"
          opacity={0.3 + Math.random() * 0.4}
        />
      );
    }
    return els;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-white">

      {/* Subtle sky gradient ambient overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          opacity: newCityOpacity,
        }}
      />

      {/* ═══════════════ LAYER 1: OLD CITY (Grayscale Silhouettes) ═══════════════ */}
      <motion.div
        className="absolute bottom-0 w-full h-[65vh] z-10 flex items-end"
        style={{ opacity: oldCityOpacity, y: oldCityY, scale: oldCityScale }}
      >
        <svg viewBox="0 0 1440 500" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="oc-tower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d0d5d9" />
              <stop offset="100%" stopColor="#f0f2f5" />
            </linearGradient>
            <linearGradient id="oc-side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b0b5bg" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e0e5ea" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background hazy layer */}
          <g fill="#e6e9ec" opacity="0.6">
            <rect x="0" y="280" width="160" height="220" rx="1" />
            <rect x="180" y="250" width="100" height="250" rx="1" />
            <rect x="360" y="300" width="90" height="200" rx="1" />
            <rect x="520" y="260" width="180" height="240" rx="1" />
            <rect x="800" y="290" width="120" height="210" rx="1" />
            <rect x="1050" y="260" width="140" height="240" rx="1" />
            <rect x="1280" y="310" width="110" height="190" rx="1" />
          </g>

          {/* Foreground flat silhouettes */}
          <g fill="url(#oc-tower)">
            <rect x="40" y="200" width="110" height="300" rx="1" />
            <rect x="220" y="140" width="80" height="360" rx="1" />
            <rect x="340" y="280" width="150" height="220" rx="1" />
            {/* Centerpiece old tower */}
            <rect x="580" y="80" width="130" height="420" rx="1" />
            <rect x="610" y="50" width="70" height="30" rx="1" />
            <rect x="635" y="10" width="20" height="40" />
            
            <rect x="760" y="180" width="110" height="320" rx="1" />
            <rect x="940" y="120" width="90" height="380" rx="1" />
            <rect x="1100" y="240" width="160" height="260" rx="1" />
            <rect x="1320" y="190" width="100" height="310" rx="1" />
          </g>

          {/* Shading/Depth marks */}
          <g fill="rgba(0,0,0,0.04)">
            <rect x="130" y="200" width="20" height="300" />
            <rect x="280" y="140" width="20" height="360" />
            <rect x="470" y="280" width="20" height="220" />
            <rect x="680" y="80" width="30" height="420" />
            <rect x="850" y="180" width="20" height="320" />
            <rect x="1010" y="120" width="20" height="380" />
            <rect x="1230" y="240" width="30" height="260" />
            <rect x="1400" y="190" width="20" height="310" />
          </g>

        </svg>
      </motion.div>

      {/* ═══════════════ LAYER 1.5: SCAFFOLDING ═══════════════ */}
      <motion.div
        className="absolute bottom-0 w-full h-[70vh] z-20"
        style={{ opacity: scaffoldOpacity, y: scaffoldY }}
      >
        {/* Subtle grid base */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,100,255,0.03)_1.5px,transparent_1.5px),linear-gradient(rgba(0,100,255,0.03)_1.5px,transparent_1.5px)] bg-[size:60px_60px]" />
        
        {/* Minimalist blueprint lines */}
        <svg viewBox="0 0 1440 600" className="absolute bottom-0 w-full h-[600px]">
          <g stroke="rgba(0,120,255,0.3)" strokeWidth="1" fill="none">
            {/* Evolving mesh frames */}
            <path d="M220 600 V180 H330 V600" />
            <path d="M220 250 H330 M220 320 H330 M220 390 H330 M220 460 H330" />
            
            <path d="M570 600 V100 H720 V600" />
            <path d="M570 180 H720 M570 260 H720 M570 340 H720 M570 420 H720" />
            
            <path d="M930 600 V160 H1040 V600" />
            <path d="M930 240 H1040 M930 320 H1040 M930 400 H1040 M930 480 H1040" />

            <path d="M1250 600 V260 H1380 V600" />
            <path d="M1250 340 H1380 M1250 420 H1380 M1250 500 H1380" />
          </g>
        </svg>

        {/* Laser scanner line effect */}
        <motion.div
          className="absolute bottom-0 w-full h-[2px] bg-blue-500/40 shadow-[0_0_15px_rgba(0,150,255,0.6)] z-30"
          style={{ y: useTransform(smoothProgress, [0.2, 0.8], ['0vh', '-75vh']) }}
        />
      </motion.div>

      {/* ═══════════════ LAYER 2: NEW CITY (Modern Geometric Glass) ═══════════════ */}
      <motion.div
        className="absolute bottom-0 w-full h-[78vh] z-30"
        style={{ opacity: newCityOpacity, y: newCityY, scale: newCityScale, clipPath: newCityClip }}
      >
        <svg viewBox="0 0 1440 520" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,40,100,0.1)]" preserveAspectRatio="xMidYMax meet">
          <defs>
            {/* Very sleek, high-contrast flat gradients for glass effect */}
            <linearGradient id="nc-base" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2530" />
              <stop offset="100%" stopColor="#0d141c" />
            </linearGradient>
            
            <linearGradient id="nc-glass-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#253545" />
              <stop offset="100%" stopColor="#15202c" />
            </linearGradient>
            
            <linearGradient id="nc-glass-reflect" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="nc-edge-hl" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="nc-light-bloom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#e3f2fd" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            
            {/* Sharp geometric shadows */}
            <linearGradient id="nc-shadow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#050a10" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#050a10" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Clean flat horizon line */}
          <rect x="0" y="490" width="1440" height="30" fill="#080c12" />
          <line x1="0" y1="490" x2="1440" y2="490" stroke="#4fc3f7" strokeWidth="1.5" opacity="0.6" />

          {/* ── BACKGROUND: Minimalist Silhouettes ── */}
          <g fill="#a2b3c4" opacity="0.3">
            <polygon points="40,490 60,320 140,320 160,490" />
            <rect x="260" y="280" width="80" height="210" />
            <rect x="380" y="340" width="160" height="150" />
            <polygon points="800,490 850,220 890,220 940,490" />
            <rect x="1000" y="300" width="120" height="190" />
            <rect x="1220" y="270" width="140" height="220" />
          </g>

          {/* ── FOREGROUND: Sleek Architectural Vectors ── */}
          
          {/* Tower 1 - Slanted Glass Edge */}
          <polygon points="80,490 120,160 180,160 210,490" fill="url(#nc-base)" />
          <polygon points="120,160 180,160 150,490 80,490" fill="url(#nc-glass-front)" />
          {/* Vertical mullions instead of windows */}
          <polygon points="120,160 125,160 100,490 80,490" fill="rgba(255,255,255,0.05)" />
          <polygon points="150,160 155,160 130,490 115,490" fill="rgba(255,255,255,0.05)" />
          <polygon points="175,160 180,160 210,490 190,490" fill="url(#nc-shadow)" />
          {/* Accent light edge */}
          <line x1="120" y1="160" x2="80" y2="490" stroke="#4fc3f7" strokeWidth="2" opacity="0.9" />

          {/* Tower 2 - Boxy Modernist */}
          <rect x="250" y="220" width="110" height="270" fill="url(#nc-glass-front)" />
          <rect x="360" y="240" width="25" height="250" fill="url(#nc-shadow)" />
          <rect x="250" y="220" width="110" height="4" fill="#64b5f6" />
          {/* Horizontal sleek banding */}
          {[250, 290, 330, 370, 410, 450].map(y => (
            <line key={y} x1="250" x2="360" y1={y} y2={y} stroke="#101822" strokeWidth="8" />
          ))}
          {/* Thin light strips */}
          {[274, 314, 354, 394, 434, 474].map(y => (
            <line key={y} x1="250" x2="360" y1={y} y2={y} stroke="#4fc3f7" strokeWidth="1" opacity="0.5" />
          ))}

          {/* Tower 3 - THE CENTERPIECE (Sleek Obelisk) */}
          {/* Base structure */}
          <polygon points="460,490 510,50 610,50 660,490" fill="url(#nc-base)" />
          <polygon points="490,490 510,50 610,50 630,490" fill="url(#nc-glass-front)" />
          {/* Depth shadowing on right side */}
          <polygon points="610,50 660,490 630,490" fill="url(#nc-shadow)" />
          
          {/* Very sharp vertical reflections */}
          <polygon points="510,50 530,50 540,490 490,490" fill="url(#nc-glass-reflect)" />
          <polygon points="560,50 570,50 580,490 560,490" fill="url(#nc-glass-reflect)" />
          
          {/* Spire */}
          <polygon points="545,50 560,-20 575,50" fill="url(#nc-edge-hl)" />
          {/* Center glowing rib */}
          <line x1="560" y1="-20" x2="560" y2="490" stroke="#e3f2fd" strokeWidth="1" opacity="0.8" />
          {/* Horizontal structural rings */}
          {[120, 220, 320, 420].map(y => (
            <line key={y} x1={510 - (y-50)*0.045} x2={610 + (y-50)*0.045} y1={y} y2={y} stroke="#4fc3f7" strokeWidth="2" opacity="0.8" />
          ))}

          {/* Tower 4 - Stacked Volumes */}
          <rect x="730" y="280" width="130" height="210" fill="url(#nc-base)" />
          <rect x="750" y="200" width="90" height="80" fill="url(#nc-glass-front)" />
          <rect x="770" y="140" width="50" height="60" fill="url(#nc-base)" />
          <rect x="850" y="280" width="20" height="210" fill="url(#nc-shadow)" />
          <rect x="830" y="200" width="20" height="80" fill="url(#nc-shadow)" />
          
          <rect x="730" y="278" width="130" height="3" fill="#64b5f6" />
          <rect x="750" y="198" width="90" height="3" fill="#64b5f6" />
          <rect x="770" y="138" width="50" height="3" fill="#64b5f6" />
          
          {/* Large flat reflective panels */}
          <rect x="740" y="285" width="20" height="205" fill="rgba(255,255,255,0.06)" />
          <rect x="780" y="285" width="20" height="205" fill="rgba(255,255,255,0.03)" />
          <rect x="815" y="285" width="15" height="205" fill="rgba(255,255,255,0.06)" />

          {/* Tower 5 - Cylindrical/Curved Glass Illusion */}
          <rect x="910" y="180" width="120" height="310" fill="url(#nc-glass-front)" rx="4" />
          {/* Curved gradient mapping for cylinder effect */}
          <rect x="910" y="180" width="20" height="310" fill="rgba(0,0,0,0.5)" />
          <rect x="930" y="180" width="20" height="310" fill="rgba(0,0,0,0.2)" />
          <rect x="990" y="180" width="20" height="310" fill="rgba(255,255,255,0.05)" />
          <rect x="1010" y="180" width="20" height="310" fill="rgba(0,0,0,0.3)" />
          
          <rect x="910" y="180" width="120" height="4" fill="#4fc3f7" opacity="0.8" />
          <rect x="940" y="160" width="60" height="20" fill="url(#nc-base)" />
          {glassReflections(910, 184, 120, 306, 12, 10)}

          {/* Tower 6 - Wide Modern Campus Hub */}
          <rect x="1080" y="320" width="210" height="170" fill="url(#nc-glass-front)" />
          <rect x="1100" y="260" width="150" height="60" fill="url(#nc-base)" />
          <rect x="1120" y="200" width="100" height="60" fill="url(#nc-glass-front)" />
          <rect x="1290" y="320" width="20" height="170" fill="url(#nc-shadow)" />
          <rect x="1250" y="260" width="15" height="60" fill="url(#nc-shadow)" />
          
          <line x1="1080" y1="320" x2="1290" y2="320" stroke="#4fc3f7" strokeWidth="2" />
          <line x1="1100" y1="260" x2="1250" y2="260" stroke="#4fc3f7" strokeWidth="2" />
          <line x1="1120" y1="200" x2="1220" y2="200" stroke="#4fc3f7" strokeWidth="2" />
          {glassReflections(1085, 325, 200, 165, 20, 15)}
          {glassReflections(1125, 205, 90, 55, 10, 10)}

          {/* Tower 7 - Thin Edge Tower */}
          <polygon points="1350,490 1370,120 1390,490" fill="url(#nc-glass-front)" />
          <polygon points="1370,120 1410,490 1390,490" fill="url(#nc-shadow)" />
          <line x1="1370" y1="120" x2="1350" y2="490" stroke="#4fc3f7" strokeWidth="1.5" />
          <line x1="1370" y1="120" x2="1390" y2="490" stroke="#4fc3f7" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </div>
  );
}
