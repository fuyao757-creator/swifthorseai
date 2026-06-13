"use client";

import { useEffect, useRef, useState } from "react";
import {
  HERO_HORSE_VIDEO_DESKTOP,
  HERO_HORSE_VIDEO_MOBILE,
  MOBILE_BREAKPOINT,
} from "@/lib/hero-video";

function pickHeroVideoSrc(): string {
  return window.matchMedia(MOBILE_BREAKPOINT).matches
    ? HERO_HORSE_VIDEO_MOBILE
    : HERO_HORSE_VIDEO_DESKTOP;
}

function scheduleIdle(task: () => void, timeoutMs = 4500) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(task, { timeout: timeoutMs });
  } else {
    window.setTimeout(task, 800);
  }
}

export function LandingHorseLayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState(HERO_HORSE_VIDEO_DESKTOP);
  const [useDesktopFallback, setUseDesktopFallback] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const activeSrc = useDesktopFallback ? HERO_HORSE_VIDEO_DESKTOP : videoSrc;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    scheduleIdle(() => {
      setVideoSrc(pickHeroVideoSrc());
      setLoadVideo(true);
    });
  }, []);

  useEffect(() => {
    if (!loadVideo) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 1.15;
    void video.play().catch(() => undefined);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [activeSrc, loadVideo]);

  useEffect(() => {
    setVideoReady(false);
  }, [activeSrc]);

  return (
    <div ref={wrapRef} className="landing-horse-layer" aria-hidden>
      <div className="landing-horse-video-wrap">
        {loadVideo ? (
          <video
            ref={videoRef}
            id="landing-horse-video"
            className={`landing-horse-video${videoReady ? " landing-horse-video--ready" : ""}`}
            src={activeSrc}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            preload="none"
            onLoadedData={() => {
              setVideoReady(true);
              void videoRef.current?.play().catch(() => undefined);
            }}
            onCanPlay={() => {
              setVideoReady(true);
              void videoRef.current?.play().catch(() => undefined);
            }}
            onError={() => {
              if (!useDesktopFallback) setUseDesktopFallback(true);
            }}
            {...({
              "webkit-playsinline": "true",
              "x5-playsinline": "true",
              "x5-video-player-type": "h5",
              "x5-video-player-fullscreen": "false",
            } as React.VideoHTMLAttributes<HTMLVideoElement>)}
          />
        ) : null}
      </div>
      <div className="landing-horse-wash" />
      <div className="landing-horse-top-cover" />
      <div className="landing-horse-bottom-cover" />
    </div>
  );
}

export {
  HERO_HORSE_VIDEO_DESKTOP,
  HERO_HORSE_VIDEO_MOBILE,
  HERO_HORSE_POSTER,
} from "@/lib/hero-video";
