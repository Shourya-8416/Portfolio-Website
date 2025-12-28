"use client";
import React, { useState, useMemo } from "react";
import BlogFilters from "./BlogFilters";
import BlogCard from "./BlogCard";
import SectionCard from "./SectionCard";
import { Section, VALID_SECTIONS, filterPostsBySection, getPostCountBySection } from "@/utils/sections";
import { RemoteBlogPost } from "@/utils/github-content";

interface BlogGridProps {
  posts: RemoteBlogPost[];
  metrics: Record<string, { commentCount: number; reactionCount: number }>;
}

export default function BlogGrid({ posts, metrics }: BlogGridProps) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.metadata.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts based on selected filters
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by section
    if (selectedSection) {
      result = filterPostsBySection(result, selectedSection);
    }

    // Filter by tags (AND logic - post must have all selected tags)
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.every((tag) =>
          post.metadata.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    return result;
  }, [posts, selectedSection, selectedTags]);

  // Get section counts and latest posts for section cards
  const sectionCounts = useMemo(() => getPostCountBySection(posts), [posts]);
  
  const getLatestPostForSection = (section: Section): RemoteBlogPost | undefined => {
    const sectionPosts = filterPostsBySection(posts, section);
    return sectionPosts.length > 0 ? sectionPosts[0] : undefined;
  };

  const sectionsWithPosts = VALID_SECTIONS.filter(
    (section) => (sectionCounts.get(section) ?? 0) > 0
  );

  // Only show section cards when no filters are active
  const showSectionCards = selectedSection === null && selectedTags.length === 0;

  return (
    <>
      <BlogFilters
        allTags={allTags}
        selectedSection={selectedSection}
        selectedTags={selectedTags}
        onSectionChange={setSelectedSection}
        onTagsChange={setSelectedTags}
      />

      {filteredPosts.length === 0 && !showSectionCards ? (
        <p className="text-white/60 text-lg">No posts match your filters. Try adjusting your selection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog post cards */}
          {filteredPosts.map((post, index) => {
            const postMetrics = metrics[post.metadata.slug];
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
          
          {/* Section cards - only show when no filters active */}
          {showSectionCards && sectionsWithPosts.map((section, index) => {
            const latestPost = getLatestPostForSection(section);
            return (
              <SectionCard
                key={section}
                section={section}
                postCount={sectionCounts.get(section) ?? 0}
                latestPost={
                  latestPost
                    ? {
                        title: latestPost.metadata.title,
                        date: latestPost.metadata.date,
                        featuredImage: latestPost.metadata.featuredImage,
                      }
                    : undefined
                }
                index={filteredPosts.length + index}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
