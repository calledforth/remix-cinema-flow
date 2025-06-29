
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus } from 'lucide-react';
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
    <div ref={containerRef} className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <Link to="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
            remix.
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Music className="w-4 h-4 mr-2" />
              My Remixes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800 mt-2"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">AI Music Remix Studio</h1>
              <p className="text-sm text-gray-400">Transform your music with AI</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                Export
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.audioUrl && (
                    <div className="mt-3 p-3 bg-black/30 rounded-lg">
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
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl">
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

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe the music you want to create or remix..."
                  className="min-h-[60px] max-h-32 bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 h-[60px] px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
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
