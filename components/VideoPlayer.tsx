
import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, autoplay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const controlsTimeoutRef = useRef<number | null>(null);

  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

  // Auto-hide controls logic
  const handleInactivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    // Only hide controls if playing and NOT focused on an interactive element (except the container)
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        // Don't hide if the user is currently interacting with a control element via D-pad
        const activeElement = document.activeElement;
        const isControlFocused = activeElement && playerContainerRef.current?.contains(activeElement) && activeElement !== videoRef.current;
        
        if (!isControlFocused) {
          setShowControls(false);
        }
      }, 4000);
    }
  };

  useEffect(() => {
    // Initial focus on the play button for TV users
    if (!isYouTube && playButtonRef.current) {
      playButtonRef.current.focus();
    }

    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (!playerContainerRef.current?.contains(document.activeElement)) return;

      switch(e.key) {
        case 'ArrowLeft':
          // If we are not focused on a slider, seek
          if (document.activeElement?.tagName !== 'INPUT') {
            seekRelative(-10);
            handleInactivity();
          }
          break;
        case 'ArrowRight':
          if (document.activeElement?.tagName !== 'INPUT') {
            seekRelative(10);
            handleInactivity();
          }
          break;
        case 'MediaPlayPause':
        case ' ':
          if (document.activeElement?.tagName !== 'BUTTON') {
            togglePlay();
            e.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      handleInactivity();
    }
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (isYouTube) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
        <iframe
          src={`${url}${url.includes('?') ? '&' : '?'}autoplay=${autoplay ? '1' : '0'}&modestbranding=1&rel=0`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div 
      ref={playerContainerRef}
      onMouseMove={handleInactivity}
      onTouchStart={handleInactivity}
      onFocusCapture={handleInactivity}
      className={`relative w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl group select-none transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[200] rounded-none' : 'ring-1 ring-white/10'}`}
    >
      <video
        ref={videoRef}
        src={url}
        autoPlay={autoplay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-contain"
      />

      {/* Center Large Play State Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-20 h-20 bg-yellow-400/90 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.5 3.5a1 1 0 011.5-.866l11 6.5a1 1 0 010 1.732l-11 6.5a1 1 0 01-1.5-.866v-13z" />
            </svg>
          </div>
        </div>
      )}

      {/* VLC Style Bottom Controls */}
      <div 
        className={`absolute inset-0 flex flex-col justify-end transition-all duration-500 bg-gradient-to-t from-black/95 via-black/40 to-transparent ${showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-4">
          
          {/* Timeline / Seek Bar */}
          <div className="space-y-2">
            <div className="relative group/seek flex items-center h-6">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-yellow-400/50 accent-yellow-400 transition-all z-10"
              />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-yellow-400 rounded-full pointer-events-none transition-all"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white">{title}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Play/Pause Button */}
              <button 
                ref={playButtonRef}
                onClick={togglePlay}
                className="p-3 rounded-xl bg-white/5 text-white hover:bg-yellow-400 hover:text-black focus:bg-yellow-400 focus:text-black focus:scale-110 transition-all outline-none border border-white/5"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
              </button>

              {/* Seek Back */}
              <button 
                onClick={() => seekRelative(-10)}
                className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 focus:bg-white/10 focus:scale-110 transition-all outline-none border border-white/5 hidden sm:block"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" /></svg>
              </button>

              {/* Seek Forward */}
              <button 
                onClick={() => seekRelative(10)}
                className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 focus:bg-white/10 focus:scale-110 transition-all outline-none border border-white/5 hidden sm:block"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6L14.6 7.2A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" /></svg>
              </button>

              <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>

              {/* Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button 
                  onClick={toggleMute}
                  className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 focus:bg-white/10 focus:scale-110 transition-all outline-none border border-white/5"
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M12 5l-4.707 4.707H4a1 1 0 00-1 1v4a1 1 0 001 1h3.293L12 19V5z" /></svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/vol:w-20 group-focus-within/vol:w-20 transition-all duration-300 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-white/30 text-[10px] font-black uppercase tracking-widest hidden lg:block">CinePrime Player v2.1</span>
              
              {/* Fullscreen Button */}
              <button 
                onClick={toggleFullscreen}
                className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 focus:bg-white/10 focus:scale-110 transition-all outline-none border border-white/5"
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 9L4 4m0 0l5 5m-5-5h5m11 11l5 5m0 0l-5-5m5 5v-5" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
