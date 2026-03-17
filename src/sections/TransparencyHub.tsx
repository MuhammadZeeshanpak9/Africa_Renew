import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { TRANSPARENCY_METRICS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface MetricCardProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  index: number;
}

function MetricCard({ label, value, target, unit, index }: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    const progress = progressRef.current;
    if (!card || !progress) return;

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Progress bar animation
      const percentage = (value / target) * 100;
      gsap.fromTo(
        progress,
        { width: '0%' },
        {
          width: `${percentage}%`,
          duration: 1.5,
          delay: 0.3 + index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Count up animation
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        delay: 0.2 + index * 0.1,
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
  }, [value, target, index]);

  const percentage = Math.round((value / target) * 100);

  return (
    <div
      ref={cardRef}
      className="relative p-6 rounded-2xl glass-card hover:shadow-glass transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-primary">{percentage}%</span>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span ref={valueRef} className="text-3xl font-bold text-foreground">
          {displayValue}
        </span>
        <span className="text-lg text-muted-foreground">{unit}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          style={{ width: '0%' }}
        />
      </div>

      {/* Target */}
      <div className="mt-2 text-xs text-muted-foreground">
        Target: {target.toLocaleString()}{unit}
      </div>
    </div>
  );
}

// Circular Progress Component
function CircularProgress({ 
  value, 
  label, 
  icon: Icon 
}: { 
  value: number; 
  label: string; 
  icon: any;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const ctx = gsap.context(() => {
      // Circle draw animation
      gsap.fromTo(
        circle,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: circumference - (value / 100) * circumference,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: circle,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Count up
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplayValue(Math.round(obj.val));
        },
        scrollTrigger: {
          trigger: circle,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [value, circumference]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(159, 129, 185, 0.1)"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9f81b9" />
              <stop offset="100%" stopColor="#4fc3f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-2xl font-bold text-foreground">{displayValue}%</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function TransparencyHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="transparency"
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Transparency Hub
          </span>
          <h2 className="heading-lg mb-6">
            <span className="text-foreground">RADICAL </span>
            <span className="text-gradient">ACCOUNTABILITY</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Real-time metrics and transparent reporting on every initiative,
            ensuring resources reach their intended destinations.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Stats Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRANSPARENCY_METRICS.map((metric, index) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                target={metric.target}
                unit={metric.unit}
                index={index}
              />
            ))}
          </div>

          {/* Circular Progress Indicators */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full p-6 rounded-3xl glass-card"
            >
              <h3 className="text-lg font-semibold mb-6 text-center">Key Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                <CircularProgress value={92} label="Efficiency" icon={TrendingUp} />
                <CircularProgress value={88} label="Satisfaction" icon={Users} />
                <CircularProgress value={95} label="Budget Use" icon={DollarSign} />
                <CircularProgress value={87} label="Activity" icon={Activity} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 p-6 rounded-3xl glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Activity</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Real-time</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Projects', value: '1,240' },
              { label: 'Partners Online', value: '89' },
              { label: 'Funds Deployed', value: '$2.4M' },
              { label: 'Milestones Today', value: '47' },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-primary/5">
                <p className="text-2xl font-bold text-gradient">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-muted-foreground">Audited Financials</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-muted-foreground">Open Data Policy</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-muted-foreground">Quarterly Reports</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/3 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
