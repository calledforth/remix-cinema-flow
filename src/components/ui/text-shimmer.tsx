'use client';
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'span',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component);

  const dynamicSpread = useMemo(() => {
    return Math.max(children.length * spread, 50);
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block text-white/80',
        className
      )}
      initial={{ backgroundPosition: '-200% center' }}
      animate={{ backgroundPosition: '200% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={{
        background: `linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.2) 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </MotionComponent>
  );
}
