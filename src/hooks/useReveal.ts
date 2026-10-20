import { useEffect, useRef } from "react";

/**
 * Opt-in reveal on scroll. Content is visible in the HTML; after hydration,
 * only elements still below the viewport are hidden, then revealed once.
 * - Nothing is hidden without IntersectionObserver or with reduced motion.
 * - A scroll check backs up the observer, so a fast fling past an element
 *   (which an observer can miss) still reveals it.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const threshold = () => window.innerHeight * 0.92;
    if (el.getBoundingClientRect().top < threshold()) return; // already on screen or above: leave as is

    el.dataset.reveal = "pending";
    let frame = 0;
    const reveal = () => {
      el.dataset.reveal = "shown";
      cleanup();
    };
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && reveal(), {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.01,
    });
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (el.getBoundingClientRect().top < threshold()) reveal();
      });
    };
    function cleanup() {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    }
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cleanup();
      if (el.dataset.reveal === "pending") delete el.dataset.reveal;
    };
  }, []);
  return ref;
}
