"use client";

import { useEffect, useRef } from "react";

interface TweetProps {
  id: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
        createTweet: (
          id: string,
          container: HTMLElement,
          options?: object
        ) => Promise<HTMLElement>;
      };
    };
  }
}

export default function Tweet({ id }: TweetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !containerRef.current) return;

    // Load Twitter widget script if not already loaded
    const loadTwitterScript = () => {
      if (window.twttr) {
        window.twttr.widgets.createTweet(id, containerRef.current!, {
          theme: "dark",
          align: "center",
        });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        if (window.twttr && containerRef.current) {
          window.twttr.widgets.createTweet(id, containerRef.current, {
            theme: "dark",
            align: "center",
          });
        }
      };
      document.body.appendChild(script);
    };

    loadTwitterScript();
  }, [id]);

  if (!id) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="tweet-embed my-6 flex justify-center"
      data-tweet-id={id}
    />
  );
}
