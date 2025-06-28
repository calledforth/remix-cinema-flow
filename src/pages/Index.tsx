
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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Fade out and move up hero elements
    tl.to([titleRef.current, taglineRef.current], {
      opacity: 0,
      y: -100,
      duration: 1,
    })
    // Fade in navigation
    .to(navRef.current, {
      opacity: 1,
      duration: 0.5,
    }, "-=0.5")
    // Fade in marketing copy
    .to(marketingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
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
          <div className="text-white font-bold text-xl">remix.</div>
          <div className="hidden md:flex space-x-8 text-white/80">
            <a href="#about" className="hover:text-white transition-colors">about</a>
            <a href="#features" className="hover:text-white transition-colors">features</a>
            <a href="#contact" className="hover:text-white transition-colors">contact</a>
          </div>
          <Link 
            to="/studio"
            className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            start remixing
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center">
        <div className="text-center z-10">
          <h1 
            ref={titleRef}
            className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/50 leading-none mb-4"
            style={{
              WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)'
            }}
          >
            remix.
          </h1>
          <p 
            ref={taglineRef}
            className="text-2xl md:text-3xl font-bold text-white/90 tracking-wide"
          >
            Your world, reimagined with AI.
          </p>
        </div>
      </div>

      {/* Marketing Copy - Initially Hidden */}
      <div 
        ref={marketingRef}
        className="fixed bottom-8 left-8 z-40 opacity-0 translate-y-8 max-w-md"
      >
        <p className="text-white font-serif text-lg leading-relaxed">
          Transform the ordinary into the extraordinary. Our AI-powered platform 
          reimagines your creative process, turning ideas into reality with 
          unprecedented elegance and precision.
        </p>
      </div>

      {/* Spacer for scroll */}
      <div className="h-screen"></div>
    </div>
  );
};

export default Index;
