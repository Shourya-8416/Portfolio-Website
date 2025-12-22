import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostBySlug, calculateReadingTime } from "@/utils/blog";
import { BlogPostContent, GiscusComments } from "@/app/components/blog";
import Footer from "@/app/components/contact+footer/Footer";
import BlogPageWrapper from "../BlogPageWrapper";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.metadata.slug,
  }));
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
        <BlogPostContent
          title={post.metadata.title}
          date={post.metadata.date}
          readingTime={readingTime}
          tags={post.metadata.tags}
          content={mdxSource}
        />

        <div className="max-w-3xl mx-auto">
          <GiscusComments />
        </div>

        <Footer />
      </main>
    </BlogPageWrapper>
  );
}
