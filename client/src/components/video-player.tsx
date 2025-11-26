import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Movie } from "@shared/schema";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  movie: Movie;
  onBack: () => void;
}

export function VideoPlayer({ movie, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const resetHideControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => Math.min(1, prev + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 0.1));
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            onBack();
          }
          break;
      }
      resetHideControlsTimer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onBack, resetHideControlsTimer]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    resetHideControlsTimer();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black"
      onMouseMove={resetHideControlsTimer}
      onClick={togglePlay}
      data-testid="video-player-container"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={`/api/movies/${movie.id}/stream`}
        poster={movie.posterUrl || undefined}
        data-testid="video-element"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gradient-to-b from-black/80 to-transparent">
          <Button
            size="icon"
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <h1 className="text-base sm:text-xl font-semibold text-white line-clamp-1">{movie.title}</h1>
        </div>

        {/* Bottom Controls */}
        <div className="video-gradient-overlay p-2 sm:p-4 pb-4 sm:pb-6">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
              data-testid="video-progress-slider"
            />
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-300 mt-1">
              <span data-testid="current-time">{formatTime(currentTime)}</span>
              <span data-testid="duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Skip Back 10s */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20 relative h-8 w-8 sm:h-9 sm:w-9"
                data-testid="button-skip-back"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute text-[8px] sm:text-[10px] font-bold">10</span>
              </Button>

              {/* Play/Pause */}
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 w-10 h-10 sm:w-12 sm:h-12"
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5 sm:ml-1" />
                )}
              </Button>

              {/* Skip Forward 10s */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20 relative h-8 w-8 sm:h-9 sm:w-9"
                data-testid="button-skip-forward"
              >
                <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute text-[8px] sm:text-[10px] font-bold">10</span>
              </Button>

              {/* Volume - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 ml-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  data-testid="button-mute"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={(v) => {
                    setVolume(v[0]);
                    setIsMuted(false);
                  }}
                  className="w-24"
                  data-testid="volume-slider"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mute button visible on mobile */}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className="sm:hidden text-white hover:bg-white/20 h-8 w-8"
                data-testid="button-mute-mobile"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
                data-testid="button-fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
