import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, Users, Building2 } from 'lucide-react';
import { IMPACT_STATS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
  icon: any;
  index: number;
}

function StatCard({ value, prefix, suffix, label, description, icon: Icon, index }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Count up animation
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2.5,
        delay: 0.3 + index * 0.15,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplayValue(Math.round(obj.val));
        },
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

    }, card);

    return () => ctx.revert();
  }, [value, index]);

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full p-8 rounded-3xl glass-card hover:shadow-glow transition-all duration-500">
        {/* Icon */}
        <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-primary">
          <Icon className="w-7 h-7" />
        </div>

        {/* Number */}
        <div className="mb-4">
          <span
            ref={numberRef}
            className="text-5xl md:text-6xl font-bold text-gradient"
          >
            {prefix}{displayValue.toLocaleString()}{suffix}
          </span>
        </div>

        {/* Label */}
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
          {label}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {description}
        </p>

        {/* Decorative Glow */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function ImpactStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const particles = particlesRef.current;

    if (!title) return;

    const ctx = gsap.context(() => {
      // Title animation
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

      // Particle animation
      if (particles) {
        const particleElements = particles.querySelectorAll('.particle');
        particleElements.forEach((particle, i) => {
          gsap.to(particle, {
            y: `random(-100, 100)`,
            x: `random(-50, 50)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const iconMap: Record<number, React.ElementType<any>> = {
    1: Building2,
    2: Users,
    3: Globe,
  };

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="relative w-full py-24 md:py-32 bg-transparent overflow-hidden"
    >
      {/* Floating Particles Background */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#9f81b9' : i % 3 === 1 ? '#4fc3f7' : '#ffd700',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Our Impact
          </span>
          <h2 className="heading-lg mb-6">
            <span className="text-foreground">MEASURABLE </span>
            <span className="text-gradient">RESULTS</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Numbers that tell the story of transformation across the continent.
            Every statistic represents lives changed and communities empowered.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {IMPACT_STATS.map((stat, index) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              icon={(iconMap[stat.id] || TrendingUp) as any}
              index={index}
            />
          ))}
        </div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '2,500+', label: 'Projects Completed' },
            { value: '150+', label: 'Partner Organizations' },
            { value: '45M', label: 'Jobs Created' },
            { value: '98%', label: 'Success Rate' },
          ].map((metric, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl glass-card hover:shadow-glass transition-all duration-300"
            >
              <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {metric.value}
              </p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="#cta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            View Full Report
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
