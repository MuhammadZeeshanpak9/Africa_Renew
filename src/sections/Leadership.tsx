import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Mail, ChevronDown } from 'lucide-react';
import { LEADERSHIP_TEAM } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

export default function Leadership() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    if (!section || !title || !cards) return;

    const ctx = gsap.context(() => {
      // Title slide in
      gsap.fromTo(
        title,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards deal in animation
      const cardElements = cards.querySelectorAll('.leadership-card');
      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 100, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="leadership"
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Side - Title */}
          <div ref={titleRef} className="lg:col-span-4 lg:sticky lg:top-32">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Our Team
            </span>
            <h2 className="heading-lg mb-6">
              <span className="block text-foreground">MEET THE</span>
              <span className="block text-gradient">LEADERSHIP</span>
            </h2>
            <p className="body-md mb-8">
              Visionaries, strategists, and change-makers dedicated to transforming
              Africa&apos;s future through bold leadership and unwavering commitment.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl glass-card">
                <p className="text-3xl font-bold text-gradient mb-1">20+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="p-4 rounded-2xl glass-card">
                <p className="text-3xl font-bold text-gradient mb-1">54</p>
                <p className="text-sm text-muted-foreground">Nations Covered</p>
              </div>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div ref={cardsRef} className="lg:col-span-8 space-y-6">
            {LEADERSHIP_TEAM.map((leader, index) => (
              <motion.div
                key={leader.id}
                className="leadership-card perspective-1000"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl glass-card transition-all duration-500 ${
                    expandedCard === leader.id ? 'shadow-glow' : 'hover:shadow-glass'
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                            {leader.name}
                          </h3>
                          <p className="text-primary font-medium">{leader.role}</p>
                        </div>
                        <button
                          onClick={() => toggleCard(leader.id)}
                          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                          aria-label="Toggle details"
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                              expandedCard === leader.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedCard === leader.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-muted-foreground mb-6">
                              {leader.bio}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Social Links */}
                      <div className="flex items-center gap-3">
                        <a
                          href="#"
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href="#"
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                          href="#"
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                          aria-label="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Index Badge */}
                  <div className="absolute top-4 right-4 md:top-auto md:bottom-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">0{index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/3 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
