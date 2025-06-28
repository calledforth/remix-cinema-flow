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
  const featuresRef = useRef<HTMLDivElement>(null);
  const topRemixesRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const remixImages = [
    '/assets/download (1).jpg',
    '/assets/carlhauser-vGiJ-tW3tZ4-unsplash.jpg',
    '/assets/cor.jpeg',
    '/assets/car.jpeg'
  ];

  const features = [
    {
      number: "01",
      title: "AI Style Transfer",
      description: "Transform any image with neural style transfer. Apply artistic styles from famous paintings or create your own unique aesthetic.",
      icon: "🎨",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "02", 
      title: "Spotify Integration",
      description: "Sync your remixes with your Spotify playlists. Generate visuals that match your music's mood and energy.",
      icon: "🎵",
      color: "from-green-500 to-blue-500"
    },
    {
      number: "03",
      title: "Real-time Collaboration",
      description: "Work together with other creators in real-time. Share ideas, iterate, and build something extraordinary together.",
      icon: "👥",
      color: "from-orange-500 to-red-500"
    },
    {
      number: "04",
      title: "Smart Color Palette",
      description: "AI-powered color extraction and harmonization. Create cohesive visual experiences with intelligent color suggestions.",
      icon: "🌈",
      color: "from-cyan-500 to-purple-500"
    },
    {
      number: "05",
      title: "Motion Graphics",
      description: "Bring your static images to life with AI-generated animations. Create dynamic content that captivates your audience.",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500"
    },
    {
      number: "06",
      title: "Cloud Rendering",
      description: "High-performance cloud processing for complex remixes. No hardware limitations, just pure creative freedom.",
      icon: "☁️",
      color: "from-blue-500 to-indigo-500"
    }
  ];

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

    // Animate features cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      gsap.fromTo(card,
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8,
          rotateX: 45
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

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

    gsap.fromTo(getStartedRef.current, 
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: getStartedRef.current,
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
              <a href="#features" className="hover:text-white transition-colors">features</a>
              <a href="#remixes" className="hover:text-white transition-colors">remixes</a>
              <a href="#get-started" className="hover:text-white transition-colors">get started</a>
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

      {/* Features Section */}
      <div id="features" ref={featuresRef} className="relative z-30 min-h-screen py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 uppercase">
              Features
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Cutting-edge AI tools designed to amplify your creativity and push the boundaries of digital art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card relative group"
                style={{ perspective: '1000px' }}
              >
                <div className="relative bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                  
                  {/* Feature number */}
                  <div className="text-6xl font-bold text-white/20 mb-4">
                    {feature.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Remixes Section */}
      <div id="remixes" ref={topRemixesRef} className="relative z-30 min-h-screen text-white flex items-center justify-center p-8 bg-black/20 backdrop-blur-lg">
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
      <div id="get-started" ref={getStartedRef} className="relative z-30 min-h-screen flex items-center justify-center px-8">
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
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Studio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#get-started" className="hover:text-white transition-colors">About</a></li>
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