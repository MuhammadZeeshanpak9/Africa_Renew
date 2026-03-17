import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Crown, Building2, TrendingUp, BookOpen } from 'lucide-react';
import { MISSION_CARDS } from '@/lib/constants';
import { constructionAssembly } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Crown,
  Building2,
  TrendingUp,
  BookOpen,
};

function MissionCard({ card, index }: { card: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[card.icon];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => constructionAssembly(el, 1.2),
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative group h-full"
    >
      <div className="relative h-full p-8 rounded-3xl glass-card overflow-hidden transition-all duration-500 group-hover:shadow-glow">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${card.color}20, transparent 70%)`,
          }}
        />
        <div
          className="relative w-14 h-14 mb-6 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundColor: `${card.color}20` }}
        >
          <div style={{ color: card.color }}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {card.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {card.description}
        </p>
        <div className="absolute top-6 right-6 text-5xl font-bold text-foreground/5 group-hover:text-primary/10 transition-colors duration-300">
          0{index + 1}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative w-full py-24 md:py-32 bg-transparent overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(79,195,247,0.02)_1px,transparent_1px),linear-gradient(rgba(79,195,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="section-container relative z-10">
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Our Mission
          </span>
          <h2 className="heading-lg mb-6">
            <span className="text-foreground">From </span>
            <span className="text-gradient">Fragmentation</span>
            <span className="text-foreground"> to </span>
            <span className="text-gradient">Unity</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            We are building an interconnected ecosystem that transforms how Africa develops,
            collaborates, and thrives in the modern world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {MISSION_CARDS.map((card, index) => (
            <MissionCard key={card.id} card={card} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Ready to be part of the transformation?
          </p>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
          >
            Get Involved
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
