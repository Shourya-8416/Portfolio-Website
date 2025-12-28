import { getAllPostsRemote } from "@/utils/github-content";
import { getAllDiscussionMetrics } from "@/utils/github";
import { BlogHeader, BlogGrid } from "../components/blog";
import Footer from "../components/contact+footer/Footer";
import BlogPageWrapper from "./BlogPageWrapper";
import Link from "next/link";

export const metadata = {
  title: "Blog | Shourya Mishra",
  description: "Thoughts, tutorials, and insights on software development, Java, GenAI, and cloud technologies.",
};

// ISR: Revalidate every 60 seconds for automatic content updates
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPostsRemote();
  const metricsMap = await getAllDiscussionMetrics();
  
  // Convert Map to a serializable object for client component
  const metrics: Record<string, { commentCount: number; reactionCount: number }> = {};
  metricsMap.forEach((value, key) => {
    metrics[key] = value;
  });

  return (
    <BlogPageWrapper>
      <main className="min-h-screen pt-32 sm:pt-40 pb-20">
        <section className="mb-16">
          {/* Go Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <BlogHeader
            title="Blog"
            description="Thoughts, tutorials, and insights on software development."
          />

          {posts.length === 0 ? (
            <p className="text-white/60 text-lg">No posts yet. Check back soon!</p>
          ) : (
            <BlogGrid posts={posts} metrics={metrics} />
          )}
        </section>

        <Footer />
      </main>
    </BlogPageWrapper>
  );
}
