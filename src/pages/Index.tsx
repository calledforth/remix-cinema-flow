import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const featuresTitleRef = useRef<HTMLDivElement>(null);
  const completionTextRef = useRef<HTMLDivElement>(null);
  const topRemixesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const remixImages = [
    '/assets/download (1).jpg',
    '/assets/carlhauser-vGiJ-tW3tZ4-unsplash.jpg',
    '/assets/cor.jpeg',
    '/assets/car.jpeg'
  ];

  const featureData = [
    { 
      number: "01", 
      title: "AI-POWERED", 
      subtitle: "STYLE TRANSFER",
      description: "Transform any image with neural style transfer technology"
    },
    { 
      number: "02", 
      title: "SPOTIFY", 
      subtitle: "INTEGRATION",
      description: "Sync your remixes with your favorite tracks and playlists"
    },
    { 
      number: "03", 
      title: "REAL-TIME", 
      subtitle: "COLLABORATION",
      description: "Work together with artists worldwide in real-time"
    },
    { 
      number: "04", 
      title: "CLOUD", 
      subtitle: "RENDERING",
      description: "High-performance processing in the cloud"
    },
    { 
      number: "05", 
      title: "EXPORT", 
      subtitle: "ANYWHERE",
      description: "Share to social media, download, or stream directly"
    },
  ];

  const addToFeatureRefs = (el: HTMLDivElement | null) => {
    if (el && !featureCardsRef.current.includes(el)) {
      featureCardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Initialize ScrollSmoother for ultra-smooth scrolling
    let smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1, // Smooth factor
      effects: true, // Enable data-speed effects
      normalizeScroll: true, // Better mobile support
    });

    // Animate nav bar sliding in based on scroll position
    gsap.fromTo(navRef.current, {
      yPercent: -150
    }, {
      yPercent: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'bottom top+=100px',
        toggleActions: 'play none none reverse'
      }
    });

    // Main hero transformation timeline
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        refreshPriority: -1, // Lower priority to prevent conflicts
      }
    });

    // Show tagline section
    gsap.fromTo(taglineRef.current, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: taglineRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
          refreshPriority: -1,
        }
      }
    );

    // IMPROVED CARD STACK ANIMATION - More stable and predictable
    const cards = featureCardsRef.current;
    if (cards.length) {
      const totalCards = cards.length;
      const STACK_OFFSET_X = 120;
      const STACK_OFFSET_Y = 80;

      // Create a master timeline for all card animations
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: featuresContainerRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1, // Smoother pinning
          refreshPriority: 1, // Higher priority for main animation
          invalidateOnRefresh: true, // Recalculate on resize
          onRefresh: () => {
            // Reset all positions on refresh to prevent glitches
            cards.forEach((card, index) => {
              if (index === 0) {
                gsap.set(card, {
                  x: 0,
                  y: 0,
                  scale: 1,
                  zIndex: 1,
                  opacity: 1,
                  rotation: 0,
                  force3D: true, // Hardware acceleration
                });
              } else {
                gsap.set(card, {
                  x: 1000,
                  y: -200,
                  scale: 0.8,
                  opacity: 0,
                  rotation: 8,
                  zIndex: index + 2,
                  force3D: true,
                });
              }
            });
            
            // Reset completion text
            gsap.set(completionTextRef.current, {
              opacity: 0,
              x: 100,
              scale: 0.8,
              force3D: true,
            });
          }
        }
      });

      // Set initial positions with force3D for better performance
      gsap.set(cards[0], {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 1,
        opacity: 1,
        rotation: 0,
        force3D: true,
      });

      gsap.set(cards.slice(1), {
        x: 1000,
        y: -200,
        scale: 0.8,
        opacity: 0,
        rotation: 8,
        zIndex: (i) => i + 2,
        force3D: true,
      });

      gsap.set(completionTextRef.current, {
        opacity: 0,
        x: 100,
        scale: 0.8,
        force3D: true,
      });

      // Animate each card sequentially in the master timeline
      cards.forEach((card, index) => {
        if (index === 0) return; // Skip first card

        const finalX = index * STACK_OFFSET_X;
        const finalY = index * STACK_OFFSET_Y;
        
        // Each card gets equal time in the timeline
        const cardDuration = 1 / totalCards;
        const cardStart = (index - 1) * cardDuration;

        masterTimeline.to(card, {
          x: finalX,
          y: finalY,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: cardDuration,
          ease: "power2.out",
          force3D: true,
        }, cardStart);
      });

      // Add completion text animation at the very end
      masterTimeline.to(completionTextRef.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        force3D: true,
      }, 0.8); // Start when 80% complete
    }

    // Other animations with lower priority
    gsap.fromTo(topRemixesRef.current, 
      { y: 100 },
      {
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: topRemixesRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          refreshPriority: -1,
        }
      }
    );

    gsap.fromTo(aboutRef.current, 
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          refreshPriority: -1,
        }
      }
    );

    // Cleanup function
    return () => {
      if (smoother) {
        smoother.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative">
      {/* Background with uploaded holographic image - OUTSIDE ScrollSmoother */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/54af5b33-165e-4144-988d-42992d217f0a.png')`
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Navigation - FIXED ABOVE EVERYTHING */}
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[9999] p-4 flex justify-center"
      >
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-2 max-w-5xl w-full overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          {/* Decorative border */}
          <div className="absolute inset-1 border border-white/10 pointer-events-none z-10 rounded-lg" />
          
          {/* Animated border elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/30 to-transparent"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/30 to-transparent"></div>
          
          <div className="flex justify-between items-center relative z-10">
            {/* Left side - Only title */}
            <div className="text-white font-bold text-3xl">remix.</div>
            
            {/* Right side - All other elements */}
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8 text-white/80">
                <a href="#about" className="hover:text-white transition-colors">about</a>
                <a href="#features" className="hover:text-white transition-colors">features</a>
                <a href="#contact" className="hover:text-white transition-colors">contact</a>
              </div>
              
              {/* Glass Blur Button - Same style as feature cards */}
              <Link 
                to="/studio"
                className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 font-medium hover:bg-white/20 transition-all duration-300 overflow-hidden group rounded-lg"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                
                {/* Button text */}
                <span className="relative z-10">start remixing</span>
                
                {/* Decorative border */}
                <div className="absolute inset-1 border border-white/10 pointer-events-none z-10" />
                
                {/* Animated border elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/30 to-transparent"></div>
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/30 to-transparent"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ScrollSmoother Wrapper */}
      <div id="smooth-wrapper" ref={smoothWrapperRef} className="relative z-10">
        <div id="smooth-content" ref={smoothContentRef}>
          {/* Hero Section */}
          <div ref={heroRef} className="relative h-screen flex items-center justify-center">
            <div className="text-center z-10 w-full px-8">
              <h1 
                ref={titleRef}
                className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-transparent leading-none mb-4"
                style={{
                  WebkitTextStroke: '1px white'
                }}
              >
                remix.
              </h1>
            </div>
          </div>

          {/* Tagline Section */}
          <div 
            ref={taglineRef}
            className="relative z-30 min-h-screen flex items-center justify-start p-8 md:p-16"
          >
            <div className="max-w-4xl text-left">
              <p className="text-4xl md:text-6xl font-bold text-white/90 tracking-wide uppercase leading-tight">
                Transform the ordinary<br/>into the extraordinary.
              </p>
              <p className="text-xl md:text-2xl text-white/70 mt-4 uppercase">
                Your world, reimagined with AI.
              </p>
            </div>
          </div>

          {/* Features Section with Title - INCREASED SPACING */}
          <div className="relative z-30 pt-24 pb-12 px-8">
            <div className="max-w-7xl mx-auto w-full">
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">Features</h2>
              <p className="text-xl text-white/70">Powerful tools for creative expression</p>
            </div>
          </div>

          {/* Features Card Stack Section - PINNED SCROLLING */}
          <div ref={featuresContainerRef} className="relative z-30 h-[120vh]">
            <div className="w-full h-screen flex items-start justify-between pt-24 px-16">
              {/* Card Stack Container - Positioned TOP LEFT */}
              <div className="relative">
                {featureData.map((feature, index) => (
                  <div
                    key={feature.number}
                    ref={addToFeatureRefs}
                    className="absolute w-80 h-96 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden rounded-lg"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                    {/* Feature number */}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="text-6xl font-bold text-white/40 leading-none">{feature.number}</span>
                    </div>

                    {/* Feature content */}
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-lg text-white/80 mb-3">{feature.subtitle}</p>
                      <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
                    </div>

                    {/* Decorative border */}
                    <div className="absolute inset-3 border border-white/10 pointer-events-none z-10 rounded" />

                    {/* Animated border elements */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/30 to-transparent"></div>
                  </div>
                ))}
              </div>

              {/* Enhanced Completion Text Container - GLASSMORPHIC WITH SHIMMER */}
              <div 
                ref={completionTextRef} 
                className="relative max-w-lg pt-8 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden"
              >
                {/* Glassmorphic background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
                
                {/* Shimmer border animation */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/40 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/40 to-transparent animate-pulse"></div>
                </div>

                {/* Inner decorative border */}
                <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-5xl font-bold text-white mb-6 italic uppercase tracking-wide">
                    THE COMPLETE SOLUTION
                  </h3>
                  <p className="text-xl text-white/90 leading-relaxed mb-8 italic font-medium">
                    Everything you need to transform your creative vision into reality. 
                    From AI-powered tools to seamless collaboration, we've built the 
                    ultimate platform for digital artists and creators.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                      <span className="text-white/80 italic text-lg font-medium">5 POWERFUL AI TOOLS</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                      <span className="text-white/80 italic text-lg font-medium">REAL-TIME COLLABORATION</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                      <span className="text-white/80 italic text-lg font-medium">CLOUD-BASED RENDERING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Remixes Section - DIRECTLY AFTER FEATURES */}
          <div ref={topRemixesRef} className="relative z-30 min-h-screen text-white flex items-center justify-center p-8 bg-black/20 backdrop-blur-lg">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Grid of images */}
              <div className="grid grid-cols-2 gap-4">
                {remixImages.map((src, i) => (
                  <div 
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden group bg-black"
                  >
                    <img src={src} alt={`Remix ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">@remixer</div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">1.2M views</div>
                  </div>
                ))}
              </div>
              {/* Text content */}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <h2 className="text-6xl font-bold uppercase leading-none">
                      Top<br />Remixes
                    </h2>
                    <p className="text-4xl font-bold">24</p>
                  </div>
                  <a href="#" className="group inline-flex items-center border-b border-neutral-400 pb-1">
                    <span>CHECK ALL</span>
                    <span className="ml-4 transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                  </a>
                </div>
                <div className="text-right">
                  <p className="max-w-xs ml-auto text-neutral-400">
                    A curated selection of the best remixes from our community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* New "Get Started" Section */}
          <div ref={aboutRef} className="relative z-30 min-h-[70vh] text-white flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-6xl md:text-8xl font-bold mb-6">Ready to Remix?</h2>
            <p className="text-xl text-white/70 max-w-2xl mb-12">
              Unleash your creativity and start crafting your unique sound. Our intuitive tools and AI-powered features make it easy to produce professional-quality remixes.
            </p>
            <Link 
              to="/studio"
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 text-xl font-medium hover:bg-white/20 transition-all duration-300 overflow-hidden group rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <span className="relative z-10">Start Remixing Now</span>
              <div className="absolute inset-2 border border-white/10 pointer-events-none z-10 rounded-xl" />
            </Link>
          </div>

          {/* Footer Section */}
          <footer ref={footerRef} className="relative z-30 text-white/70 p-8 bg-black/20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-white font-bold text-2xl mb-4">remix.</h3>
                <p className="text-white/70">
                  Your world, reimagined with AI.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Studio</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-12 pt-8 text-center">
              <p className="text-white/50">
                © 2024 remix. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;