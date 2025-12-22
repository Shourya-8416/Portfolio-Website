import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
  featuredImage?: string;
}

export interface BlogPost {
  metadata: PostMetadata;
  content: string;
}

/**
 * Get all blog posts sorted by date (newest first)
 * Requirements: 1.1
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
  
  const posts = files
    .map(filename => {
      const slug = filename.replace(/\.md$/, '');
      return getPostBySlug(slug);
    })
    .filter((post): post is BlogPost => post !== null);

  // Sort by date descending (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Get a single blog post by slug
 * Requirements: 2.1, 3.1
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    const metadata = parseMetadata(data, slug);
    if (!metadata) {
      return null;
    }

    return { metadata, content };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}


/**
 * Calculate estimated reading time for content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Parse frontmatter data into PostMetadata
 * Requirements: 3.2
 */
export function parseMetadata(data: Record<string, unknown>, defaultSlug: string): PostMetadata | null {
  // Validate required fields
  if (typeof data.title !== 'string' || !data.title) {
    console.warn('Missing required field: title');
    return null;
  }
  if (typeof data.date !== 'string' || !data.date) {
    console.warn('Missing required field: date');
    return null;
  }
  if (typeof data.description !== 'string' || !data.description) {
    console.warn('Missing required field: description');
    return null;
  }
  if (!Array.isArray(data.tags)) {
    console.warn('Missing required field: tags');
    return null;
  }

  return {
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags.map(tag => String(tag)),
    slug: typeof data.slug === 'string' ? data.slug : defaultSlug,
    featuredImage: typeof data.featuredImage === 'string' ? data.featuredImage : undefined,
  };
}

/**
 * Serialize PostMetadata to frontmatter string
 * Requirements: 3.4
 */
export function serializeMetadata(metadata: PostMetadata): string {
  const lines: string[] = ['---'];
  
  lines.push(`title: "${metadata.title}"`);
  lines.push(`date: "${metadata.date}"`);
  lines.push(`description: "${metadata.description}"`);
  lines.push(`tags: [${metadata.tags.map(t => `"${t}"`).join(', ')}]`);
  lines.push(`slug: "${metadata.slug}"`);
  
  if (metadata.featuredImage) {
    lines.push(`featuredImage: "${metadata.featuredImage}"`);
  }
  
  lines.push('---');
  
  return lines.join('\n');
}
