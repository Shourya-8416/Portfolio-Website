/**
 * Project interface defining the data structure for portfolio projects.
 * Used across ProjectCard, ProjectDetail, and ProjectGrid components.
 */
export interface Project {
  /** Unique identifier for URL routing (e.g., "serverless-ai-image-editing") */
  slug: string;
  /** Project title displayed in cards and detail pages */
  title: string;
  /** Brief one-line description for card display */
  shortDescription: string;
  /** Full project description for detail page */
  fullDescription: string;
  /** Array of technology names used in the project */
  techStack: string[];
  /** Path to project image */
  img: string;
  /** Optional GitHub repository link */
  gitLink?: string;
  /** Optional live demo link */
  liveLink?: string;
}
