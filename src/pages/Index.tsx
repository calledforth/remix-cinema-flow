
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const marketingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scrolling
    gsap.registerPlugin(ScrollTrigger);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        smoothChildTiming: true,
      }
    });

    // Fade out and move up hero elements
    tl.to([titleRef.current, taglineRef.current], {
      opacity: 0,
      y: -100,
      duration: 1,
      ease: "power2.out",
    })
    // Fade in navigation
    .to(navRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.5")
    // Fade in marketing copy
    .to(marketingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.3");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-[200vh] overflow-hidden">
      {/* Background with uploaded holographic image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/54af5b33-165e-4144-988d-42992d217f0a.png')`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Navigation - Initially Hidden */}
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 p-6 bg-black/10 backdrop-blur-sm opacity-0"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-white font-medium text-lg">remix.</div>
          <div className="hidden md:flex space-x-6 text-white/80 text-sm">
            <a href="#about" className="hover:text-white transition-colors">about</a>
            <a href="#features" className="hover:text-white transition-colors">features</a>
            <a href="#contact" className="hover:text-white transition-colors">contact</a>
          </div>
          <Link 
            to="/studio"
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            start remixing
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-start pl-8 md:pl-16">
        <div className="text-left z-10">
          <h1 
            ref={titleRef}
            className="text-[16rem] md:text-[24rem] lg:text-[32rem] font-bold text-transparent leading-none mb-8 hero-text"
            style={{
              WebkitTextStroke: '3px transparent',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.8) 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            remix.
          </h1>
          <p 
            ref={taglineRef}
            className="text-xl md:text-2xl font-bold text-white/90 tracking-wide ml-4"
            style={{
              fontFamily: 'Georgia, serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            your world, reimagined with ai.
          </p>
        </div>
      </div>

      {/* Marketing Copy - Initially Hidden */}
      <div 
        ref={marketingRef}
        className="fixed bottom-8 left-8 z-40 opacity-0 translate-y-8 max-w-md"
      >
        <p className="text-white font-bold text-lg leading-relaxed tracking-wide"
           style={{
             fontFamily: 'Georgia, serif',
             textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
           }}>
          transform the ordinary into the extraordinary. our ai-powered platform 
          reimagines your creative process, turning ideas into reality with 
          unprecedented elegance and precision.
        </p>
      </div>

      {/* Spacer for scroll */}
      <div className="h-screen"></div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .hero-text {
          position: relative;
        }
        
        .hero-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.4) 20%, 
            rgba(255,255,255,0.8) 50%, 
            rgba(255,255,255,0.4) 80%, 
            transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 4s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Index;
