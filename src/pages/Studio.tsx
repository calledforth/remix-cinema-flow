
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    // Entrance animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
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
    <div ref={containerRef} className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex gap-6 h-screen">
        {/* Sidebar Island */}
        <div className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-16'
        }`}>
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-3xl h-full shadow-2xl">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex items-center justify-between">
                {sidebarOpen && (
                  <Link to="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                    remix.
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl ${
                    !sidebarOpen ? 'px-3' : ''
                  }`}
                  title={!sidebarOpen ? "New Session" : ""}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {sidebarOpen && "New Session"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl ${
                    !sidebarOpen ? 'px-3' : ''
                  }`}
                  title={!sidebarOpen ? "My Remixes" : ""}
                >
                  <Music className="w-4 h-4 mr-2" />
                  {sidebarOpen && "My Remixes"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl ${
                    !sidebarOpen ? 'px-3' : ''
                  }`}
                  title={!sidebarOpen ? "Upload Audio" : ""}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Upload Audio"}
                </Button>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-800/50">
              <Button
                variant="ghost"
                className={`w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl mb-2 ${
                  !sidebarOpen ? 'px-3' : ''
                }`}
                title={!sidebarOpen ? "Settings" : ""}
              >
                <Settings className="w-4 h-4 mr-2" />
                {sidebarOpen && "Settings"}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-2xl ${
                  !sidebarOpen ? 'px-3' : ''
                }`}
                title={!sidebarOpen ? "Profile" : ""}
              >
                <User className="w-4 h-4 mr-2" />
                {sidebarOpen && "Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Chat Island */}
          <div className="flex-1 bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-800/50 bg-gray-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">AI Music Studio</h1>
                  <p className="text-sm text-gray-400">Transform your music with AI</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" 
                    className="border-gray-700 text-gray-300 hover:text-white rounded-full px-4">
                    Export
                  </Button>
                  <Button size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 rounded-full px-4">
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" style={{ height: 'calc(100vh - 280px)' }}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-3xl ${
                        message.type === 'user'
                          ? 'bg-purple-600/90 text-white backdrop-blur-sm'
                          : 'bg-gray-800/60 text-gray-100 border border-gray-700/50 backdrop-blur-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.audioUrl && (
                        <div className="mt-3 p-3 bg-black/30 rounded-2xl">
                          <div className="flex items-center space-x-2">
                            <Mic className="w-4 h-4" />
                            <span className="text-sm text-gray-300">Audio generated</span>
                          </div>
                        </div>
                      )}
                      <div className="mt-2 text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm p-4 rounded-3xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                        <span className="text-gray-400 text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Island */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl p-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe the music you want to create or remix..."
                  className="min-h-[60px] max-h-32 bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 resize-none focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl backdrop-blur-sm"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 h-[60px] px-6 rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" 
                  className="text-gray-400 hover:text-white rounded-full">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
                <Button size="sm" variant="ghost" 
                  className="text-gray-400 hover:text-white rounded-full">
                  <Mic className="w-4 h-4 mr-1" />
                  Record
                </Button>
              </div>
              <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
