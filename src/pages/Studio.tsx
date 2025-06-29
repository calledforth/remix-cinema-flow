import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus, Menu, X, Sparkles, AudioWaveform as Waveform, Headphones, Play } from 'lucide-react';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatStarted, setChatStarted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remixCovers = [
    { id: 1, title: 'REMIX1', image: '/assets/car.jpeg', genre: 'Electronic' },
    { id: 2, title: 'REMIX', image: '/assets/cor.jpeg', genre: 'Hip Hop' },
    { id: 3, title: 'REMIX', image: '/assets/carlhauser-vGiJ-tW3tZ4-unsplash.jpg', genre: 'Pop' },
    { id: 4, title: 'REMIX', image: '/assets/download (1).jpg', genre: 'Rock' },
    { id: 5, title: 'See all', image: null, genre: null },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: uploadedFile 
        ? `Uploaded: ${uploadedFile.name} - ${inputValue || 'Ready to remix!'}`
        : inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);
    setChatStarted(true);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Great! I've received your audio file. I can help you remix it in various styles. What kind of remix are you looking for? Electronic, Hip Hop, Pop, or something else?",
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
    <div className="h-screen bg-black p-4 overflow-hidden">
      <div className="h-full flex gap-4">
        {/* Sidebar Island */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-200`}>
          <div className="h-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  {sidebarOpen && (
                    <Link to="/" className="text-lg font-bold text-white hover:text-gray-300">
                      remix.
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-3">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-10`}
                  >
                    <Plus className="w-4 h-4" />
                    {sidebarOpen && <span className="ml-3">New Session</span>}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-10`}
                  >
                    <Music className="w-4 h-4" />
                    {sidebarOpen && <span className="ml-3">My Remixes</span>}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-10`}
                  >
                    <Upload className="w-4 h-4" />
                    {sidebarOpen && <span className="ml-3">Library</span>}
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl mb-2 h-10`}
                >
                  <Settings className="w-4 h-4" />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-10`}
                >
                  <User className="w-4 h-4" />
                  {sidebarOpen && <span className="ml-3">Profile</span>}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {!chatStarted ? (
            /* Initial Compact Layout - Centered */
            <div className="flex-1 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border border-white/20 p-8 space-y-6">
              {/* Remix Presets - Tighter spacing, perfect squares */}
              <div className="flex items-center space-x-2">
                {remixCovers.map((remix) => (
                  <div key={remix.id}>
                    {remix.image ? (
                      <div className="relative w-24 h-24 overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105">
                        <img 
                          src={remix.image} 
                          alt={remix.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{remix.title}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-neutral-800/80 flex items-center justify-center text-neutral-400 font-semibold cursor-pointer hover:bg-neutral-700/80 transition-colors text-xs">
                        {remix.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Upload Area - Sharp edges, reduced height */}
              <div 
                className="w-full max-w-2xl border-2 border-dashed border-neutral-600 p-8 flex items-center justify-center cursor-pointer hover:border-neutral-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center text-neutral-400">
                  <Upload className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold text-sm">UPLOAD MUSIC to remix</p>
                  {uploadedFile && (
                    <p className="text-xs text-green-400 mt-2">
                      {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Chat Input Bar - Sharp edges, transparent bg, white border, centered text */}
              <div className="w-full max-w-2xl relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="CHAT"
                  className="w-full h-12 bg-transparent border-2 border-white text-white placeholder-neutral-400 text-center text-base tracking-wider focus:border-white/80 focus:ring-0"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !uploadedFile}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-gray-200 h-8 w-8 p-0 shadow-lg disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>

            </div>
          ) : (
            /* Chat View */
            <>
              {/* Messages Display */}
              <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/20 p-6 min-h-0">
                <ScrollArea className="h-full pr-4 -mr-4">
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h1 className="text-base font-semibold text-white">AI Music Studio</h1>
                            <p className="text-xs text-white/60">Transform your music with AI</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setChatStarted(false)}
                          className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-8"
                        >
                          New Session
                        </Button>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 backdrop-blur-sm text-sm ${
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
                          <div className="bg-white/10 border border-white/20 p-3 backdrop-blur-sm">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                              </div>
                              <span className="text-white/60 text-xs">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Input Island - Sharp edges, transparent bg, white border, centered text */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Send a message..."
                      className="min-h-[50px] max-h-24 bg-transparent border-2 border-white text-white placeholder-white/50 resize-none focus:border-white/80 focus:ring-0 text-center"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-white text-black hover:bg-gray-200 h-[50px] px-4 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Studio;