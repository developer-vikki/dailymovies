// components/home/infinite-trigger.tsx

"use client";

import { useEffect, useRef } from "react";

export default function InfiniteScrollTrigger({
  onVisible,
  hasMore,
}: {
  onVisible: () => void;
  hasMore: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return <div ref={ref} className="h-20 w-full" />;
}