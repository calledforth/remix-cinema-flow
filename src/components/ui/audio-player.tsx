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
      
      analyserNode.fftSize = 256;
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / dataArray.length * 2;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, 'rgba(135, 206, 250, 0.3)'); // Light blue with transparency
      gradient.addColorStop(1, 'rgba(135, 206, 250, 0.8)'); // Light blue
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      
      x += barWidth;
    }

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
    <div className={`bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 space-y-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />
      
      {/* Track Info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium text-base">{title}</h4>
          <p className="text-neutral-400 text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        {downloadUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Waveform Visualization */}
      <div className="relative h-24 bg-neutral-800/30 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={96}
          className="w-full h-full"
        />
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-1">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-sky-300/30 rounded-full"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full [&>span]:bg-white/10 [&>span>span]:bg-white [&>span>span>span]:bg-white [&>span>span>span]:border-white"
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
            className="text-white hover:text-white hover:bg-white/10 rounded-xl w-12 h-12"
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
            className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl"
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
            className="w-20 [&>span]:bg-white/10 [&>span>span]:bg-white [&>span>span>span]:bg-white [&>span>span>span]:border-white"
          />
        </div>
      </div>
    </div>
  );
};
