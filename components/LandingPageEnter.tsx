"use client";

import { useEffect } from "react";

/** 首页导航栏入场；主内容默认可见，不阻塞 LCP */
export function LandingPageEnter() {
  useEffect(() => {
    document.querySelector(".page-bg")?.classList.add("landing-enter-ready");
  }, []);

  return null;
}
