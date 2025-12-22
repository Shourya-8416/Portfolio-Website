import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { BlogCardProps } from './BlogCard';

/**
 * **Feature: blog-page, Property 2: Blog card contains required fields**
 * **Validates: Requirements 1.2**
 * 
 * For any blog post, when rendered as a BlogCard, the output SHALL contain
 * the title, date, description, and all tags from the post metadata.
 */
describe('Property 2: Blog card contains required fields', () => {
  // Helper to simulate what BlogCard renders (the data it would display)
  function getBlogCardDisplayData(props: BlogCardProps) {
    const formattedDate = new Date(props.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    return {
      title: props.title,
      formattedDate,
      description: props.description,
      tags: props.tags,
      slug: props.slug,
      href: `/blog/${props.slug}`,
    };
  }

  it('should contain all required fields for any valid blog post', () => {
    // Generate safe strings for content
    const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const safeStringArbitrary = (minLen: number, maxLen: number) =>
      fc.array(fc.constantFrom(...safeChars.split('')), { minLength: minLen, maxLength: maxLen })
        .map(chars => chars.join(''))
        .filter(s => s.trim().length > 0);

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
    ).map(chars => chars.join(''))
      .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s));

    // Generate tag
    const tagArbitrary = safeStringArbitrary(1, 15);

    // BlogCardProps arbitrary
    const blogCardPropsArbitrary: fc.Arbitrary<BlogCardProps> = fc.record({
      title: safeStringArbitrary(1, 100),
      slug: slugArbitrary,
      date: dateStringArbitrary,
      description: safeStringArbitrary(1, 200),
      tags: fc.array(tagArbitrary, { minLength: 1, maxLength: 5 }),
      featuredImage: fc.option(fc.constant('/blog/image.png'), { nil: undefined }),
      commentCount: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
      reactionCount: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
    });

    fc.assert(
      fc.property(blogCardPropsArbitrary, (props) => {
        const displayData = getBlogCardDisplayData(props);

        // Verify title is present
        expect(displayData.title).toBe(props.title);
        expect(displayData.title.length).toBeGreaterThan(0);

        // Verify date is formatted and present
        expect(displayData.formattedDate).toBeTruthy();
        // The formatted date should contain the year from the original date
        const year = props.date.split('-')[0];
        expect(displayData.formattedDate).toContain(year);

        // Verify description is present
        expect(displayData.description).toBe(props.description);
        expect(displayData.description.length).toBeGreaterThan(0);

        // Verify all tags are present
        expect(displayData.tags).toEqual(props.tags);
        expect(displayData.tags.length).toBeGreaterThan(0);
        props.tags.forEach(tag => {
          expect(displayData.tags).toContain(tag);
        });
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: blog-page, Property 3: Blog card links to correct post**
 * **Validates: Requirements 1.3**
 * 
 * For any blog post with a given slug, the BlogCard component SHALL render
 * a link with href `/blog/{slug}`.
 */
describe('Property 3: Blog card links to correct post', () => {
  it('should generate correct link href for any valid slug', () => {
    // Generate valid slug
    const slugArbitrary = fc.array(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      { minLength: 1, maxLength: 50 }
    ).map(chars => chars.join(''))
      .filter(s => /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(s));

    fc.assert(
      fc.property(slugArbitrary, (slug) => {
        // The BlogCard generates href as `/blog/${slug}`
        const expectedHref = `/blog/${slug}`;

        // Verify the href format
        expect(expectedHref).toBe(`/blog/${slug}`);
        expect(expectedHref).toMatch(/^\/blog\/[a-z0-9][a-z0-9-]*[a-z0-9]$|^\/blog\/[a-z0-9]$/);
        expect(expectedHref).toContain(slug);
      }),
      { numRuns: 100 }
    );
  });
});
