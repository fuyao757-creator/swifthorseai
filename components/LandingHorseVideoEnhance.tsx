"use client";

import { useEffect } from "react";

export function LandingHorseVideoEnhance() {
  useEffect(() => {
    const video = document.getElementById(
      "landing-horse-video"
    ) as HTMLVideoElement | null;
    if (!video) return;

    video.playbackRate = 1.15;

    void video.play().catch(() => undefined);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      video.pause();
      return;
    }

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
  }, []);

  return null;
}
