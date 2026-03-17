import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface ParallaxOptions {
  intensity?: number;
  smoothing?: number;
  invert?: boolean;
}

export function useParallax<T extends HTMLElement>(options: ParallaxOptions = {}) {
  const { intensity = 20, smoothing = 0.1, invert = false } = options;
  const elementRef = useRef<T>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    
    mousePosition.current = { 
      x: invert ? -x : x, 
      y: invert ? -y : y 
    };
  }, [invert]);

  const animate = useCallback(() => {
    const element = elementRef.current;
    if (!element) {
      rafId.current = requestAnimationFrame(animate);
      return;
    }

    currentPosition.current.x += (mousePosition.current.x - currentPosition.current.x) * smoothing;
    currentPosition.current.y += (mousePosition.current.y - currentPosition.current.y) * smoothing;

    const translateX = currentPosition.current.x * intensity;
    const translateY = currentPosition.current.y * intensity;

    gsap.set(element, {
      x: translateX,
      y: translateY,
      rotateX: -currentPosition.current.y * 5,
      rotateY: currentPosition.current.x * 5,
    });

    rafId.current = requestAnimationFrame(animate);
  }, [intensity, smoothing]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove, animate]);

  return elementRef;
}

export function useTilt<T extends HTMLElement>(intensity: number = 10) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -intensity;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * intensity;

      gsap.to(element, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return elementRef;
}

export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progressRef;
}

export default useParallax;
