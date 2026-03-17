import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function TransformationVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const videoContainer = videoContainerRef.current;
    const title = titleRef.current;
    const playButton = playButtonRef.current;

    if (!section || !videoContainer || !title || !playButton) return;

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

      // Play button entrance
      gsap.fromTo(
        playButton,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Continuous rotation for play button ripple
      gsap.to(playButton.querySelector('.ripple-ring'), {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'none',
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

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
        className="relative z-10 w-[90%] max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl will-change-transform"
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=675&fit=crop"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Play/Pause Button */}
        <button
          ref={playButtonRef}
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group transition-all duration-300 hover:scale-110 hover:bg-white/30"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {/* Ripple Rings */}
          <div className="ripple-ring absolute inset-0 rounded-full border-2 border-white/30" />
          <div className="ripple-ring absolute inset-[-10px] rounded-full border border-white/20" />
          <div className="ripple-ring absolute inset-[-20px] rounded-full border border-white/10" />

          {/* Icon */}
          <div className="relative z-10">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-wider mb-1">
              Featured Story
            </p>
            <h3 className="text-white text-xl font-semibold">
              Building Tomorrow&apos;s Africa
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-sm">Live</span>
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
