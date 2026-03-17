import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Shield, Map, Users, Check, type LucideIcon } from 'lucide-react';
import { ARCHITECTURE_CARDS } from '@/lib/constants';
import { constructionAssembly } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Map,
  Users,
};

function ArchitectureCard({ card, index }: { card: any; index: number }) {
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
      className="h-full p-8 rounded-3xl glass-card hover:shadow-glow transition-all duration-500 group relative"
    >
      <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-primary">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
        {card.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {card.description}
      </p>
      <ul className="space-y-3">
        {card.features.map((feature: string, featureIndex: number) => (
          <li key={featureIndex} className="flex items-center gap-3 text-sm text-foreground/80">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-lg font-bold text-primary">{index + 1}</span>
      </div>
    </div>
  );
}

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const svg = svgRef.current;
    if (!title || !svg) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const paths = svg.querySelectorAll('.connection-path');
      paths.forEach((path, index) => {
        const pathElement = path as SVGPathElement;
        const length = pathElement.getTotalLength();
        gsap.set(pathElement, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathElement, {
          strokeDashoffset: 0,
          duration: 2,
          delay: 0.5 + index * 0.3,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: svg, start: 'top 70%', once: true },
        });
      });

      const particles = svg.querySelectorAll('.flow-particle');
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          motionPath: {
            path: paths[index % paths.length] as SVGPathElement,
            align: paths[index % paths.length] as SVGPathElement,
            alignOrigin: [0.5, 0.5],
          },
          duration: 3,
          repeat: -1,
          ease: 'none',
          delay: index * 0.5,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative w-full py-24 md:py-32 bg-transparent overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(79,195,247,0.03)_1px,transparent_1px),linear-gradient(rgba(79,195,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="section-container relative z-10">
        <div ref={titleRef} className="text-center mb-16 md:mb-24">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Our Framework
          </span>
          <h2 className="heading-lg mb-6">
            <span className="text-foreground">THE </span>
            <span className="text-gradient">ARCHITECTURE</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            A comprehensive system designed to connect, empower, and transform
            every aspect of continental development.
          </p>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            style={{ zIndex: 0 }}
          >
            <path
              className="connection-path"
              d="M 380 150 Q 500 150 620 150"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              className="connection-path"
              d="M 860 150 Q 980 150 1100 150"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              className="connection-path"
              d="M 380 200 Q 740 350 1100 200"
              fill="none"
              stroke="url(#gradient3)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9f81b9" />
                <stop offset="100%" stopColor="#4fc3f7" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4fc3f7" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9f81b9" />
                <stop offset="50%" stopColor="#4fc3f7" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
            </defs>
            <circle className="flow-particle" r="4" fill="#9f81b9" />
            <circle className="flow-particle" r="4" fill="#4fc3f7" />
            <circle className="flow-particle" r="4" fill="#ffd700" />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {ARCHITECTURE_CARDS.map((card, index) => (
              <ArchitectureCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 p-8 rounded-3xl glass-card"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Integrated Ecosystem</h3>
              <p className="text-muted-foreground text-sm">
                All systems working in harmony for maximum impact
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-white">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">4 Core Pillars</p>
                <p className="text-xs text-muted-foreground">Unified Vision</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
