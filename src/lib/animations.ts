import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Easing functions
export const easings = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',
  dramatic: 'power4.inOut',
  snappy: 'power3.out',
};

// Fade in animation
export function fadeIn(
  element: Element | Element[],
  duration: number = 1,
  delay: number = 0
): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration, delay, ease: easings.smooth }
  );
}

// Fade in with scale
export function fadeInScale(
  element: Element | Element[],
  duration: number = 1,
  delay: number = 0
): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.9, y: 40 },
    { opacity: 1, scale: 1, y: 0, duration, delay, ease: easings.smooth }
  );
}

// Slide in from direction
export function slideIn(
  element: Element | Element[],
  direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  duration: number = 1,
  delay: number = 0
): gsap.core.Tween {
  const fromVars: gsap.TweenVars = { opacity: 0 };
  
  switch (direction) {
    case 'left':
      fromVars.x = -100;
      break;
    case 'right':
      fromVars.x = 100;
      break;
    case 'top':
      fromVars.y = -100;
      break;
    case 'bottom':
      fromVars.y = 100;
      break;
  }

  return gsap.fromTo(
    element,
    fromVars,
    { opacity: 1, x: 0, y: 0, duration, delay, ease: easings.smooth }
  );
}

// Stagger children animation
export function staggerChildren(
  parent: Element,
  childSelector: string,
  staggerDelay: number = 0.1,
  duration: number = 0.8
): gsap.core.Tween | null {
  const children = parent.querySelectorAll(childSelector);
  if (children.length === 0) return null;

  return gsap.fromTo(
    children,
    { opacity: 0, y: 50, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger: staggerDelay,
      ease: easings.snappy,
    }
  );
}

// Create scroll-triggered animation
export function createScrollAnimation(
  element: Element | Element[],
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  triggerOptions: ScrollTrigger.Vars = {}
): ScrollTrigger {
  const tween = gsap.fromTo(element, fromVars, {
    ...toVars,
    scrollTrigger: {
      trigger: element as Element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...triggerOptions,
    },
  });

  return tween.scrollTrigger!;
}

// Parallax effect
export function createParallax(
  element: Element,
  speed: number = 0.5
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(element, {
        y: self.progress * speed * 100,
      });
    },
  });
}

// Count up animation
export function countUp(
  element: Element,
  endValue: number,
  duration: number = 2,
  suffix: string = ''
): gsap.core.Tween {
  const obj = { value: 0 };
  
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      if (element) {
        element.textContent = Math.round(obj.value).toLocaleString() + suffix;
      }
    },
  });
}

// Magnetic button effect
export function createMagneticEffect(
  element: HTMLElement,
  strength: number = 0.3
): () => void {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove, { passive: true });
  element.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

// Glow pulse animation
export function glowPulse(element: Element, color: string = '#9f81b9'): gsap.core.Tween {
  return gsap.to(element, {
    boxShadow: `0 0 30px ${color}, 0 0 60px ${color}40`,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  });
}

// Text reveal animation (split by characters)
export function textReveal(
  element: HTMLElement,
  duration: number = 1,
  staggerDelay: number = 0.02
): gsap.core.Timeline {
  const text = element.textContent || '';
  element.innerHTML = text
    .split('')
    .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');

  const chars = element.querySelectorAll('span');
  
  const tl = gsap.timeline();
  tl.fromTo(
    chars,
    { opacity: 0, y: 50, rotateX: -90 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration,
      stagger: staggerDelay,
      ease: easings.snappy,
    }
  );

  return tl;
}

// SVG path draw animation
export function drawSVGPath(
  pathElement: SVGPathElement,
  duration: number = 2
): gsap.core.Tween {
  const length = pathElement.getTotalLength();
  
  gsap.set(pathElement, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  return gsap.to(pathElement, {
    strokeDashoffset: 0,
    duration,
    ease: 'power2.inOut',
  });
}

// Particle explosion effect
export function particleExplosion(
  container: HTMLElement,
  particleCount: number = 30,
  color: string = '#9f81b9'
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const particles: HTMLDivElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 6px;
      height: 6px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      left: 50%;
      top: 50%;
    `;
    container.appendChild(particle);
    particles.push(particle);
  }

  tl.to(particles, {
    x: () => (Math.random() - 0.5) * 300,
    y: () => (Math.random() - 0.5) * 300,
    opacity: 0,
    scale: 0,
    duration: 1,
    stagger: 0.02,
    ease: 'power2.out',
    onComplete: () => {
      particles.forEach((p) => p.remove());
    },
  });

  return tl;
}

// Smooth scroll to element
export function smoothScrollTo(
  target: string | HTMLElement,
  duration: number = 1.5
): void {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
    
  if (element) {
    gsap.to(window, {
      duration,
      scrollTo: { y: element, offsetY: 50 },
      ease: 'power3.inOut',
    });
  }
}

// Kill all ScrollTriggers (for cleanup)
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

// Refresh ScrollTrigger (after layout changes)
export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh();
}

export default {
  fadeIn,
  fadeInScale,
  slideIn,
  staggerChildren,
  createScrollAnimation,
  createParallax,
  countUp,
  createMagneticEffect,
  glowPulse,
  textReveal,
  drawSVGPath,
  particleExplosion,
  smoothScrollTo,
  killAllScrollTriggers,
  refreshScrollTrigger,
  easings,
};
