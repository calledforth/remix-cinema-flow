
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const Studio = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Navigation */}
      <nav className="p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="text-white font-bold text-xl hover:text-purple-300 transition-colors">
            remix.
          </Link>
          <div className="flex space-x-6">
            <button className="text-white/80 hover:text-white transition-colors">save</button>
            <button className="text-white/80 hover:text-white transition-colors">export</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              share
            </button>
          </div>
        </div>
      </nav>

      {/* Studio Content */}
      <div ref={containerRef} className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Remixing Studio
          </h1>
          <p className="text-xl text-gray-300">
            Where creativity meets artificial intelligence
          </p>
        </div>

        {/* Studio Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Area */}
          <div className="lg:col-span-2 bg-black/30 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-white/60 text-lg">Drop your content here to start remixing</p>
              </div>
            </div>
          </div>

          {/* Tools Panel */}
          <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-white font-semibold mb-4">AI Tools</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600/20 text-purple-300 p-3 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/30">
                  Style Transfer
                </button>
                <button className="w-full bg-pink-600/20 text-pink-300 p-3 rounded-lg hover:bg-pink-600/30 transition-colors border border-pink-500/30">
                  Color Remix
                </button>
                <button className="w-full bg-blue-600/20 text-blue-300 p-3 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30">
                  Texture Blend
                </button>
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-white font-semibold mb-4">Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm">Intensity</label>
                  <input type="range" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Creativity</label>
                  <input type="range" className="w-full mt-1" />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Blend Mode</label>
                  <select className="w-full mt-1 bg-black/50 text-white p-2 rounded border border-white/20">
                    <option>Multiply</option>
                    <option>Screen</option>
                    <option>Overlay</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
