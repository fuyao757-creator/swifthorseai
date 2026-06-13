import { HERO_HORSE_POSTER } from "@/lib/hero-video";

/** 服务端渲染的氛围层：首屏 HTML 即显示，与页面同时出现 */
export function LandingHorseAtmosphere() {
  return (
    <div
      className="landing-horse-atmosphere"
      aria-hidden
      style={{ backgroundImage: `url(${HERO_HORSE_POSTER})` }}
    />
  );
}
