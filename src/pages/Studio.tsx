import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus, Menu, X, Sparkles, AudioWaveform as Waveform, Headphones, Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
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

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  isPlaying?: boolean;
  isLiked?: boolean;
}

const Studio = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChat, setShowChat] = useState(false); // New state to control view
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample music collections using public assets
  const featuredTrack = {
    title: "Viral sekarang",
    subtitle: "Wonderland (Deluxe)",
    imageUrl: "/assets/download (1).jpg"
  };

  const musicCollections = [
    {
      id: '1',
      title: 'Giants',
      artist: 'Take That',
      album: 'Giants',
      duration: '3:45',
      imageUrl: '/assets/download (1).jpg',
      isLiked: true
    },
    {
      id: '2',
      title: 'Bad Liar',
      artist: 'Imagine Dragons',
      album: 'Origins',
      duration: '4:20',
      imageUrl: '/assets/carlhauser-vGiJ-tW3tZ4-unsplash.jpg',
      isLiked: false
    },
    {
      id: '3',
      title: 'Rahmatan Lil alameen',
      artist: 'Maher Zain',
      album: 'Forgive Me',
      duration: '4:15',
      imageUrl: '/assets/cor.jpeg',
      isLiked: true
    },
    {
      id: '4',
      title: 'Not You',
      artist: 'Alan Walker',
      album: 'World Of Walker',
      duration: '3:30',
      imageUrl: '/assets/car.jpeg',
      isLiked: false
    },
    {
      id: '5',
      title: 'Demons',
      artist: 'Imagine Dragons',
      album: 'Night Visions',
      duration: '2:57',
      imageUrl: '/assets/download (1).jpg',
      isLiked: true
    },
    {
      id: '6',
      title: 'Payphone',
      artist: 'Maroon 5',
      album: 'Overexposed',
      duration: '3:51',
      imageUrl: '/assets/carlhauser-vGiJ-tW3tZ4-unsplash.jpg',
      isLiked: false
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Switch to chat view when first message is sent
    if (!showChat) {
      setShowChat(true);
    }

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

  const togglePlay = (trackId: string) => {
    setCurrentlyPlaying(currentlyPlaying === trackId ? null : trackId);
  };

  const toggleLike = (trackId: string) => {
    // Handle like functionality
    console.log('Toggle like for track:', trackId);
  };

  return (
    <div className="h-screen bg-black p-2 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 h-full flex gap-2">
        {/* Compact Sidebar Island - Much Smaller */}
        <div className={`${sidebarOpen ? 'w-48' : 'w-12'}`}>
          <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent"></div>
            
            <div className="absolute inset-0 rounded-xl">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Compact Header */}
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  {sidebarOpen && (
                    <Link to="/" className="text-sm font-bold text-white hover:text-gray-300">
                      remix.
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg h-7 w-7 p-0"
                  >
                    {sidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              {/* Compact Navigation */}
              <div className="flex-1 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg h-8 text-xs`}
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    {sidebarOpen && "New"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg h-8 text-xs`}
                  >
                    <Music className="w-3 h-3 mr-2" />
                    {sidebarOpen && "Library"}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg h-8 text-xs`}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    {sidebarOpen && "Upload"}
                  </Button>
                </div>

                {sidebarOpen && (
                  <div className="mt-4">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Recent</h3>
                    <div className="space-y-1">
                      {['Synthwave', 'Lo-fi Beats', 'Electronic'].map((project, i) => (
                        <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                              <Headphones className="w-2 h-2 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">{project}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Footer */}
              <div className="p-2 border-t border-white/10">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg h-8 text-xs`}
                >
                  <Settings className="w-3 h-3 mr-2" />
                  {sidebarOpen && "Settings"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {!showChat ? (
            /* Music Collections View */
            <div className="flex-1 min-h-0">
              <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent"></div>
                
                <div className="absolute inset-0 rounded-xl">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Featured Section */}
                  <div className="p-6">
                    <div 
                      className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 cursor-pointer group"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${featuredTrack.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs text-white/80 mb-1">Featured Remix</p>
                            <h2 className="text-2xl font-bold text-white mb-1">{featuredTrack.title}</h2>
                            <p className="text-sm text-white/80">{featuredTrack.subtitle}</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 p-0"
                            onClick={() => togglePlay('featured')}
                          >
                            {currentlyPlaying === 'featured' ? 
                              <Pause className="w-4 h-4" /> : 
                              <Play className="w-4 h-4 ml-0.5" />
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Music Collections */}
                  <div className="flex-1 px-6 pb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Remixed Collections</h3>
                    <ScrollArea className="h-full">
                      <div className="space-y-2">
                        {musicCollections.map((track, index) => (
                          <div 
                            key={track.id}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                          >
                            <div className="text-sm text-white/60 w-6">{index + 1}</div>
                            <div 
                              className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0"
                              style={{
                                backgroundImage: `url(${track.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="w-6 h-6 p-0 text-white hover:bg-white/20"
                                  onClick={() => togglePlay(track.id)}
                                >
                                  {currentlyPlaying === track.id ? 
                                    <Pause className="w-3 h-3" /> : 
                                    <Play className="w-3 h-3" />
                                  }
                                </Button>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{track.title}</p>
                              <p className="text-xs text-white/60 truncate">{track.artist}</p>
                            </div>
                            <div className="hidden md:block text-xs text-white/60 w-20">{track.album}</div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="w-6 h-6 p-0 text-white/60 hover:text-white opacity-0 group-hover:opacity-100"
                                onClick={() => toggleLike(track.id)}
                              >
                                <Heart className={`w-3 h-3 ${track.isLiked ? 'fill-current text-red-500' : ''}`} />
                              </Button>
                              <div className="text-xs text-white/60 w-12 text-right">{track.duration}</div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="w-6 h-6 p-0 text-white/60 hover:text-white opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Chat View - Same as before but more compact */
            <div className="flex-1 min-h-0">
              <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent"></div>
                
                <div className="absolute inset-0 rounded-xl">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Chat Header */}
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
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-xs h-8"
                          onClick={() => setShowChat(false)}
                        >
                          Back to Library
                        </Button>
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-lg text-xs h-8">
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
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
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
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
          )}

          {/* Input Island - Always visible */}
          <div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-xl"></div>
              
              <div className="absolute inset-0 rounded-xl">
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
                      placeholder={showChat ? "Continue the conversation..." : "Describe the music you want to create or remix..."}
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