import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Post Not Found</h2>
        <p className="text-white/60 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 bg-[#3c84c7] rounded-lg hover:bg-[#5a9fd4] transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
