import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseRemotePost, RemotePostMetadata, RemoteBlogPost, sortPostsByDateDescending, findPostBySlug } from './github-content';

/**
 * **Feature: github-blog-content, Property 2: Frontmatter parsing extracts all required fields**
 * **Validates: Requirements 2.1, 2.2**
 * 
 * For any valid Markdown file with complete frontmatter, the parseRemotePost()
 * function SHALL extract title, slug, date, tags, and summary fields correctly.
 */
describe('Property 2: Frontmatter parsing extracts all required fields', () => {
  it('should extract all required fields from valid frontmatter', () => {
    // Generate safe strings that won't be mangled by YAML parsing
    const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const safeStringArbitrary = (minLen: number, maxLen: number) =>
      fc.array(fc.constantFrom(...safeChars.split('')), { minLength: minLen, maxLength: maxLen })
        .map(chars => chars.join('').trim())
        .filter(s => s.length > 0);

    // Generate valid ISO date strings
    const dateStringArbitrary = fc.integer({ min: 2020, max: 2030 }).chain(year =>
      fc.integer({ min: 1, max: 12 }).chain(month =>
        fc.integer({ min: 1, max: 28 }).map(day => {
          const m = String(month).padStart(2, '0');
          const d = String(day).padStart(2, '0');
          return `${year}-${m}-${d}`;
        })
      )
    );

    // Generate valid slug (lowercase alphanumeric with hyphens)
    const slugArbitrary = fc.array(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      { minLength: 1, maxLength: 30 }
    )
      .map(chars => chars.join(''))
      .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s));

    // Arbitrary for valid frontmatter data
    const validFrontmatterArbitrary = fc.record({
      title: safeStringArbitrary(1, 50),
      slug: slugArbitrary,
      date: dateStringArbitrary,
      tags: fc.array(safeStringArbitrary(1, 15), { minLength: 1, maxLength: 5 }),
      summary: safeStringArbitrary(1, 100),
    });

    fc.assert(
      fc.property(validFrontmatterArbitrary, (frontmatter) => {
        // Build raw markdown content with frontmatter
        const rawContent = `---
title: "${frontmatter.title}"
slug: "${frontmatter.slug}"
date: "${frontmatter.date}"
tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]
summary: "${frontmatter.summary}"
---

# Test Content

This is test content.
`;

        const result = parseRemotePost(rawContent, 'test.md');

        // Verify all required fields are extracted correctly
        expect(result).not.toBeNull();
        if (result) {
          expect(result.metadata.title).toBe(frontmatter.title);
          expect(result.metadata.slug).toBe(frontmatter.slug);
          expect(result.metadata.date).toBe(frontmatter.date);
          expect(result.metadata.tags).toEqual(frontmatter.tags);
          expect(result.metadata.summary).toBe(frontmatter.summary);
          // Verify backward compatibility mapping
          expect(result.metadata.description).toBe(frontmatter.summary);
        }
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: github-blog-content, Property 3: Invalid frontmatter is rejected**
 * **Validates: Requirements 2.4**
 * 
 * For any Markdown file missing required frontmatter fields (title, slug, date, tags, summary),
 * the parseRemotePost() function SHALL return null.
 */
describe('Property 3: Invalid frontmatter is rejected', () => {
  it('should return null when any required field is missing', () => {
    // Generate safe strings
    const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const safeStringArbitrary = (minLen: number, maxLen: number) =>
      fc.array(fc.constantFrom(...safeChars.split('')), { minLength: minLen, maxLength: maxLen })
        .map(chars => chars.join('').trim())
        .filter(s => s.length > 0);

    // Generate valid ISO date strings
    const dateStringArbitrary = fc.integer({ min: 2020, max: 2030 }).chain(year =>
      fc.integer({ min: 1, max: 12 }).chain(month =>
        fc.integer({ min: 1, max: 28 }).map(day => {
          const m = String(month).padStart(2, '0');
          const d = String(day).padStart(2, '0');
          return `${year}-${m}-${d}`;
        })
      )
    );

    // Generate valid slug
    const slugArbitrary = fc.array(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      { minLength: 1, maxLength: 30 }
    )
      .map(chars => chars.join(''))
      .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s));

    // Required fields
    const requiredFields = ['title', 'slug', 'date', 'tags', 'summary'] as const;

    // Arbitrary for complete frontmatter data
    const completeFrontmatterArbitrary = fc.record({
      title: safeStringArbitrary(1, 50),
      slug: slugArbitrary,
      date: dateStringArbitrary,
      tags: fc.array(safeStringArbitrary(1, 15), { minLength: 1, maxLength: 5 }),
      summary: safeStringArbitrary(1, 100),
    });

    // Arbitrary for which field to omit
    const fieldToOmitArbitrary = fc.constantFrom(...requiredFields);

    fc.assert(
      fc.property(
        completeFrontmatterArbitrary,
        fieldToOmitArbitrary,
        (frontmatter, fieldToOmit) => {
          // Build frontmatter lines, omitting the selected field
          const lines: string[] = ['---'];
          
          if (fieldToOmit !== 'title') {
            lines.push(`title: "${frontmatter.title}"`);
          }
          if (fieldToOmit !== 'slug') {
            lines.push(`slug: "${frontmatter.slug}"`);
          }
          if (fieldToOmit !== 'date') {
            lines.push(`date: "${frontmatter.date}"`);
          }
          if (fieldToOmit !== 'tags') {
            lines.push(`tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`);
          }
          if (fieldToOmit !== 'summary') {
            lines.push(`summary: "${frontmatter.summary}"`);
          }
          
          lines.push('---');
          lines.push('');
          lines.push('# Test Content');

          const rawContent = lines.join('\n');
          const result = parseRemotePost(rawContent, 'test.md');

          // Should return null when any required field is missing
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});



/**
 * **Feature: github-blog-content, Property 1: Remote posts are sorted by date descending**
 * **Validates: Requirements 1.1, 4.1**
 * 
 * For any collection of blog posts, when sorted via sortPostsByDateDescending(),
 * the resulting array SHALL be ordered with the most recent date first.
 */
describe('Property 1: Remote posts are sorted by date descending', () => {
  it('should sort posts with newest date first', () => {
    // Generate valid ISO date strings
    const dateStringArbitrary = fc.integer({ min: 2020, max: 2030 }).chain(year =>
      fc.integer({ min: 1, max: 12 }).chain(month =>
        fc.integer({ min: 1, max: 28 }).map(day => {
          const m = String(month).padStart(2, '0');
          const d = String(day).padStart(2, '0');
          return `${year}-${m}-${d}`;
        })
      )
    );

    // Generate safe strings
    const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const safeStringArbitrary = (minLen: number, maxLen: number) =>
      fc.array(fc.constantFrom(...safeChars.split('')), { minLength: minLen, maxLength: maxLen })
        .map(chars => chars.join(''));

    // Generate valid slug
    const slugArbitrary = fc.array(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      { minLength: 1, maxLength: 30 }
    )
      .map(chars => chars.join(''))
      .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s));

    // Arbitrary for a valid RemoteBlogPost
    const blogPostArbitrary = fc.record({
      metadata: fc.record({
        title: safeStringArbitrary(1, 50),
        slug: slugArbitrary,
        date: dateStringArbitrary,
        tags: fc.array(safeStringArbitrary(1, 15), { minLength: 1, maxLength: 5 }),
        summary: safeStringArbitrary(1, 100),
        description: safeStringArbitrary(1, 100),
        section: fc.option(safeStringArbitrary(1, 20), { nil: undefined }),
        featuredImage: fc.option(safeStringArbitrary(1, 50), { nil: undefined }),
      }) as fc.Arbitrary<RemotePostMetadata>,
      content: safeStringArbitrary(10, 200),
    }) as fc.Arbitrary<RemoteBlogPost>;

    // Generate array of posts
    const postsArrayArbitrary = fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 });

    fc.assert(
      fc.property(postsArrayArbitrary, (posts) => {
        const sorted = sortPostsByDateDescending(posts);

        // Verify the array is sorted by date descending
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentDate = new Date(sorted[i].metadata.date).getTime();
          const nextDate = new Date(sorted[i + 1].metadata.date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }

        // Verify all original posts are present (same length)
        expect(sorted.length).toBe(posts.length);
      }),
      { numRuns: 100 }
    );
  });
});



/**
 * **Feature: github-blog-content, Property 4: Slug lookup returns correct post**
 * **Feature: github-blog-content, Property 5: Non-existent slug returns null**
 * **Validates: Requirements 4.2, 4.3**
 * 
 * Property 4: For any valid slug that exists in the posts array, findPostBySlug(slug)
 * SHALL return the blog post with matching slug in its frontmatter.
 * 
 * Property 5: For any slug that does not exist in the posts array, findPostBySlug(slug)
 * SHALL return null.
 */
describe('Property 4 & 5: Slug lookup returns correct post or null', () => {
  // Generate valid ISO date strings
  const dateStringArbitrary = fc.integer({ min: 2020, max: 2030 }).chain(year =>
    fc.integer({ min: 1, max: 12 }).chain(month =>
      fc.integer({ min: 1, max: 28 }).map(day => {
        const m = String(month).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
      })
    )
  );

  // Generate safe strings
  const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const safeStringArbitrary = (minLen: number, maxLen: number) =>
    fc.array(fc.constantFrom(...safeChars.split('')), { minLength: minLen, maxLength: maxLen })
      .map(chars => chars.join(''));

  // Generate valid slug
  const slugArbitrary = fc.array(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
    { minLength: 1, maxLength: 30 }
  )
    .map(chars => chars.join(''))
    .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s));

  // Arbitrary for a valid RemoteBlogPost with a specific slug
  const blogPostWithSlugArbitrary = (slug: string) => fc.record({
    metadata: fc.record({
      title: safeStringArbitrary(1, 50),
      slug: fc.constant(slug),
      date: dateStringArbitrary,
      tags: fc.array(safeStringArbitrary(1, 15), { minLength: 1, maxLength: 5 }),
      summary: safeStringArbitrary(1, 100),
      description: safeStringArbitrary(1, 100),
      section: fc.option(safeStringArbitrary(1, 20), { nil: undefined }),
      featuredImage: fc.option(safeStringArbitrary(1, 50), { nil: undefined }),
    }) as fc.Arbitrary<RemotePostMetadata>,
    content: safeStringArbitrary(10, 200),
  }) as fc.Arbitrary<RemoteBlogPost>;

  // Arbitrary for a valid RemoteBlogPost
  const blogPostArbitrary = fc.record({
    metadata: fc.record({
      title: safeStringArbitrary(1, 50),
      slug: slugArbitrary,
      date: dateStringArbitrary,
      tags: fc.array(safeStringArbitrary(1, 15), { minLength: 1, maxLength: 5 }),
      summary: safeStringArbitrary(1, 100),
      description: safeStringArbitrary(1, 100),
      section: fc.option(safeStringArbitrary(1, 20), { nil: undefined }),
      featuredImage: fc.option(safeStringArbitrary(1, 50), { nil: undefined }),
    }) as fc.Arbitrary<RemotePostMetadata>,
    content: safeStringArbitrary(10, 200),
  }) as fc.Arbitrary<RemoteBlogPost>;

  it('Property 4: should return the correct post when slug exists', () => {
    fc.assert(
      fc.property(
        slugArbitrary,
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 10 }),
        (targetSlug, otherPosts) => {
          // Filter out any posts that happen to have the same slug
          const filteredOtherPosts = otherPosts.filter(p => p.metadata.slug !== targetSlug);
          
          // Create a post with the target slug
          const targetPost: RemoteBlogPost = {
            metadata: {
              title: 'Target Post',
              slug: targetSlug,
              date: '2024-01-15',
              tags: ['test'],
              summary: 'Test summary',
              description: 'Test summary',
            },
            content: 'Test content',
          };

          // Insert target post at a random position
          const insertIndex = Math.floor(Math.random() * (filteredOtherPosts.length + 1));
          const posts = [
            ...filteredOtherPosts.slice(0, insertIndex),
            targetPost,
            ...filteredOtherPosts.slice(insertIndex),
          ];

          const result = findPostBySlug(posts, targetSlug);

          // Should return the post with matching slug
          expect(result).not.toBeNull();
          expect(result?.metadata.slug).toBe(targetSlug);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: should return null when slug does not exist', () => {
    fc.assert(
      fc.property(
        slugArbitrary,
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 10 }),
        (nonExistentSlug, posts) => {
          // Filter out any posts that happen to have the target slug
          const filteredPosts = posts.filter(p => p.metadata.slug !== nonExistentSlug);

          const result = findPostBySlug(filteredPosts, nonExistentSlug);

          // Should return null when slug doesn't exist
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
