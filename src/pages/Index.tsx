import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const featuresTitleRef = useRef<HTMLDivElement>(null);
  const topRemixesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

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
    // Enable smooth scrolling
    gsap.registerPlugin(ScrollTrigger);
    
    // Main hero transformation timeline
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Fade out hero title and fade in nav
    heroTimeline
      .to(navRef.current, {
        opacity: 1,
        duration: 0.5,
      }, "-=0.5");

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
        }
      }
    );

    // Features title animation
    gsap.fromTo(featuresTitleRef.current, 
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: featuresContainerRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        }
      }
    );

    // PINNED CARD STACK ANIMATION - Scroll locks until animation completes
    const cards = featureCardsRef.current;
    if (cards.length) {
      const totalCards = cards.length;
      const STACK_OFFSET_X = 120; // Horizontal spacing between cards
      const STACK_OFFSET_Y = 40;  // Vertical spacing (downward stacking)

      // Set initial position for first card (bottom layer)
      gsap.set(cards[0], {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 1,
        opacity: 1,
        rotation: 0,
      });

      // Hide other cards initially
      gsap.set(cards.slice(1), {
        x: 600,
        y: -150,
        scale: 0.9,
        opacity: 0,
        rotation: 5,
        zIndex: (i) => i + 2,
      });

      // Create the main pinned scroll trigger that controls the entire animation
      ScrollTrigger.create({
        trigger: featuresContainerRef.current,
        start: "top top",
        end: "bottom bottom", // Pin for the entire section height
        pin: true, // 🔒 PIN THE SECTION - This prevents scrolling past
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const cardProgress = progress * totalCards;

          // Animate each card based on overall progress
          cards.forEach((card, index) => {
            if (index === 0) return; // Skip first card

            const cardStart = (index - 1) / (totalCards - 1);
            const cardEnd = index / (totalCards - 1);
            
            if (progress >= cardStart && progress <= cardEnd) {
              // Card is currently animating
              const localProgress = (progress - cardStart) / (cardEnd - cardStart);
              
              const finalX = index * STACK_OFFSET_X;
              const finalY = index * STACK_OFFSET_Y;

              gsap.set(card, {
                x: gsap.utils.interpolate(600, finalX, localProgress),
                y: gsap.utils.interpolate(-150, finalY, localProgress),
                scale: gsap.utils.interpolate(0.9, 1, localProgress),
                opacity: gsap.utils.interpolate(0, 1, localProgress),
                rotation: gsap.utils.interpolate(5, 0, localProgress),
              });
            } else if (progress > cardEnd) {
              // Card animation is complete - set final position
              const finalX = index * STACK_OFFSET_X;
              const finalY = index * STACK_OFFSET_Y;
              
              gsap.set(card, {
                x: finalX,
                y: finalY,
                scale: 1,
                opacity: 1,
                rotation: 0,
              });
            }
          });
        }
      });
    }

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
        }
      }
    );

    gsap.fromTo(footerRef.current, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "bottom 20%",
          scrub: 1,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ scrollBehavior: 'smooth' }}>
      {/* Background with uploaded holographic image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/54af5b33-165e-4144-988d-42992d217f0a.png')`
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Navigation - Initially Hidden */}
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/10 backdrop-blur-sm opacity-0"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="text-white font-bold text-xl">remix.</div>
            <div className="hidden md:flex space-x-8 text-white/80">
              <a href="#about" className="hover:text-white transition-colors">about</a>
              <a href="#features" className="hover:text-white transition-colors">features</a>
              <a href="#contact" className="hover:text-white transition-colors">contact</a>
            </div>
          </div>
          <Link 
            to="/studio"
            className="bg-white text-black px-6 py-2 rounded-none font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            start remixing
          </Link>
        </div>
      </nav>

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
        className="relative z-30 min-h-screen flex items-end justify-start p-8 md:p-16"
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

      {/* Features Card Stack Section - PINNED SCROLLING */}
      <div ref={featuresContainerRef} className="relative z-30 h-[300vh] py-32">
        <div className="w-full max-w-7xl mx-auto px-8 h-screen flex flex-col justify-center">
          {/* Features Title */}
          <div ref={featuresTitleRef} className="mb-16">
            <h2 className="text-6xl md:text-8xl font-bold text-white">Features</h2>
            <p className="text-xl text-white/70 mt-4">Powerful tools for creative expression</p>
          </div>

          {/* Card Stack Container - Positioned center-right */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-4xl flex justify-center">
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
          </div>
        </div>
      </div>

      {/* Top Remixes Section */}
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
              <p className="uppercase text-sm">Our Merch</p>
              {/* Placeholder for merch images */}
              <div className="flex justify-end space-x-2 mt-2">
                <div className="w-12 h-12 bg-neutral-800"></div>
                <div className="w-12 h-12 bg-neutral-800"></div>
                <div className="w-12 h-12 bg-neutral-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Section (formerly About) */}
      <div ref={aboutRef} className="relative z-30 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-12">
            Get Started
          </h2>
          <p className="text-2xl text-white/90 leading-relaxed mb-8">
            We curate sonic journeys that exist between night and dawn, reality and dream. 
            Our platform blends ambient, techno, electro, and experimental elements to create 
            deep, cinematic, and boundary-pushing soundscapes.
          </p>
          <p className="text-xl text-white/80 leading-relaxed mb-12">
            Transform your creative process with AI-powered tools that understand the nuances 
            of artistic expression and help you craft experiences that resonate on a deeper level.
          </p>
          <Link 
            to="/studio"
            className="inline-block bg-white text-black px-12 py-6 rounded-full text-xl font-bold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Start Remixing
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="relative z-30 bg-black/80 backdrop-blur-sm py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
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
        </div>
      </footer>
    </div>
  );
};

export default Index;