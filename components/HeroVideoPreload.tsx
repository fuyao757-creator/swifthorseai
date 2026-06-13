import { HERO_HORSE_POSTER } from "@/lib/hero-video";

/** 仅预加载轻量封面；视频延后加载，避免阻塞首屏 */
export function HeroVideoPreload() {
  return (
    <link
      rel="preload"
      href={HERO_HORSE_POSTER}
      as="image"
      fetchPriority="high"
    />
  );
}
