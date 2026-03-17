import { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load Three.js component for performance
const AfricaNetwork = lazy(() => import('@/components/three/AfricaNetwork'));

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const section = sectionRef.current;
    const content = contentRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const buttons = buttonsRef.current;
    
    if (!section || !content || !headline || !subtext || !buttons) return;

    const ctx = gsap.context(() => {
      // Initial entrance animation
      const entranceTl = gsap.timeline({ delay: 0.5 });
      
      entranceTl
        .fromTo(
          headline,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
        )
        .fromTo(
          subtext,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.7'
        )
        .fromTo(
          buttons.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
          '-=0.6'
        );

      // Scroll-driven animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        },
      });

      // Exit animation
      scrollTl
        .to(headline, {
          opacity: 0,
          y: -80,
          scale: 0.9,
          duration: 0.5,
          ease: 'power2.in',
        }, 0.5)
        .to(subtext, {
          opacity: 0,
          y: -60,
          duration: 0.5,
          ease: 'power2.in',
        }, 0.52)
        .to(buttons, {
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: 'power2.in',
        }, 0.54);

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        {isLoaded && (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <AfricaNetwork scrollProgress={scrollProgress} />
          </Suspense>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/60 via-transparent to-white/80 pointer-events-none" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-card"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground/80">
              Transforming Africa&apos;s Future
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="heading-xl mb-6 text-foreground will-change-transform"
          >
            <span className="block">REDEFINING THE</span>
            <span className="block text-gradient">CONTINENTAL MINDSET</span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="body-lg max-w-2xl mx-auto mb-10 text-foreground/70 will-change-transform"
          >
            A synchronized ecosystem of leadership, infrastructure, and radical accountability.
            From fragmentation to unity. From vision to execution.
          </p>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 will-change-transform"
          >
            <Button
              size="lg"
              className="btn-primary group text-base"
            >
              Join The Movement
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-secondary group text-base"
            >
              <Users className="mr-2 w-5 h-5" />
              Collaborate
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
