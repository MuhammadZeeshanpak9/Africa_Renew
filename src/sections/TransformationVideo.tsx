import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function TransformationVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const videoContainer = videoContainerRef.current;
    const title = titleRef.current;

    if (!section || !videoContainer || !title) return;

    const ctx = gsap.context(() => {
      // Create scroll timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        },
      });

      // Video container entrance
      scrollTl.fromTo(
        videoContainer,
        { 
          scale: 0.7, 
          opacity: 0,
          borderRadius: '100px',
        },
        { 
          scale: 1, 
          opacity: 1,
          borderRadius: '24px',
          ease: 'power2.out',
        }
      );

      // Title entrance
      gsap.fromTo(
        title,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="transformation"
      className="relative w-full min-h-screen py-20 flex flex-col items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Background Gradient - subtle transparency */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      {/* Section Title */}
      <h2
        ref={titleRef}
        className="relative z-10 heading-lg text-center mb-12 px-4"
      >
        <span className="text-gradient">WATCH THE</span>
        <span className="block text-foreground">TRANSFORMATION</span>
      </h2>

      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className="relative z-10 w-[90%] max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 will-change-transform"
      >
        {/* YouTube Video iframe */}
        <iframe
          src="https://www.youtube.com/embed/ME2-2b6YkDg?autoplay=1&mute=1&loop=1&playlist=ME2-2b6YkDg&controls=0&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0"
          title="Building Tomorrow's Africa"
          className="w-full h-full object-cover pointer-events-none"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Center Text (Overlaying the video since it's background-like) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
             <button
              onClick={() => setIsPlaying(true)}
              className="w-24 h-24 rounded-full bg-primary/80 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-glow"
            >
              <Play className="w-10 h-10 ml-1 fill-current" />
            </button>
          </div>
        )}

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between z-20">
          <div>
            <p className="text-primary font-medium uppercase tracking-[0.2em] text-xs mb-2">
              The Vision
            </p>
            <h3 className="text-white text-2xl font-bold tracking-tight">
              African Renew: The Genesis
            </h3>
          </div>
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(159,129,185,1)]" />
            <span className="text-white/90 text-sm font-medium tracking-wide">Transforming</span>
          </div>
        </div>
      </div>

      {/* Stats Below Video */}
      <div className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-4">
        {[
          { value: '500+', label: 'Projects' },
          { value: '54', label: 'Nations' },
          { value: '$50B', label: 'Investment' },
          { value: '100M+', label: 'Lives' },
        ].map((stat, index) => (
          <div
            key={index}
            className="text-center"
          >
            <p className="text-3xl md:text-4xl font-bold text-gradient mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
