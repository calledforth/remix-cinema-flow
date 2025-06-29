import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Zap, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animation
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Tagline Section Animation
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Features Section Animation
      gsap.fromTo(featuresRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // About Section Animation
      gsap.fromTo(aboutRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef.current);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif">
            Unleash Your Musical Genius with AI
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8">
            Create, remix, and transform music like never before.
          </p>
          <div className="space-x-4">
            <Link to="/studio">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Creating <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-gray-300 hover:text-white border-gray-700">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section ref={taglineRef} className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 font-serif">
            The Future of Music Creation is Here
          </h2>
          <p className="text-xl md:text-2xl text-gray-300">
            Experience the power of AI-driven music tools.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <Zap className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">AI-Powered Remixing</h3>
            <p className="text-gray-400">Instantly remix tracks with intelligent algorithms.</p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Seamless Music Generation</h3>
            <p className="text-gray-400">Generate original music in any genre with ease.</p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Collaborative Tools</h3>
            <p className="text-gray-400">Collaborate with other musicians in real-time.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-center font-serif">
            About AI Music Remix Studio
          </h2>
          <p className="text-xl text-gray-300 mb-8 text-center">
            We are dedicated to revolutionizing the music industry with cutting-edge AI technology.
          </p>
          <div className="text-center">
            <Button variant="outline" size="lg" className="text-gray-300 hover:text-white border-gray-700">
              Our Mission <Sparkles className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} AI Music Remix Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
