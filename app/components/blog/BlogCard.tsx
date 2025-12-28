"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
// @ts-ignore
import "intersection-observer";

export interface BlogCardProps {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  featuredImage?: string;
  commentCount?: number;
  reactionCount?: number;
  index?: number;
  variant?: 'blog' | 'section';
  href?: string;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

export default function BlogCard({
  title,
  slug,
  date,
  description,
  tags,
  featuredImage,
  commentCount = 0,
  reactionCount = 0,
  index = 0,
  variant = 'blog',
  href,
}: BlogCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "-50px 0px",
    triggerOnce: true,
  });

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const linkHref = href ?? `/blog/${slug}`;
  const cardClassName = `h-full rounded-[20px] std-backdrop-blur bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] p-5 flex flex-col gap-4 hover:from-[#d9d9d92f] hover:to-[#7373732f]${variant === 'section' ? ' section-card-deck' : ''}`;

  return (
    <Link href={linkHref} className="block group">
      <motion.article
        ref={ref}
        custom={index}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={cardVariants}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className={cardClassName}
        data-blobity-magnetic="false"
      >
        {featuredImage && (
          <div className="relative w-full aspect-video rounded-[10px] overflow-hidden">
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-xl sm:text-2xl font-bold line-clamp-2 group-hover:text-[#3c84c7] transition-colors">
            {title}
          </h3>

          <time className="text-sm text-white/60" dateTime={date}>
            {formattedDate}
          </time>

          <p className="text-base text-white/70 line-clamp-3 flex-1">
            {description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 + tagIndex * 0.05 + 0.3, duration: 0.3 }}
                className="uppercase text-xs bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] px-2 py-1 rounded-[4px] font-medium"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-white/60 mt-auto pt-2 border-t border-white/10">
            <span className="flex items-center gap-1">
              <span aria-hidden="true">❤️</span>
              <span>{reactionCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <span aria-hidden="true">💬</span>
              <span>{commentCount}</span>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
