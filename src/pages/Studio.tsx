import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus, Menu, X, Sparkles, AudioWaveform as Waveform, Headphones, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import RemixCover from "@/components/ui/RemixCover";
import { AI_Prompt } from "@/components/ui/animated-ai-input";

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

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue;
    if (!messageText.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: uploadedFile 
        ? `Uploaded: ${uploadedFile.name} - ${messageText || 'Ready to remix!'}`
        : messageText,
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
            <div className="flex-1 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl p-8 space-y-6">
              {/* Remix Presets - Larger covers with intense gradients */}
              <div className="flex items-center space-x-4">
                {remixCovers.map((remix) => (
                  <RemixCover key={remix.id} remix={remix} />
                ))}
              </div>

              {/* Upload Area - Using FileUpload component */}
              <div className="w-full max-w-2xl pt-10">
                <FileUpload onChange={handleFileUpload} />
                {uploadedFile && (
                  <div className="mt-4 text-center">
                    <p className="text-green-400 text-sm">
                      Ready to remix: {uploadedFile.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="w-full max-w-2xl relative flex justify-center">
                <AI_Prompt onSubmit={handleSendMessage} />
              </div>

            </div>
          ) : (
            /* Chat View - No borders */
            <>
              {/* Messages Display */}
              <div className="flex-1 bg-black/40 backdrop-blur-xl p-6 min-h-0">
                <ScrollArea className="h-full pr-4 -mr-4">
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white font-semibold text-sm">Remix Studio</h2>
                          <p className="text-white/60 text-xs">AI-powered music remixing</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setChatStarted(false)}
                        className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-8"
                      >
                        New Session
                      </Button>
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
                                ? 'bg-white text-black'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/10 p-3 backdrop-blur-sm">
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

              {/* Chat Input - No borders */}
              <div className="bg-black/40 backdrop-blur-xl p-4 flex justify-center">
                <AI_Prompt onSubmit={handleSendMessage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Studio;