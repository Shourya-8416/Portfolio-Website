"use client";
import React, { useEffect } from "react";
import Title from "../ui/Title";
import { useView } from "@/contexts/ViewContext";
import Link from "next/link";

// @ts-ignore
import "intersection-observer";
import { useInView } from "react-intersection-observer";
import { ProjectGrid } from "../projects";
import { getAllProjects } from "@/data/projects";

export default function Works() {
  const { setSectionInView } = useView();
  const projects = getAllProjects();

  // Track projects section
  const { ref: projectsRef, inView: projectsInView } = useInView({
    threshold: 0.15,
    rootMargin: "-100px 0px -40% 0px",
  });

  useEffect(() => {
    if (projectsInView) setSectionInView("projects");
  }, [projectsInView, setSectionInView]);

  return (
    <section className="flex flex-col gap-6 md:gap-10 pt-[110px]" id="projects" ref={projectsRef}>
      <Title>Projects</Title>
      <ProjectGrid projects={projects} />
      <div className="flex justify-center mt-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-[rgba(217,217,217,0.12)] to-[rgba(115,115,115,0.12)] rounded-full backdrop-blur-sm hover:from-[rgba(217,217,217,0.2)] hover:to-[rgba(115,115,115,0.2)] transition-all duration-300"
        >
          View All Projects
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
