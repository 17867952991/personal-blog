import { type CSSProperties, type ChangeEvent, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PortfolioWork } from "../types";

type WorkDetailModalProps = {
  work: PortfolioWork | null;
  onClose: () => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  const reduceMotion = useReducedMotion();
  const playerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressPercent = duration ? Math.min((currentTime / duration) * 100, 100) : 0;
  const volumePercent = isMuted ? 0 : volume * 100;
  const progressStyle = { "--range-progress": `${progressPercent}%` } as CSSProperties;
  const volumeStyle = { "--range-progress": `${volumePercent}%` } as CSSProperties;

  useEffect(() => {
    if (!work) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, work]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVolume(1);
    setIsMuted(false);
  }, [work?.videoUrl]);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
    };
  }, []);

  const updateMediaTime = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setCurrentTime(video.currentTime);

    if (Number.isFinite(video.duration)) {
      setDuration(video.duration);
    }
  };

  const updateMediaVolume = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setVolume(video.volume);
    setIsMuted(video.muted || video.volume === 0);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isPlaying) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      setIsPlaying(false);
    });
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const nextTime = Number(event.target.value);

    if (!video || Number.isNaN(nextTime)) {
      return;
    }

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const nextVolume = Number(event.target.value);

    if (!video || Number.isNaN(nextVolume)) {
      return;
    }

    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(video.muted);
  };

  const handleToggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleFullscreen = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void player.requestFullscreen?.();
  };

  return (
    <AnimatePresence>
      {work ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#1B133C]/40 px-4 py-6 backdrop-blur-lg"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-detail-title"
            onClick={(event) => event.stopPropagation()}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl overflow-hidden rounded-xl border border-white/70 bg-[#08070f] text-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div
              ref={playerRef}
              className="work-video-player relative aspect-video w-full bg-black"
            >
              {work.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    preload="metadata"
                    poster={work.coverImage}
                    onClick={handleTogglePlay}
                    onLoadedMetadata={updateMediaTime}
                    onDurationChange={updateMediaTime}
                    onTimeUpdate={updateMediaTime}
                    onVolumeChange={updateMediaVolume}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="h-full w-full bg-black object-contain"
                  >
                    <source src={work.videoUrl} type="video/mp4" />
                  </video>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/88 via-black/36 to-transparent"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="关闭作品详情"
                    className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/45 text-white shadow-sm backdrop-blur-md transition hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:right-4 sm:top-4"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div
                    data-testid="video-controls"
                    className="work-video-controls absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-[#090813]/64 p-3 text-white shadow-[0_18px_44px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:inset-x-4 sm:bottom-4"
                  >
                    <input
                      type="range"
                      aria-label="播放进度"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={duration ? currentTime : 0}
                      onChange={handleSeek}
                      style={progressStyle}
                      className="video-range w-full"
                    />
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        aria-label={isPlaying ? "暂停" : "播放"}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#1B133C] shadow-[0_8px_22px_rgba(255,255,255,0.12)] transition hover:bg-white/90 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Play className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                      <span className="min-w-[6rem] text-xs font-semibold tabular-nums text-white/88 sm:text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                      <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={handleToggleMute}
                          aria-label={isMuted ? "取消静音" : "静音"}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/18 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Volume2 className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                        <input
                          type="range"
                          aria-label="音量"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          style={volumeStyle}
                          className="video-range w-20 sm:w-24"
                        />
                        <button
                          type="button"
                          onClick={handleFullscreen}
                          aria-label={isFullscreen ? "退出全屏" : "全屏播放"}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/18 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                        >
                          {isFullscreen ? (
                            <Minimize2 className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Maximize2 className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : work.coverImage ? (
                <img
                  src={work.coverImage}
                  alt={`${work.title} 封面`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/58 text-sm font-semibold text-[#1B133C]/55">
                  影片待添加
                </div>
              )}
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
