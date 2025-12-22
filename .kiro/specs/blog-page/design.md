# Blog Page Design Document

## Overview

This document outlines the technical design for adding a blog feature to the existing Next.js portfolio website. The blog will use a file-based content system where posts are written in Markdown files with YAML frontmatter, eliminating the need for a database or CMS. The system integrates Giscus for GitHub-based comments.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│  /blog (listing)          │  /blog/[slug] (post detail)         │
│  ┌─────────────────────┐  │  ┌─────────────────────────────┐    │
│  │ BlogListingPage     │  │  │ BlogPostPage                │    │
│  │ - Header            │  │  │ - Header                    │    │
│  │ - BlogCard[]        │  │  │ - PostHeader                │    │
│  │ - Footer            │  │  │ - MDXContent                │    │
│  └─────────────────────┘  │  │ - GiscusComments            │    │
│                           │  │ - Footer                    │    │
│                           │  └─────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                      Content Layer                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ content/blog/*.md  →  gray-matter  →  next-mdx-remote   │    │
│  │ (Markdown + YAML)     (parse)         (render)          │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                      External Services                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Giscus (GitHub Discussions) - Shourya-8416/blog-discussion│   │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Page Components

#### BlogListingPage (`app/blog/page.tsx`)
- Server component that fetches all blog posts
- Renders page header and grid of BlogCard components
- Sorts posts by date (newest first)

#### BlogPostPage (`app/blog/[slug]/page.tsx`)
- Dynamic route server component
- Fetches single post by slug
- Renders post content with MDX
- Includes Giscus comments section
- Returns 404 for invalid slugs

### UI Components

#### BlogCard (`app/components/blog/BlogCard.tsx`)
```typescript
interface BlogCardProps {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  featuredImage?: string;
  commentCount?: number;
  reactionCount?: number;
}
```
- Displays post preview in listing
- Shows engagement metrics (💬 comments, ❤️ likes)
- Hover animations matching site style
- Links to individual post page

#### BlogHeader (`app/components/blog/BlogHeader.tsx`)
```typescript
interface BlogHeaderProps {
  title: string;
  description?: string;
}
```
- Reusable header for blog pages
- Consistent styling with site

#### BlogPostContent (`app/components/blog/BlogPostContent.tsx`)
```typescript
interface BlogPostContentProps {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: MDXRemoteSerializeResult;
}
```
- Renders post metadata and MDX content
- Includes back link to listing

#### GiscusComments (`app/components/blog/GiscusComments.tsx`)
- Client component wrapping Giscus
- Configured for Shourya-8416/blog-discussion repo

### MDX Components

#### YouTube (`app/components/blog/mdx/YouTube.tsx`)
```typescript
interface YouTubeProps {
  videoId: string;
}
```
- Responsive iframe embed

#### Tweet (`app/components/blog/mdx/Tweet.tsx`)
```typescript
interface TweetProps {
  id: string;
}
```
- Twitter embed component

#### Callout (`app/components/blog/mdx/Callout.tsx`)
```typescript
interface CalloutProps {
  type: 'note' | 'tip' | 'warning' | 'important';
  children: React.ReactNode;
}
```
- Styled alert boxes

### Utility Functions

#### Blog Utils (`utils/blog.ts`)
```typescript
interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
  featuredImage?: string;
}

interface BlogPost {
  metadata: PostMetadata;
  content: string;
}

interface DiscussionMetrics {
  commentCount: number;
  reactionCount: number;
}

// Get all posts sorted by date
function getAllPosts(): BlogPost[];

// Get single post by slug
function getPostBySlug(slug: string): BlogPost | null;

// Calculate reading time
function calculateReadingTime(content: string): string;

// Serialize metadata to frontmatter string
function serializeMetadata(metadata: PostMetadata): string;

// Parse frontmatter string to metadata
function parseMetadata(frontmatter: string): PostMetadata;
```

#### GitHub API Utils (`utils/github.ts`)
```typescript
// Fetch discussion metrics for a post
async function getDiscussionMetrics(slug: string): Promise<DiscussionMetrics | null>;

// Fetch metrics for all posts (batched)
async function getAllDiscussionMetrics(): Promise<Map<string, DiscussionMetrics>>;
```
- Uses GitHub GraphQL API to fetch Discussion data
- Caches results to avoid rate limits
- Returns comment count and reaction count per post

## Data Models

### Blog Post File Structure
```
content/
└── blog/
    └── my-post.md
```

### Frontmatter Schema
```yaml
---
title: "Post Title"           # Required
date: "2025-01-15"           # Required, ISO date
description: "Brief summary"  # Required
tags: ["tag1", "tag2"]       # Required, array
slug: "my-post"              # Optional, defaults to filename
featuredImage: "/blog/img.png" # Optional
---
```

### Post Content
Standard Markdown with MDX component support:
- Headings (h1-h6)
- Paragraphs, bold, italic
- Lists (ordered, unordered)
- Code blocks with syntax highlighting
- Links and images
- Tables
- Custom components: `<YouTube />`, `<Tweet />`, `<Callout />`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Posts are sorted by date descending
*For any* collection of blog posts with different dates, when retrieved via `getAllPosts()`, the resulting array SHALL be ordered with the most recent date first.
**Validates: Requirements 1.1**

### Property 2: Blog card contains required fields
*For any* blog post, when rendered as a BlogCard, the output SHALL contain the title, date, description, and all tags from the post metadata.
**Validates: Requirements 1.2**

### Property 3: Blog card links to correct post
*For any* blog post with a given slug, the BlogCard component SHALL render a link with href `/blog/{slug}`.
**Validates: Requirements 1.3**

### Property 4: Markdown renders to HTML
*For any* valid Markdown content, when processed by the rendering system, the output SHALL be valid HTML containing the semantic equivalent of the input.
**Validates: Requirements 2.1, 3.1**

### Property 5: Post page displays all metadata
*For any* blog post, when rendered on the BlogPostPage, the output SHALL contain the title, date, reading time, and all tags.
**Validates: Requirements 2.2**

### Property 6: Frontmatter extraction
*For any* Markdown file with valid frontmatter, the parsing function SHALL extract all metadata fields (title, date, description, tags, slug, featuredImage) correctly.
**Validates: Requirements 3.2**

### Property 7: Metadata round-trip consistency
*For any* valid PostMetadata object, serializing to frontmatter and then parsing back SHALL produce an equivalent metadata object.
**Validates: Requirements 3.4**

### Property 8: YouTube embed renders iframe
*For any* YouTube videoId, the YouTube component SHALL render an iframe with src containing `youtube.com/embed/{videoId}`.
**Validates: Requirements 6.1**

### Property 9: Code blocks have syntax highlighting
*For any* code block with a specified language, the rendered output SHALL contain syntax highlighting markup (CSS classes for tokens).
**Validates: Requirements 6.3**

### Property 10: Tables render as HTML tables
*For any* Markdown table, the rendered output SHALL contain `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements.
**Validates: Requirements 6.5**

## Error Handling

| Scenario | Handling |
|----------|----------|
| Invalid slug (404) | Return Next.js notFound() |
| Malformed frontmatter | Log error, skip post from listing |
| Missing required fields | Log warning, use defaults where possible |
| MDX render error | Display error boundary with message |
| Giscus load failure | Graceful degradation, show "Comments unavailable" |

## Testing Strategy

### Unit Tests
- Test `getAllPosts()` returns posts sorted by date
- Test `getPostBySlug()` returns correct post or null
- Test `calculateReadingTime()` produces reasonable estimates
- Test frontmatter parsing extracts all fields
- Test MDX components render expected output

### Property-Based Tests
Using **fast-check** library for property-based testing:

1. **Date sorting property**: Generate random posts with dates, verify sorting
2. **Frontmatter round-trip**: Generate metadata, serialize/parse, verify equality
3. **Reading time consistency**: For any content, reading time is positive and proportional to length
4. **Slug generation**: For any filename, generated slug is URL-safe

Each property-based test MUST:
- Run minimum 100 iterations
- Be tagged with format: `**Feature: blog-page, Property {number}: {property_text}**`
- Reference the correctness property from this design document

### Integration Tests
- Blog listing page renders with posts
- Individual post page renders content
- Navigation between pages works
- 404 page displays for invalid slugs
- Giscus component loads on post pages

## Dependencies

### New Packages
```json
{
  "gray-matter": "^4.0.3",      // Frontmatter parsing
  "next-mdx-remote": "^5.0.0",  // MDX rendering
  "rehype-highlight": "^7.0.0", // Syntax highlighting
  "rehype-slug": "^6.0.0",      // Heading IDs
  "remark-gfm": "^4.0.0",       // GitHub Flavored Markdown
  "@giscus/react": "^3.0.0",    // Giscus React component
  "fast-check": "^3.15.0",      // Property-based testing (dev)
  "@octokit/graphql": "^7.0.0"  // GitHub GraphQL API
}
```

### Environment Variables
```env
GITHUB_TOKEN=ghp_xxx  # Personal access token with read:discussion scope
```

## File Structure

```
app/
├── blog/
│   ├── page.tsx              # Blog listing
│   └── [slug]/
│       └── page.tsx          # Individual post
├── components/
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogHeader.tsx
│   │   ├── BlogPostContent.tsx
│   │   ├── GiscusComments.tsx
│   │   └── mdx/
│   │       ├── YouTube.tsx
│   │       ├── Tweet.tsx
│   │       ├── Callout.tsx
│   │       └── index.ts      # MDX components export
│   └── header-section/
│       └── Header.tsx        # Update with Blog link
content/
└── blog/
    └── *.md                  # Blog posts
utils/
├── blog.ts                   # Blog utilities
└── github.ts                 # GitHub API for metrics
```

## Giscus Configuration

```typescript
const giscusConfig = {
  repo: "Shourya-8416/blog-discussion",
  repoId: "R_kgDOQs4izw",
  category: "Announcements",
  categoryId: "DIC_kwDOQs4iz84C0GPW",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "1",
  inputPosition: "top",
  theme: "dark",
  lang: "en",
  loading: "lazy"
};
```
