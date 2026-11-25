export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

type PageHit = {
  page_path: string;
  page_location: string;
  page_title: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __bmFlushPageviews?: () => void;
  }
}

const queue: PageHit[] = [];
let lastSentKey = "";

function sendPageview(hit: PageHit) {
  const key = `${hit.page_path}|${hit.page_title}`;
  if (key === lastSentKey) return;
  lastSentKey = key;
  window.gtag?.("event", "page_view", hit);
}

export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  const path = url.startsWith("/") ? url : `/${url}`;
  const hit: PageHit = {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  };
  if (typeof window.gtag !== "function") {
    queue.push(hit);
    return;
  }
  sendPageview(hit);
}

export function flushPageviews() {
  if (typeof window.gtag !== "function") return;
  while (queue.length > 0) {
    const hit = queue.shift();
    if (hit) sendPageview(hit);
  }
}
