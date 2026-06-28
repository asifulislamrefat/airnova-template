import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, Maximize } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeAPI(): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
  });
}

function CustomVideoPlayer({
  youtubeId,
  fill = false,
  onPlayingChange,
  playSignal,
}: {
  youtubeId: string;
  fill?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  playSignal?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tick: number | undefined;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !mountRef.current) return;
      playerRef.current = new YT.Player(mountRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            setReady(true);
            setDuration(e.target.getDuration());
            setVolume(e.target.getVolume() / 100);
            setMuted(e.target.isMuted());
          },
          onStateChange: (e: any) => {
            // 1 playing, 2 paused, 0 ended
            if (e.data === 1) {
              setPlaying(true);
              onPlayingChange?.(true);
            } else if (e.data === 2 || e.data === 0) {
              setPlaying(false);
              onPlayingChange?.(false);
            }
            if (!duration) setDuration(e.target.getDuration());
          },
        },
      });
    });
    tick = window.setInterval(() => {
      const p = playerRef.current;
      if (p && typeof p.getCurrentTime === "function") {
        setTime(p.getCurrentTime() || 0);
        const d = p.getDuration?.() || 0;
        if (d && d !== duration) setDuration(d);
      }
    }, 250);
    return () => {
      cancelled = true;
      if (tick) window.clearInterval(tick);
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  useEffect(() => {
    if (playSignal === undefined) return;
    const p = playerRef.current;
    if (p && typeof p.playVideo === "function") p.playVideo();
  }, [playSignal]);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const onVolume = (val: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(Math.round(val * 100));
    setVolume(val);
    if (val === 0) {
      p.mute();
      setMuted(true);
    } else if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    }
  };

  const onSeek = (val: number) => {
    const p = playerRef.current;
    if (!p || !duration) return;
    const t = (val / 100) * duration;
    p.seekTo(t, true);
    setTime(t);
  };

  const toggleFullscreen = () => {
    const w = wrapRef.current;
    if (!w) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else w.requestFullscreen?.();
  };

  const nudgeControls = () => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2500);
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      onMouseMove={nudgeControls}
      onMouseLeave={() => playing && setShowControls(false)}
      className={`group relative overflow-hidden bg-black ${fill ? "size-full" : "rounded-2xl shadow-2xl"}`}
      style={fill ? undefined : { aspectRatio: "16 / 9" }}
    >
      <div ref={mountRef} className="absolute inset-0 size-full" />
      {/* Click shield over iframe to capture play/pause taps */}
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={togglePlay}
        className="absolute inset-0 size-full cursor-pointer bg-transparent"
      />

      {/* Center play overlay when paused */}
      {ready && !playing && (
        <button
          type="button"
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center bg-black/30"
        >
          <span className="grid size-20 place-items-center rounded-full bg-white shadow-2xl">
            <Play className="size-7 fill-[#070606] text-[#070606]" />
          </span>
        </button>
      )}

      {/* Bottom control bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 transition-opacity duration-300 ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Scrubber */}
        <div className="pointer-events-auto relative mb-3 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute inset-y-0 left-0 bg-white"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            aria-label="Seek"
            className="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>

        <div className="pointer-events-auto flex items-center gap-4 text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="grid size-10 place-items-center rounded-full bg-white text-[#070606] transition hover:scale-105"
          >
            {playing ? (
              <Pause className="size-4 fill-[#070606]" />
            ) : (
              <Play className="size-4 fill-[#070606]" />
            )}
          </button>

          <span className="font-mono text-xs tabular-nums tracking-tight text-white/80">
            {fmt(time)} <span className="text-white/70">/ {fmt(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="grid size-9 place-items-center rounded-full text-white hover:bg-white/10"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>
              <div className="relative h-1 w-20 overflow-hidden rounded-full bg-white/20">
                <div
                  className="absolute inset-y-0 left-0 bg-white"
                  style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => onVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="grid size-9 place-items-center rounded-full text-white hover:bg-white/10"
            >
              <Maximize className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomVideoPlayer;
