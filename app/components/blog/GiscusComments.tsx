"use client";
import React from "react";
import Link from "next/link";
import Giscus from "@giscus/react";

export default function GiscusComments() {
  const hideBlobity = () => {
    // Blobity creates a canvas element
    const blobityCanvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (blobityCanvas) {
      blobityCanvas.style.opacity = "0";
      blobityCanvas.style.transition = "opacity 0.15s ease";
    }
  };

  const showBlobity = () => {
    const blobityCanvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (blobityCanvas) {
      blobityCanvas.style.opacity = "1";
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Comments</h2>
        <Link
          href="https://github.com/Shourya-8416/blog-discussion/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>Manage on GitHub</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>
      </div>
      <div
        data-no-blobity
        className="giscus-wrapper"
        onMouseEnter={hideBlobity}
        onMouseLeave={showBlobity}
      >
        <Giscus
          repo="Shourya-8416/blog-discussion"
          repoId="R_kgDOQs4izw"
          category="Announcements"
          categoryId="DIC_kwDOQs4iz84C0GPW"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="1"
          inputPosition="top"
          theme="dark"
          lang="en"
          loading="lazy"
        />
      </div>
    </section>
  );
}
