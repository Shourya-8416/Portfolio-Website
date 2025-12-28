import { getAllProjects } from "@/data/projects";
import { ProjectGrid } from "../components/projects";
import Footer from "../components/contact+footer/Footer";
import Link from "next/link";

export const metadata = {
  title: "Projects | Shourya Mishra",
  description:
    "Explore my portfolio of projects including AI-powered applications, cloud-native systems, and full-stack web applications.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen pt-32 sm:pt-40 pb-20">
      <section className="mb-16">
        {/* Go Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
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
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back to Home</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            All Projects
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            A collection of my work spanning AI-powered applications,
            cloud-native systems, and full-stack web development.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-white/60 text-lg">
            No projects available. Check back soon!
          </p>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </section>

      <Footer />
    </main>
  );
}
