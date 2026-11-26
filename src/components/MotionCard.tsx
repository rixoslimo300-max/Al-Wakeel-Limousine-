import React, { useEffect, useRef, useState } from 'react';

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

/**
 * Lightweight IntersectionObserver reveal wrapper.
 * - One-shot reveal with opacity + subtle 14px vertical slide.
 * - Guarantees visible fallback if reduced motion is enabled or observer doesn't trigger.
 */
export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealState, setRevealState] = useState<'visible' | 'hidden'>(() => {
    if (typeof window === 'undefined') return 'visible';
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      return 'visible';
    }
    return 'hidden';
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || revealState === 'visible') return;

    // If element is already near or within viewport on initial mount, reveal right away
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96) {
      const raf = requestAnimationFrame(() => setRevealState('visible'));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealState('visible');
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);

    // Safety fallback so content never remains hidden
    const fallbackTimer = setTimeout(() => {
      setRevealState('visible');
      observer.disconnect();
    }, 1800);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [revealState]);

  return (
    <div
      ref={ref}
      data-reveal={revealState}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`reveal-item ${className}`}
    >
      {children}
    </div>
  );
};

interface LuxuryTiltCardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  onClick?: () => void;
}

/**
 * Controlled interactive card with desktop-only subtle 3D tilt (max 3.5deg)
 * and champagne-gold surface light reflection.
 * Automatically disabled on touch devices and prefers-reduced-motion.
 */
export const LuxuryTiltCard: React.FC<LuxuryTiltCardProps> = ({
  children,
  className = '',
  enableTilt = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const canUsePointerTilt = () => {
    if (typeof window === 'undefined') return false;
    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return Boolean(finePointer && !reducedMotion);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canUsePointerTilt()) return;
    const el = cardRef.current;
    if (!el) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);

      if (enableTilt) {
        const px = (x / rect.width - 0.5) * 2; // -1 to 1
        const py = (y / rect.height - 0.5) * 2; // -1 to 1
        const maxDeg = 3.2;
        const rotateY = px * maxDeg;
        const rotateX = -py * maxDeg;
        el.style.transform = `perspective(950px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      } else {
        el.style.transform = 'translateY(-2px)';
      }
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`luxury-card-surface ${className}`}
    >
      <div className="luxury-card-sheen" aria-hidden="true" />
      {children}
    </div>
  );
};
