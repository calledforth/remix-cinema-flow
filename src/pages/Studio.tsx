import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus, Menu, X, Sparkles, AudioWaveform as Waveform, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const Studio = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to the AI Music Remix Studio! I can help you create, remix, and transform music. What would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation for all islands
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Stagger animation for islands
    gsap.fromTo('.island', 
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.2
      }
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand you want to work on that! Let me help you create something amazing. What style or genre are you looking for?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="h-screen bg-black p-3 overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 h-full flex gap-3">
        {/* Sidebar Island - Left */}
        <div className={`island transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-14'}`}>
          <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent"></div>
            
            {/* Subtle animated border */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  {sidebarOpen && (
                    <Link to="/" className="text-lg font-bold text-white hover:text-gray-300 transition-colors">
                      remix.
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-3">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 h-9`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {sidebarOpen && "New Session"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 h-9`}
                  >
                    <Music className="w-4 h-4 mr-2" />
                    {sidebarOpen && "My Remixes"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 h-9`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {sidebarOpen && "Upload Audio"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 h-9`}
                  >
                    <Waveform className="w-4 h-4 mr-2" />
                    {sidebarOpen && "Audio Library"}
                  </Button>
                </div>

                {sidebarOpen && (
                  <div className="mt-6">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Recent Projects</h3>
                    <div className="space-y-1">
                      {['Synthwave Remix', 'Lo-fi Beats', 'Electronic Mix'].map((project, i) => (
                        <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md flex items-center justify-center">
                              <Headphones className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">{project}</p>
                              <p className="text-xs text-white/50">2h ago</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg mb-1 h-9`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Settings"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg h-9`}
                >
                  <User className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Compact Layout */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Chat Island - Takes most space */}
          <div className="island flex-1 min-h-0">
            <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent"></div>
              
              {/* Subtle animated border */}
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col">
                {/* Compact Chat Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h1 className="text-base font-semibold text-white">AI Music Studio</h1>
                        <p className="text-xs text-white/60">Transform your music with AI</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-xs h-8">
                        Export
                      </Button>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-lg text-xs h-8">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area - Compact */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-xl backdrop-blur-sm text-sm ${
                            message.type === 'user'
                              ? 'bg-white text-black border border-gray-300'
                              : 'bg-white/10 text-white border border-white/20'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.audioUrl && (
                            <div className="mt-2 p-2 bg-black/30 rounded-lg border border-white/10">
                              <div className="flex items-center space-x-2">
                                <Mic className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-white/80">Audio generated</span>
                              </div>
                            </div>
                          )}
                          <div className="mt-1 text-xs text-white/50">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 border border-white/20 p-3 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                            </div>
                            <span className="text-white/60 text-xs">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Compact Input Island */}
          <div className="island">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4">
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-2xl"></div>
              
              {/* Subtle animated border */}
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe the music you want to create or remix..."
                      className="min-h-[50px] max-h-24 bg-white/10 border-white/20 text-white placeholder-white/50 resize-none focus:border-white/40 focus:ring-white/20 rounded-xl backdrop-blur-sm text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-white text-black hover:bg-gray-200 h-[50px] px-4 rounded-xl shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-xs h-7">
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-xs h-7">
                      <Mic className="w-3 h-3 mr-1" />
                      Record
                    </Button>
                  </div>
                  <p className="text-xs text-white/40">Press Enter to send, Shift+Enter for new line</p>
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