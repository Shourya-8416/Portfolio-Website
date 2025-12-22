import { getAllPosts } from "@/utils/blog";
import { getAllDiscussionMetrics } from "@/utils/github";
import { BlogHeader, BlogCard } from "../components/blog";
import Footer from "../components/contact+footer/Footer";
import BlogPageWrapper from "./BlogPageWrapper";

export const metadata = {
  title: "Blog | Shourya Mishra",
  description: "Thoughts, tutorials, and insights on software development, Java, GenAI, and cloud technologies.",
};

export default async function BlogPage() {
  const posts = getAllPosts();
  const metrics = await getAllDiscussionMetrics();

  return (
    <BlogPageWrapper>
      <main className="min-h-screen pt-32 sm:pt-40 pb-20">
        <section className="mb-16">
          <BlogHeader
            title="Blog"
            description="Thoughts, tutorials, and insights on software development."
          />

          {posts.length === 0 ? (
            <p className="text-white/60 text-lg">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => {
                const postMetrics = metrics.get(post.metadata.slug);
                return (
                  <BlogCard
                    key={post.metadata.slug}
                    title={post.metadata.title}
                    slug={post.metadata.slug}
                    date={post.metadata.date}
                    description={post.metadata.description}
                    tags={post.metadata.tags}
                    featuredImage={post.metadata.featuredImage}
                    commentCount={postMetrics?.commentCount ?? 0}
                    reactionCount={postMetrics?.reactionCount ?? 0}
                    index={index}
                  />
                );
              })}
            </div>
          )}
        </section>

        <Footer />
      </main>
    </BlogPageWrapper>
  );
}
