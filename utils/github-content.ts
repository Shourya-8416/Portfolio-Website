import matter from 'gray-matter';

// Configuration constants for the content repository
const CONTENT_REPO_OWNER = 'Shourya-8416';
const CONTENT_REPO_NAME = 'blog-content';
const CONTENT_PATH = ''; // Root of repo

// GitHub API base URLs
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

/**
 * Represents a file entry from GitHub Contents API
 */
export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
  type: 'file' | 'dir';
}

/**
 * Metadata extracted from remote blog post frontmatter
 * Uses 'summary' field which maps to 'description' for backward compatibility
 */
export interface RemotePostMetadata {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  section?: string;
  summary: string;
  description: string; // Mapped from summary for backward compatibility
  featuredImage?: string;
}

/**
 * Complete remote blog post with metadata and content
 */
export interface RemoteBlogPost {
  metadata: RemotePostMetadata;
  content: string;
}


/**
 * Get authorization headers if GITHUB_TOKEN is available
 */
function getAuthHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    return {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    };
  }
  return {
    Accept: 'application/vnd.github.v3+json',
  };
}

/**
 * List all Markdown files from the content repository
 * Requirements: 1.1, 1.4
 * 
 * @returns Array of GitHubFile objects for .md files, or empty array on error
 */
export async function listMarkdownFiles(): Promise<GitHubFile[]> {
  const url = `${GITHUB_API_BASE}/repos/${CONTENT_REPO_OWNER}/${CONTENT_REPO_NAME}/contents/${CONTENT_PATH}`;
  
  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }, // Cache for ISR
    });

    if (!response.ok) {
      console.warn(`GitHub API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const files: GitHubFile[] = await response.json();
    
    // Filter for .md files only
    return files.filter(
      (file) => file.type === 'file' && file.name.endsWith('.md')
    );
  } catch (error) {
    console.error('Error fetching markdown files from GitHub:', error);
    return [];
  }
}


/**
 * Fetch raw file content from GitHub
 * Requirements: 1.1, 1.4
 * 
 * @param downloadUrl - The raw content URL from GitHub
 * @returns File content as string, or null on error
 */
export async function fetchFileContent(downloadUrl: string): Promise<string | null> {
  try {
    const response = await fetch(downloadUrl, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }, // Cache for ISR
    });

    if (!response.ok) {
      console.warn(`Failed to fetch file content: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching file content from GitHub:', error);
    return null;
  }
}


/**
 * Parse raw Markdown content into a RemoteBlogPost
 * Requirements: 2.1, 2.2, 2.4
 * 
 * @param rawContent - Raw Markdown file content with frontmatter
 * @param filename - Original filename (used for logging)
 * @returns Parsed blog post, or null if frontmatter is invalid
 */
export function parseRemotePost(rawContent: string, filename: string): RemoteBlogPost | null {
  try {
    const { data, content } = matter(rawContent);

    // Validate required fields
    if (typeof data.title !== 'string' || !data.title) {
      console.warn(`Missing required field 'title' in ${filename}`);
      return null;
    }
    if (typeof data.slug !== 'string' || !data.slug) {
      console.warn(`Missing required field 'slug' in ${filename}`);
      return null;
    }
    if (typeof data.date !== 'string' || !data.date) {
      console.warn(`Missing required field 'date' in ${filename}`);
      return null;
    }
    if (!Array.isArray(data.tags)) {
      console.warn(`Missing required field 'tags' in ${filename}`);
      return null;
    }
    // Support both 'summary' and 'description' for backward compatibility
    const summary = data.summary ?? data.description;
    if (typeof summary !== 'string' || !summary) {
      console.warn(`Missing required field 'summary' or 'description' in ${filename}`);
      return null;
    }

    const metadata: RemotePostMetadata = {
      title: data.title,
      slug: data.slug,
      date: data.date,
      tags: data.tags.map((tag: unknown) => String(tag)),
      summary: summary,
      description: summary, // Map summary to description for backward compatibility
      section: typeof data.section === 'string' ? data.section : undefined,
      featuredImage: typeof data.featuredImage === 'string' ? data.featuredImage : undefined,
    };

    return {
      metadata,
      content,
    };
  } catch (error) {
    console.error(`Error parsing post ${filename}:`, error);
    return null;
  }
}


/**
 * Sort blog posts by date descending (newest first)
 * Exported for testing purposes
 * 
 * @param posts - Array of RemoteBlogPost objects
 * @returns Sorted array with newest posts first
 */
export function sortPostsByDateDescending(posts: RemoteBlogPost[]): RemoteBlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });
}


/**
 * Get all blog posts from the remote content repository
 * Requirements: 1.1, 4.1
 * 
 * @returns Array of RemoteBlogPost objects sorted by date descending (newest first)
 */
export async function getAllPostsRemote(): Promise<RemoteBlogPost[]> {
  // Get list of markdown files from GitHub
  const files = await listMarkdownFiles();
  
  // Fetch and parse each file
  const postPromises = files.map(async (file) => {
    const content = await fetchFileContent(file.download_url);
    if (!content) {
      return null;
    }
    return parseRemotePost(content, file.name);
  });

  const posts = await Promise.all(postPromises);
  
  // Filter out null results (invalid posts)
  const validPosts = posts.filter((post): post is RemoteBlogPost => post !== null);
  
  // Sort by date descending (newest first)
  return sortPostsByDateDescending(validPosts);
}


/**
 * Find a blog post by slug from an array of posts
 * Exported for testing purposes
 * 
 * @param posts - Array of RemoteBlogPost objects
 * @param slug - The slug to search for
 * @returns The matching post, or null if not found
 */
export function findPostBySlug(posts: RemoteBlogPost[], slug: string): RemoteBlogPost | null {
  return posts.find((post) => post.metadata.slug === slug) ?? null;
}


/**
 * Get a single blog post by its slug
 * Requirements: 4.2, 4.3
 * 
 * @param slug - The slug to search for
 * @returns The matching RemoteBlogPost, or null if not found
 */
export async function getPostBySlugRemote(slug: string): Promise<RemoteBlogPost | null> {
  const posts = await getAllPostsRemote();
  return findPostBySlug(posts, slug);
}
