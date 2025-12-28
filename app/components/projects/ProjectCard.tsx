"use client";
import React from "react";
import Image from "next/image";
import Tag from "../work-section/Tag";
import { Project } from "@/types/project";

export interface ProjectCardProps {
  project: Project;
  onCardClick: (project: Project) => void;
}

/**
 * ProjectCard - A compact preview card for displaying project summaries.
 * Shows image, title (max 2 lines), short description (1 line), and tech stack tags (top 3 + count).
 * Designed to be lightweight and scannable for homepage preview.
 */
export default function ProjectCard({
  project,
  onCardClick,
}: ProjectCardProps) {
  const { title, shortDescription, techStack, img } = project;

  return (
    <button
      onClick={() => onCardClick(project)}
      className="group block w-full text-left rounded-[16px] std-backdrop-blur bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-[#3c84c7] focus:ring-offset-2 focus:ring-offset-[#08233b]"
      aria-label={`View details for ${title}`}
      data-blobity-magnetic="false"
    >
      {/* Project Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Title - max 2 lines with ellipsis */}
        <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 group-hover:text-[#3c84c7] transition-colors duration-300 leading-tight">
          {title}
        </h3>

        {/* Short Description - single line */}
        <p className="text-sm text-white/70 line-clamp-1">
          {shortDescription}
        </p>

        {/* Tech Stack Tags - top 3 + count */}
        {techStack.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center pt-1">
            {techStack.slice(0, 3).map((tech, index) => (
              <Tag key={index}>{tech}</Tag>
            ))}
            {techStack.length > 3 && (
              <span className="text-xs text-white/50">
                +{techStack.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
