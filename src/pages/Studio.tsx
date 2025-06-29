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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)]"></div>
      </div>

      <div className="relative z-10 h-full flex gap-4">
        {/* Sidebar Island - Left */}
        <div className={`island transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-16'}`}>
          <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-blue-400/50 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-blue-400/50 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  {sidebarOpen && (
                    <Link to="/" className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                      remix.
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-4">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {sidebarOpen && "New Session"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200`}
                  >
                    <Music className="w-5 h-5 mr-2" />
                    {sidebarOpen && "My Remixes"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200`}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {sidebarOpen && "Upload Audio"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200`}
                  >
                    <Waveform className="w-5 h-5 mr-2" />
                    {sidebarOpen && "Audio Library"}
                  </Button>
                </div>

                {sidebarOpen && (
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Recent Projects</h3>
                    <div className="space-y-2">
                      {['Synthwave Remix', 'Lo-fi Beats', 'Electronic Mix'].map((project, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <Headphones className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{project}</p>
                              <p className="text-xs text-white/50">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-2xl mb-2`}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  {sidebarOpen && "Settings"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-2xl`}
                >
                  <User className="w-5 h-5 mr-2" />
                  {sidebarOpen && "Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Chat Island */}
          <div className="island flex-1">
            <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-blue-400/50 to-transparent"></div>
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"></div>
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-blue-400/50 to-transparent"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-white">AI Music Studio</h1>
                        <p className="text-sm text-white/60">Transform your music with AI</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl">
                        Export
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white border border-purple-400/30'
                              : 'bg-white/10 text-white border border-white/20'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.audioUrl && (
                            <div className="mt-3 p-3 bg-black/30 rounded-xl border border-white/10">
                              <div className="flex items-center space-x-2">
                                <Mic className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-white/80">Audio generated</span>
                              </div>
                            </div>
                          )}
                          <div className="mt-2 text-xs text-white/50">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                            </div>
                            <span className="text-white/60 text-sm">AI is thinking...</span>
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

          {/* Input Island */}
          <div className="island">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6">
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-blue-400/50 to-transparent"></div>
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"></div>
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-blue-400/50 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe the music you want to create or remix..."
                      className="min-h-[60px] max-h-32 bg-white/10 border-white/20 text-white placeholder-white/50 resize-none focus:border-purple-400/50 focus:ring-purple-400/20 rounded-2xl backdrop-blur-sm"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-[60px] px-6 rounded-2xl text-white shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl">
                      <Mic className="w-4 h-4 mr-2" />
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