"use client";
import React from "react";
import Link from "next/link";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { motion } from "framer-motion";
import YouTube from "@/app/components/blog/mdx/YouTube";
import Tweet from "@/app/components/blog/mdx/Tweet";
import Callout from "@/app/components/blog/mdx/Callout";

// MDX components mapping
const mdxComponents = {
  YouTube,
  Tweet,
  Callout,
};

interface BlogPostContentClientProps {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  source: MDXRemoteSerializeResult;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

export default function BlogPostContentClient({
  title,
  date,
  readingTime,
  tags,
  source,
}: BlogPostContentClientProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      className="max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Back link */}
      <motion.div variants={itemVariants}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <motion.span
            aria-hidden="true"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.span>
          <span>Back to Blog</span>
        </Link>
      </motion.div>

      {/* Post header */}
      <motion.header className="mb-10" variants={itemVariants}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-white/60 mb-4">
          <time dateTime={date}>{formattedDate}</time>
          <span aria-hidden="true">•</span>
          <span>{readingTime}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              className="uppercase text-xs bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] px-2 py-1 rounded-[4px] font-medium"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.header>

      {/* Post content */}
      <motion.div
        className="prose prose-invert prose-lg max-w-none"
        variants={contentVariants}
      >
        <MDXRemote {...source} components={mdxComponents} />
      </motion.div>
    </motion.article>
  );
}
