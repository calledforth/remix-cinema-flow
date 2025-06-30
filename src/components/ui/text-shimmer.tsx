
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
        'relative inline-block',
        'bg-gradient-to-r from-transparent via-white/80 to-transparent',
        'bg-[length:200%_100%] bg-clip-text text-transparent',
        'dark:from-transparent dark:via-white/90 dark:to-transparent',
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
        backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.1) 80%, transparent 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </MotionComponent>
  );
}
