import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getAllPostsRemote } from "@/utils/github-content";
import { getAllDiscussionMetrics } from "@/utils/github";
import { isValidSection, filterPostsBySection, Section, VALID_SECTIONS } from "@/utils/sections";
import { BlogHeader, BlogCard } from "@/app/components/blog";
import Footer from "@/app/components/contact+footer/Footer";
import BlogPageWrapper from "../../BlogPageWrapper";

// ISR: Revalidate every 60 seconds for automatic content updates
export const revalidate = 60;

interface SectionPageProps {
  params: Promise<{ section: string }>;
}

// Generate static params for all valid sections
export async function generateStaticParams() {
  return VALID_SECTIONS.map((section) => ({
    section: section,
  }));
}

// Dynamic metadata based on section name
export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { section } = await params;
  
  if (!isValidSection(section)) {
    return {
      title: "Section Not Found | Shourya Mishra",
    };
  }

  const sectionName = section.toUpperCase();
  return {
    title: `${sectionName} Posts | Shourya Mishra`,
    description: `Browse all blog posts in the ${sectionName} section.`,
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;

  // Validate section parameter
  if (!isValidSection(section)) {
    notFound();
  }

  // Fetch all posts and filter by section
  const posts = await getAllPostsRemote();
  const metrics = await getAllDiscussionMetrics();
  const filteredPosts = filterPostsBySection(posts, section.toUpperCase() as Section);

  const sectionName = section.toUpperCase();

  return (
    <BlogPageWrapper>
      <main className="min-h-screen pt-32 sm:pt-40 pb-20">
        <section className="mb-16">
          {/* Back to Blog link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors whitespace-nowrap gap-2"
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
              className="flex-shrink-0"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Blog</span>
          </Link>

          <BlogHeader
            title={`${sectionName} Posts`}
            description={`All blog posts in the ${sectionName} section.`}
          />

          {filteredPosts.length === 0 ? (
            <p className="text-white/60 text-lg">
              No posts in this section yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
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
