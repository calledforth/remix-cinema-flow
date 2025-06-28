
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
  const aboutRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

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
      .to(titleRef.current, {
        opacity: 0,
        y: -100,
        duration: 1,
      })
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

    // Hide tagline and show features
    gsap.to(taglineRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 100%",
        end: "top 80%",
        scrub: 1,
      }
    });

    gsap.fromTo(featuresRef.current, 
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: featuresRef.current,
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
        </div>
      </div>

      {/* Tagline Section */}
      <div 
        ref={taglineRef}
        className="relative z-30 min-h-screen flex items-center justify-center px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-4xl md:text-6xl font-bold text-white/90 tracking-wide font-serif leading-relaxed">
            Transform the ordinary into the extraordinary.
          </p>
          <p className="text-xl md:text-2xl text-white/70 mt-8 font-serif">
            Your world, reimagined with AI.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="relative z-30 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-12">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Creation</h3>
              <p className="text-white/80">
                Harness the power of artificial intelligence to transform your creative process and bring your wildest ideas to life.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Cinematic Quality</h3>
              <p className="text-white/80">
                Create stunning visuals with professional-grade tools that deliver cinematic quality results every time.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Boundary-Pushing</h3>
              <p className="text-white/80">
                Push the boundaries of what's possible with cutting-edge technology that redefines creative expression.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div ref={aboutRef} className="relative z-30 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-12">
            About
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
      <footer ref={footerRef} className="relative z-30 bg-black/50 backdrop-blur-sm py-16 px-8">
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
