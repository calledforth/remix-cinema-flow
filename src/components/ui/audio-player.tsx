
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

interface AudioPlayerProps {
  src: string;
  title?: string;
  downloadUrl?: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Audio Track',
  downloadUrl,
  className = ''
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number, life: number, maxLife: number}>>([]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      initializeAudioContext();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src]);

  const initializeAudioContext = () => {
    const audio = audioRef.current;
    if (!audio || audioContext) return;

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      const source = context.createMediaElementSource(audio);
      
      source.connect(analyserNode);
      analyserNode.connect(context.destination);
      
      analyserNode.fftSize = 512;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      setDataArray(dataArray);
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw main waveform bars
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * 0.7;
      const x = i * barWidth;
      
      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(0, centerY - barHeight/2, 0, centerY + barHeight/2);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 - i/dataArray.length * 0.3})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.7 - i/dataArray.length * 0.2})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${0.3 - i/dataArray.length * 0.1})`);
      
      ctx.fillStyle = gradient;
      
      // Draw symmetric bars
      ctx.fillRect(x, centerY - barHeight/2, barWidth - 2, barHeight);
      
      // Add particle effects for high frequency peaks
      if (dataArray[i] > 180 && Math.random() > 0.7) {
        particlesRef.current.push({
          x: x + barWidth/2,
          y: centerY - barHeight/2,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: 30
        });
      }
    }

    // Draw and update particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 1;
      
      const alpha = 1 - (particle.life / particle.maxLife);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      ctx.fillRect(particle.x, particle.y, 2, 2);
      
      return particle.life < particle.maxLife;
    });

    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
  };

  useEffect(() => {
    if (isPlaying && analyser && dataArray) {
      drawWaveform();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying, analyser, dataArray]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`relative bg-neutral-900/60 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-6 space-y-5 overflow-hidden ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />
      
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] pointer-events-none" />
      
      {/* Track Info */}
      <div className="relative flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-white font-medium text-base tracking-wide">{title}</h4>
          <div className="flex items-center gap-3 text-neutral-400 text-sm">
            <span>{formatTime(currentTime)}</span>
            <div className="w-1 h-1 bg-neutral-600 rounded-full" />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        {downloadUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Enhanced Waveform Visualization */}
      <div className="relative h-32 bg-neutral-950/50 rounded-xl overflow-hidden border border-neutral-800/30">
        <canvas
          ref={canvasRef}
          width={800}
          height={128}
          className="w-full h-full"
        />
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-1">
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-white/20 rounded-full transition-all duration-300"
                  style={{
                    height: `${Math.sin(i * 0.2) * 30 + 40}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-neutral-950/10 pointer-events-none" />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full [&>span]:bg-neutral-800/50 [&>span>span]:bg-white/90 [&>span>span>span]:bg-white [&>span>span>span]:border-white/20 [&>span>span>span]:shadow-lg"
          disabled={isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            disabled={isLoading}
            className="text-white hover:text-white hover:bg-white/10 rounded-xl w-12 h-12 border border-transparent hover:border-white/10 transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all duration-200"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-20 [&>span]:bg-neutral-800/50 [&>span>span]:bg-white/90 [&>span>span>span]:bg-white [&>span>span>span]:border-white/20"
          />
        </div>
      </div>
    </div>
  );
};
