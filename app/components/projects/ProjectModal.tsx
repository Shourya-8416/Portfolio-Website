"use client";
import React, { useEffect, useCallback, useState } from "react";
import { Project } from "@/types/project";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import Tag from "../work-section/Tag";

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProjectModal - A modal overlay component for displaying full project details.
 * Matches the original full-width project card layout exactly:
 * - Left image/media section
 * - Right content section (title, description, tech tags, actions)
 * - Same background gradients, shadows, and border radius
 */
export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle Escape key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!shouldRender || !project) return null;

  const { title, img, gitLink, liveLink, fullDescription, techStack } = project;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with blur and dim */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container with proper padding for mobile */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8 pt-20 sm:pt-6">
        {/* Modal Content - matches original full-width card layout */}
        <div
          className={`relative w-full max-w-5xl my-8 transition-all duration-300 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Close Button - positioned to stay visible on mobile */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 sm:-top-3 sm:-right-3 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors border border-white/30"
            aria-label="Close modal"
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
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

        {/* Card Content - Horizontal layout matching original */}
        <div className="w-full rounded-[20px] std-backdrop-blur bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] flex flex-col lg:flex-row gap-6 lg:gap-10 p-6 max-h-[calc(100vh-120px)] sm:max-h-none overflow-y-auto sm:overflow-visible">
          {/* Left: Image Section */}
          <div className="lg:w-[45%] flex-shrink-0">
            <Image
              src={img}
              width={500}
              height={300}
              alt={title}
              className="rounded-[10px] w-full h-auto object-cover"
            />
          </div>

          {/* Right: Content Section */}
          <div className="flex flex-col gap-4 lg:w-[55%]">
            {/* Title and Action Links */}
            <div className="flex items-start justify-between gap-4">
              <h2 id="modal-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {title}
              </h2>
              <div className="flex gap-3 text-xl sm:text-2xl flex-shrink-0">
                <Link
                  href={liveLink || "#"}
                  className={`rounded-full bg-icon-radial p-3 transition-colors ${liveLink ? "hover:bg-red" : "opacity-50 cursor-not-allowed"}`}
                  target={liveLink ? "_blank" : undefined}
                  aria-label="View Live Demo"
                  data-blobity-radius="34"
                  data-blobity-magnetic="true"
                  onClick={liveLink ? undefined : (e) => e.preventDefault()}
                >
                  <Icon icon="line-md:external-link-rounded" />
                </Link>
                {gitLink && (
                  <Link
                    href={gitLink}
                    className="rounded-full bg-icon-radial p-3 hover:bg-red transition-colors"
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

            {/* Description */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {fullDescription}
            </p>

            {/* Tech Stack Tags */}
            <div className="flex gap-2 sm:gap-3 flex-wrap mt-auto">
              {techStack.map((tech, index) => (
                <Tag key={index}>{tech}</Tag>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
