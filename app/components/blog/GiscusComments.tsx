"use client";
import React from "react";
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
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
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
