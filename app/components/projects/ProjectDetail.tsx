"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Tag from "../work-section/Tag";
import { Project } from "@/types/project";

export interface ProjectDetailProps {
  project: Project;
  /** When true, skips the inView animation (useful for modals) */
  skipAnimation?: boolean;
}

/**
 * ProjectDetail - Full-page view showing complete project information.
 * Extracted from FolioCard, displays image, title, fullDescription, techStack, and action links.
 * Conditionally renders gitLink and liveLink when available.
 */
export default function ProjectDetail({ project, skipAnimation = false }: ProjectDetailProps) {
  const { title, img, gitLink, liveLink, fullDescription, techStack } = project;

  return (
    <div
      className={`w-full rounded-[20px] std-backdrop-blur bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] grid grid-cols-1 items-start lg:grid-cols-12 xl:flex gap-5 xl:gap-10 p-6 duration-700 ${
        skipAnimation ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
      }`}
    >
      <Image
        src={img}
        width={420}
        height={200}
        alt={title}
        className="rounded-[10px] w-full lg:col-span-5"
      />
      <div className="flex flex-col gap-4 lg:col-span-7">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold">
            {title}
          </h2>
          <div className="flex gap-3 md:gap-4 text-2xl sm:text-3xl xl:text-4xl">
            {liveLink && (
              <Link
                href={liveLink}
                className="rounded-full bg-icon-radial p-3 hover:bg-red"
                target="_blank"
                aria-label="View Live Demo"
                data-blobity-radius="34"
                data-blobity-magnetic="true"
              >
                <Icon icon="line-md:external-link-rounded" />
              </Link>
            )}
            {gitLink && (
              <Link
                href={gitLink}
                className="rounded-full bg-icon-radial p-3 hover:bg-red"
                target="_blank"
                aria-label="View Github Repo"
                data-blobity-radius="34"
                data-blobity-magnetic="true"
              >
                <Icon icon="mingcute:github-line" />
              </Link>
            )}
          </div>
        </div>
        <p className="text-base text-white/70">{fullDescription}</p>
        <div className="flex gap-3 md:gap-4 flex-wrap">
          {techStack.map((tech, index) => (
            <Tag key={index}>{tech}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
