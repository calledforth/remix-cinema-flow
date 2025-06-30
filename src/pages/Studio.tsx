import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Music, Mic, Upload, Settings, User, Plus, Menu, X, Sparkles, Headphones, Play, Copy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { AudioPlayer } from '@/components/ui/audio-player';
import RemixCover from "@/components/ui/RemixCover";
import { AI_Prompt } from "@/components/ui/animated-ai-input";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "motion/react";
import { apiClient, uploadWithProgress, type JobStatus } from '@/lib/api-client';
import { wsClient } from '@/lib/websocket-client';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'status';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  jobId?: string;
  status?: 'uploading' | 'processing' | 'completed' | 'error' | 'initializing' | 'locating_file' | 'analyzing' | 'extracting_metadata' | 'preparing_ai' | 'ai_processing' | 'parsing_ai' | 'validating' | 'effects_applying' | 'rendering' | 'finalizing';
  steps?: string[];
  resultAudioUrl?: string;
  downloadUrl?: string;
  error?: string;
}

const Studio = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [activeJobs, setActiveJobs] = useState<Map<string, JobStatus>>(new Map());
  const [inputWarning, setInputWarning] = useState<string | null>(null);
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

  // Initialize backend connection
  useEffect(() => {
    const initializeBackend = async () => {
      try {
        // Check backend health
        const isHealthy = await apiClient.healthCheck();
        setIsBackendConnected(isHealthy);
        
        if (isHealthy) {
          // Connect to WebSocket
          await wsClient.connect();
          
          // Set up WebSocket event listeners
          wsClient.on('job_update', (jobStatus: JobStatus) => {
            console.log('📡 Received job update:', jobStatus);
            setActiveJobs(prev => new Map(prev.set(jobStatus.job_id || jobStatus.file_id, jobStatus)));
            
            // Update message status - FIX: Match on job_id instead of file_id
            setMessages(prev => prev.map(msg => {
              if (msg.jobId === jobStatus.job_id) {
                const cleanMessage = jobStatus.message.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '').trim();
                
                // Avoid adding duplicate steps
                const newSteps = msg.steps?.includes(cleanMessage) ? msg.steps : [...(msg.steps || []), cleanMessage];

                console.log('🔄 Updating message for job:', jobStatus.job_id, 'Status:', jobStatus.status);
                return {
                  ...msg,
                  status: jobStatus.status as any,
                  steps: newSteps,
                  timestamp: new Date(),
                  resultAudioUrl: jobStatus.result_file ? apiClient.getAudioUrl(jobStatus.result_file) : undefined,
                  downloadUrl: jobStatus.result_file ? apiClient.getDownloadUrl(jobStatus.job_id) : undefined,
                  error: jobStatus.error
                };
              }
              return msg;
            }));
          });

          wsClient.on('connected', () => {
            console.log('✅ WebSocket connected and ready');
          });

          wsClient.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
          });

          console.log('✅ Backend connected successfully');
        } else {
          console.warn('⚠️ Backend health check failed');
        }
      } catch (error) {
        console.error('❌ Backend initialization failed:', error);
        setIsBackendConnected(false);
      }
    };

    initializeBackend();

    return () => {
      wsClient.disconnect();
    };
  }, []);

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadedFileId(null);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setUploadedFile(file);
    
    if (!isBackendConnected) {
      console.warn('⚠️ Backend not connected, file upload skipped');
      return;
    }

    try {
      // Create upload message
      const uploadMessage: Message = {
        id: Date.now().toString(),
        type: 'status',
        content: `📤 Uploading ${file.name}...`,
        timestamp: new Date(),
        status: 'uploading'
      };
      setMessages(prev => [...prev, uploadMessage]);

      // Upload file
      const uploadResult = await uploadWithProgress(file, () => {
        // Just update text, no progress tracking
        setMessages(prev => prev.map(msg => 
          msg.id === uploadMessage.id 
            ? { ...msg, content: `📤 Processing ${file.name}...` }
            : msg
        ));
      });

      // Update upload message to completed
      setMessages(prev => prev.map(msg => 
        msg.id === uploadMessage.id 
          ? { 
              ...msg, 
              content: `✅ ${file.name} uploaded successfully`, 
              status: 'completed'
            }
          : msg
      ));

      setUploadedFileId(uploadResult.file_id);
      setInputWarning(null); // Clear any warning when file is uploaded
      console.log('✅ File uploaded:', uploadResult);

    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'status',
        content: `❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue;
    if (!messageText.trim()) return;

    if (!isBackendConnected) {
      console.warn('⚠️ Backend not connected');
      return;
    }

    // Check if we have an uploaded file
    if (!uploadedFileId) {
      setInputWarning("Please upload an audio file first before I can help you remix it!");
      return;
    }

    // Clear any existing warning
    setInputWarning(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatStarted(true);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      // Start processing
      const processResult = await apiClient.processAudio(uploadedFileId, messageText);
      
      const cleanMessage = processResult.message.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '').trim();
      // Create processing status message
      const processingMessage: Message = {
        id: processResult.job_id,
        type: 'status',
        content: 'Remix in progress...',
        steps: [cleanMessage],
        timestamp: new Date(),
        jobId: processResult.job_id,
        status: 'initializing'
      };
      
      setMessages(prev => [...prev, processingMessage]);
      
      // Join WebSocket room for updates
      wsClient.joinJob(processResult.job_id);
      
      console.log('🔄 Processing started:', processResult);
      console.log('📋 Joined job room:', processResult.job_id);

    } catch (error) {
      console.error('❌ Processing failed:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'status') {
      return (
        <div className="w-full py-4">
          <div className="flex items-start gap-4">
            {/* Modern status indicator with subtle animation */}
            <div className="flex flex-col items-center gap-2 mt-1">
              {message.status !== 'completed' && message.status !== 'error' ? (
                <div className="relative">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-white/30 rounded-full animate-ping" />
                </div>
              ) : message.status === 'completed' ? (
                <div className="w-2 h-2 bg-white rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-red-400 rounded-full" />
              )}
              {message.steps && message.steps.length > 1 && (
                <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
              )}
            </div>
            
            {/* Clean steps container */}
            <div className="flex-1 space-y-2">
              {message.steps?.map((step, index) => (
                <motion.div
                  key={`${message.id}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className="group"
                >
                  <div className="bg-neutral-900/40 backdrop-blur-sm rounded-lg p-3 border border-neutral-800/30 hover:border-neutral-700/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      {/* Minimal step indicator */}
                      <div className="w-5 h-5 bg-neutral-800/60 border border-neutral-700/50 rounded-md flex items-center justify-center">
                        <span className="text-xs font-medium text-neutral-300">
                          {index + 1}
                        </span>
                      </div>
                      
                      {/* Step text with shimmer */}
                      <div className="flex-1">
                        {message.status !== 'completed' && message.status !== 'error' ? (
                          <TextShimmer 
                            className="text-sm font-medium" 
                            duration={2}
                            spread={1}
                          >
                            {step}
                          </TextShimmer>
                        ) : (
                          <span className="text-sm font-medium text-neutral-200">
                            {step}
                          </span>
                        )}
                      </div>
                      
                      {/* Minimal status icon */}
                      <div className="ml-auto">
                        {message.status === 'completed' ? (
                          <div className="w-4 h-4 bg-neutral-800/60 border border-neutral-700/50 rounded-md flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : message.status === 'error' ? (
                          <div className="w-4 h-4 bg-red-900/40 border border-red-700/50 rounded-md flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-4 h-4 bg-neutral-800/60 border border-neutral-700/50 rounded-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Audio player for completed results */}
          {message.resultAudioUrl && message.status === 'completed' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 ml-6"
            >
              <div className="bg-neutral-900/20 backdrop-blur-sm rounded-lg p-4 border border-neutral-800/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-neutral-800/60 border border-neutral-700/50 rounded-md flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-neutral-200">Remix Complete</span>
                </div>
                <AudioPlayer
                  src={message.resultAudioUrl}
                  title="Your Remix"
                  downloadUrl={message.downloadUrl}
                />
              </div>
            </motion.div>
          )}

          {/* Error display */}
          {message.error && message.status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 ml-6"
            >
              <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-4 border border-red-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-900/40 border border-red-700/50 rounded-md flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-red-300">Processing Error</span>
                </div>
                <p className="text-sm text-red-400 mt-2 ml-9">{message.error}</p>
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    // Regular user/AI messages
    return message.type === 'user' ? (
      <div className="flex justify-end">
        <div className="relative max-w-lg">
          <div className="bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-4 border border-neutral-600/80">
            <p className="text-white text-base leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="w-full">
        <div className="relative">
          <div className="rounded-2xl p-6">
            <p className="text-white text-base leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Clear warning when user starts typing
  const handleInputChange = (value: string) => {
    if (inputWarning && value.trim()) {
      setInputWarning(null);
    }
  };

  // Create input component with warning
  const InputWithWarning = ({ className }: { className?: string }) => (
    <div className={className}>
      <AI_Prompt 
        onSubmit={handleSendMessage} 
        onChange={handleInputChange}
      />
      {inputWarning && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{inputWarning}</span>
        </div>
      )}
    </div>
  );

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
          <AnimatePresence mode="wait">
            {!chatStarted ? (
              /* Initial Compact Layout - Centered */
              <motion.div 
                key="initial"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex-1 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl p-8 space-y-6"
              >
                {/* Remix Presets - Larger covers with intense gradients */}
                <div className="flex items-center space-x-4">
                  {remixCovers.map((remix) => (
                    <RemixCover key={remix.id} remix={remix} />
                  ))}
                </div>

                {/* Backend Status */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-neutral-400">
                    {isBackendConnected ? 'Backend Connected' : 'Backend Disconnected'}
                  </span>
                </div>

                {/* Upload Area - Using FileUpload component */}
                <div className="w-full max-w-2xl pt-10">
                  {!uploadedFile ? (
                    <FileUpload onChange={handleFileUpload} />
                  ) : (
                    <div className="bg-black border w-500px border-neutral-900 rounded-lg p-4 text-white relative overflow-hidden">
                      {/* Moving border animation */}
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/40 to-transparent animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse"></div>
                      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-white/40 to-transparent animate-pulse"></div>
                      
                      <div className="flex items-center space-x-4 relative z-10">
                        <Music className="w-6 h-6 text-white/70" />
                        <div className="flex-1">
                          <p className="font-bold">{uploadedFile.name}</p>
                          <p className="text-sm text-white/60">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {uploadedFileId && (
                        <div className="mt-3 flex items-center gap-2 text-green-400 relative z-10">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Ready to remix</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Input Bar */}
                <InputWithWarning className="w-full max-w-2xl relative flex flex-col items-center" />

              </motion.div>
            ) : (
              /* Chat View - No borders */
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex-1 flex flex-col gap-4 min-h-0"
              >
                {/* Messages Display */}
                <div className="flex-1 bg-black/40 backdrop-blur-xl p-6 min-h-0 flex justify-center relative">
                  {/* Sticky New Session Button - Top Right */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setChatStarted(false);
                      setMessages([]);
                      setUploadedFile(null);
                      setUploadedFileId(null);
                      setActiveJobs(new Map());
                    }}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                <div className="w-full max-w-4xl">
                  <ScrollArea 
                    className="h-full"
                  >
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center justify-end mb-6">
                      {/* New Session button removed from here */}
                    </div>

                    {/* Messages Area */}
                    <div className="space-y-4 font-sans">
                      {messages.map((message, index) => (
                        <div key={message.id} className="group">
                          {message.type === 'status' ? (
                            // Status messages in thinking style
                            <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                              {renderMessage(message)}
                            </div>
                          ) : (
                            // Regular user/AI messages with more spacing
                            <div className="pt-2">
                              {renderMessage(message)}
                              <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button 
                                  onClick={() => copyToClipboard(message.content)}
                                  className="text-neutral-400 hover:text-white text-sm flex items-center gap-1 hover:bg-neutral-800/50 rounded-md px-2 py-1 transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <span className="text-neutral-400 text-sm">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <div ref={messagesEndRef} />
                    </div>
                                      </div>
                  </ScrollArea>
                </div>
              </div>

                {/* Chat Input - No borders */}
                <div className="bg-black/40 backdrop-blur-xl p-4 flex justify-center">
                  <InputWithWarning className="w-full max-w-4xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Studio;
