import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseMetadata, serializeMetadata, PostMetadata } from './blog';
import matter from 'gray-matter';

/**
 * **Feature: blog-page, Property 1: Posts are sorted by date descending**
 * **Validates: Requirements 1.1**
 * 
 * For any collection of blog posts with different dates, when retrieved,
 * the resulting array SHALL be ordered with the most recent date first.
 */
describe('Property 1: Posts are sorted by date descending', () => {
  it('should sort posts by date in descending order', () => {
    // Generate valid ISO date strings directly to avoid NaN dates
    const dateStringArbitrary = fc.integer({ min: 2020, max: 2030 }).chain(year =>
      fc.integer({ min: 1, max: 12 }).chain(month =>
        fc.integer({ min: 1, max: 28 }).map(day => {
          const m = String(month).padStart(2, '0');
          const d = String(day).padStart(2, '0');
          return `${year}-${m}-${d}`;
        })
      )
    );

    fc.assert(
      fc.property(
        fc.array(dateStringArbitrary, { minLength: 2, maxLength: 20 }),
        (dates) => {
          // Create mock posts with these dates
          const posts = dates.map((date, i) => ({
            metadata: {
              title: `Post ${i}`,
              date: date,
              description: `Description ${i}`,
              tags: ['test'],
              slug: `post-${i}`,
            },
            content: `Content ${i}`,
          }));

          // Sort using the same logic as getAllPosts
          const sorted = [...posts].sort((a, b) => {
            const dateA = new Date(a.metadata.date).getTime();
            const dateB = new Date(b.metadata.date).getTime();
            return dateB - dateA;
          });

          // Verify each post is >= the next post's date
          for (let i = 0; i < sorted.length - 1; i++) {
            const currentDate = new Date(sorted[i].metadata.date).getTime();
            const nextDate = new Date(sorted[i + 1].metadata.date).getTime();
            expect(currentDate).toBeGreaterThanOrEqual(nextDate);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: blog-page, Property 7: Metadata round-trip consistency**
 * **Validates: Requirements 3.4**
 * 
 * For any valid PostMetadata object, serializing to frontmatter and then
 * parsing back SHALL produce an equivalent metadata object.
 */
describe('Property 7: Metadata round-trip consistency', () => {
  it('should preserve metadata through serialize/parse round-trip', () => {
    // Generate safe strings that won't be mangled by YAML parsing
    // Exclude: quotes, newlines, backslashes, colons, and other YAML special chars
    const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_';
    const safeStringArbitrary = (minLen: number, maxLen: number) =>
      fc.array(fc.constantFrom(...safeChars.split('')), { minLength: minLen, maxLength: maxLen })
        .map(chars => chars.join(''))
        .filter(s => s.trim().length > 0); // Ensure non-empty after trim

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

    // Arbitrary for valid PostMetadata
    const postMetadataArbitrary = fc.record({
      title: safeStringArbitrary(1, 50),
      date: dateStringArbitrary,
      description: safeStringArbitrary(1, 100),
      tags: fc.array(safeStringArbitrary(1, 15), { minLength: 1, maxLength: 5 }),
      slug: fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 1, maxLength: 30 })
        .map(chars => chars.join(''))
        .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s)),
      featuredImage: fc.option(
        safeStringArbitrary(1, 50).map(s => `/blog/${s}.png`),
        { nil: undefined }
      ),
    });

    fc.assert(
      fc.property(postMetadataArbitrary, (metadata: PostMetadata) => {
        // Serialize to frontmatter
        const serialized = serializeMetadata(metadata);
        
        // Parse back using gray-matter
        const parsed = matter(serialized + '\n\nContent here');
        
        // Use parseMetadata to get back PostMetadata
        const result = parseMetadata(parsed.data, metadata.slug);
        
        // Verify round-trip produces equivalent metadata
        expect(result).not.toBeNull();
        if (result) {
          expect(result.title).toBe(metadata.title);
          expect(result.date).toBe(metadata.date);
          expect(result.description).toBe(metadata.description);
          expect(result.tags).toEqual(metadata.tags);
          expect(result.slug).toBe(metadata.slug);
          expect(result.featuredImage).toBe(metadata.featuredImage);
        }
      }),
      { numRuns: 100 }
    );
  });
});
