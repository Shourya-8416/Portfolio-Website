"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-white/60 mb-8">
          We encountered an error while loading this blog post. Please try again
          or go back to the blog listing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] rounded-lg hover:from-[#d9d9d93f] hover:to-[#7373733f] transition-all"
          >
            Try again
          </button>
          <Link
            href="/blog"
            className="px-6 py-3 bg-[#3c84c7] rounded-lg hover:bg-[#5a9fd4] transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
