import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostBySlug, calculateReadingTime } from "@/utils/blog";
import { GiscusComments } from "@/app/components/blog";
import Footer from "@/app/components/contact+footer/Footer";
import BlogPageWrapper from "../BlogPageWrapper";
import BlogPostContentClient from "./BlogPostContentClient";

// Force dynamic rendering to avoid SSG issues with MDXRemote
export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Shourya Mishra",
    };
  }

  return {
    title: `${post.metadata.title} | Shourya Mishra`,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: "article",
      publishedTime: post.metadata.date,
      tags: post.metadata.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    const mdxSource = await serialize(post.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight, rehypeSlug],
      },
    });

    const readingTime = calculateReadingTime(post.content);

    return (
      <BlogPageWrapper>
        <main className="min-h-screen pt-32 sm:pt-40 pb-20">
          <BlogPostContentClient
            title={post.metadata.title}
            date={post.metadata.date}
            readingTime={readingTime}
            tags={post.metadata.tags}
            source={mdxSource}
          />

          <div className="max-w-3xl mx-auto">
            <GiscusComments />
          </div>

          <Footer />
        </main>
      </BlogPageWrapper>
    );
  } catch (error) {
    console.error("Error rendering blog post:", error);
    throw error; // Re-throw to trigger error boundary
  }
}
