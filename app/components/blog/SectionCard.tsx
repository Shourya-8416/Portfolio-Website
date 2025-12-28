"use client";
import React from "react";
import BlogCard from "./BlogCard";
import { Section } from "@/utils/sections";

export interface SectionCardProps {
  section: Section;
  postCount: number;
  latestPost?: {
    title: string;
    date: string;
    featuredImage?: string;
  };
  index?: number;
}

/**
 * SectionCard component displays a section as a card with deck-of-cards styling.
 * Uses BlogCard with variant="section" for consistent styling.
 */
export default function SectionCard({
  section,
  postCount,
  latestPost,
  index = 0,
}: SectionCardProps) {
  const description = `${postCount} ${postCount === 1 ? "post" : "posts"} in this section`;
  const href = `/blog/section/${section}`;

  return (
    <BlogCard
      title={section}
      slug={section.toLowerCase()}
      date={latestPost?.date ?? new Date().toISOString()}
      description={description}
      tags={[]}
      featuredImage={latestPost?.featuredImage}
      index={index}
      variant="section"
      href={href}
    />
  );
}
