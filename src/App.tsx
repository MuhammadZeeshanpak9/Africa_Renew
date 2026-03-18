import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Sections
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import TransformationVideo from './sections/TransformationVideo';
import MissionVision from './sections/MissionVision';
import Leadership from './sections/Leadership';
import Architecture from './sections/Architecture';
import TransparencyHub from './sections/TransparencyHub';
import ImpactStats from './sections/ImpactStats';
import Gallery from './sections/Gallery';
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';

// Backgrounds
import CityTransition3D from './components/backgrounds/CityTransition3D';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger on load
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
      lenisRef.current?.destroy();
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });
    };
  }, []);

  // Setup global scroll snap for pinned sections
  /* 
  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            
            if (!inPinned) return value; // Flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  */

  return (
    <div className="relative min-h-screen bg-transparent overflow-x-hidden">
      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0">
        <CityTransition3D />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 lg:pl-20">
        {/* Hero Section - Pinned */}
        <HeroSection />

        {/* Transformation Video */}
        <TransformationVideo />

        {/* Mission & Vision */}
        <MissionVision />

        {/* Leadership */}
        <Leadership />

        {/* Architecture */}
        <Architecture />

        {/* Transparency Hub */}
        <TransparencyHub />

        {/* Impact Stats */}
        <ImpactStats />

        {/* Gallery */}
        <Gallery />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
