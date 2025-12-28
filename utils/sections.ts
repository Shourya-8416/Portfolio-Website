import { RemoteBlogPost } from './github-content';

/**
 * Valid section values for blog posts
 */
export const VALID_SECTIONS = ['DSA', 'JAVA', 'SPRINGBOOT', 'AWS'] as const;

/**
 * Section type derived from VALID_SECTIONS
 */
export type Section = (typeof VALID_SECTIONS)[number];

/**
 * Type guard to check if a value is a valid Section
 * Performs case-insensitive matching
 * 
 * @param value - Unknown value to check
 * @returns True if value is a valid section (case-insensitive)
 */
export function isValidSection(value: unknown): value is Section {
  if (typeof value !== 'string') {
    return false;
  }
  return VALID_SECTIONS.includes(value.toUpperCase() as Section);
}

/**
 * Filter posts by section with case-insensitive matching
 * Excludes posts with missing or invalid section values
 * 
 * @param posts - Array of blog posts to filter
 * @param section - Section to filter by
 * @returns Array of posts matching the given section
 */
export function filterPostsBySection(
  posts: RemoteBlogPost[],
  section: Section
): RemoteBlogPost[] {
  return posts.filter((post) => {
    const postSection = post.metadata.section;
    if (!postSection || typeof postSection !== 'string') {
      return false;
    }
    return postSection.toUpperCase() === section.toUpperCase();
  });
}

/**
 * Get count of posts per section
 * 
 * @param posts - Array of blog posts
 * @returns Map of section to post count
 */
export function getPostCountBySection(
  posts: RemoteBlogPost[]
): Map<Section, number> {
  const counts = new Map<Section, number>();
  
  // Initialize all sections with 0
  VALID_SECTIONS.forEach((section) => counts.set(section, 0));

  // Count posts per section
  posts.forEach((post) => {
    const postSection = post.metadata.section?.toUpperCase();
    if (postSection && isValidSection(postSection)) {
      counts.set(postSection as Section, (counts.get(postSection as Section) ?? 0) + 1);
    }
  });

  return counts;
}
