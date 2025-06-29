import React, { useState, useEffect, useRef } from 'react';
import ColorThief from 'colorthief';

interface RemixCoverProps {
  id: number;
  title: string;
  image: string | null;
}

const RemixCover: React.FC<{ remix: RemixCoverProps }> = ({ remix }) => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (remix.image && imgRef.current) {
      const colorThief = new ColorThief();
      const img = imgRef.current;

      const handleImageLoad = () => {
        try {
          const color = colorThief.getColor(img);
          const rgb = `rgb(${color.join(',')})`;
          setDominantColor(rgb);
        } catch (error) {
          console.error('Error getting dominant color:', error);
          setDominantColor(null);
        }
      };

      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
      }

      img.crossOrigin = 'Anonymous';

      return () => {
        img.removeEventListener('load', handleImageLoad);
      };
    }
  }, [remix.image]);

  const gradient = dominantColor
    ? `linear-gradient(to top, ${dominantColor}, transparent)`
    : 'linear-gradient(to top, #1a1a1a, transparent)';

  const boxShadow = dominantColor
    ? `0 10px 10px -5px ${dominantColor}`
    : 'none';

  if (!remix.image) {
    return (
      <div className="w-20 h-20 bg-neutral-800/80 flex items-center justify-center text-neutral-400 font-semibold cursor-pointer hover:bg-neutral-700/80 transition-colors text-xs">
        {remix.title}
      </div>
    );
  }

  return (
    <div
      className="relative w-32 h-32 overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105"
      style={{ boxShadow }}
    >
      <img
        ref={imgRef}
        src={remix.image}
        alt={remix.title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3"
        style={{ background: gradient }}
      >
        <span className="text-white font-bold text-sm">{remix.title}</span>
      </div>
    </div>
  );
};

export default RemixCover; 