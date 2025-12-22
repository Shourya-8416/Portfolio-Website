# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - [x] 1.1 Install required packages (gray-matter, next-mdx-remote, rehype-highlight, remark-gfm, @giscus/react, @octokit/graphql)


    - Run npm install for all dependencies
    - _Requirements: 3.1, 3.3, 6.3, 7.1_
  - [x] 1.2 Create content/blog directory structure


    - Create content/blog folder for markdown posts
    - _Requirements: 3.1_
  - [x] 1.3 Create app/components/blog directory structure


    - Create folders for blog components and mdx components
    - _Requirements: 4.1_


- [x] 2. Implement blog utilities




  - [x] 2.1 Create utils/blog.ts with core functions


    - Implement getAllPosts(), getPostBySlug(), calculateReadingTime()
    - Implement parseMetadata() and serializeMetadata() for frontmatter
    - _Requirements: 1.1, 2.1, 3.1, 3.2_
  - [x] 2.2 Write property test for date sorting


    - **Property 1: Posts are sorted by date descending**
    - **Validates: Requirements 1.1**
  - [x] 2.3 Write property test for frontmatter round-trip

    - **Property 7: Metadata round-trip consistency**
    - **Validates: Requirements 3.4**
  - [x] 2.4 Create utils/github.ts for Discussion metrics


    - Implement getDiscussionMetrics() and getAllDiscussionMetrics()
    - Use GitHub GraphQL API to fetch comment and reaction counts
    - _Requirements: 7.1_

- [x] 3. Checkpoint - Ensure utilities work correctly





  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement MDX components






  - [x] 4.1 Create YouTube embed component


    - Implement responsive iframe for YouTube videos
    - _Requirements: 6.1_
  - [x] 4.2 Write property test for YouTube embed


    - **Property 8: YouTube embed renders iframe**
    - **Validates: Requirements 6.1**
  - [x] 4.3 Create Tweet embed component


    - Implement Twitter/X embed component
    - _Requirements: 6.2_
  - [x] 4.4 Create Callout component


    - Implement styled callout boxes (note, tip, warning, important)
    - _Requirements: 6.4_

  - [x] 4.5 Create MDX components index

    - Export all MDX components from index.ts
    - _Requirements: 6.1, 6.2, 6.4_

- [x] 5. Implement blog UI components





  - [x] 5.1 Create BlogCard component


    - Display title, date, description, tags, featured image
    - Show comment count and reaction count
    - Add hover animations
    - _Requirements: 1.2, 1.3, 5.1_
  - [x] 5.2 Write property test for BlogCard fields


    - **Property 2: Blog card contains required fields**
    - **Validates: Requirements 1.2**
  - [x] 5.3 Write property test for BlogCard link

    - **Property 3: Blog card links to correct post**
    - **Validates: Requirements 1.3**
  - [x] 5.4 Create BlogHeader component


    - Reusable header for blog pages
    - _Requirements: 1.4, 4.1_
  - [x] 5.5 Create BlogPostContent component


    - Display post metadata (title, date, reading time, tags)
    - Render MDX content
    - Include back link to listing
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 5.6 Write property test for post metadata display


    - **Property 5: Post page displays all metadata**
    - **Validates: Requirements 2.2**
  - [x] 5.7 Create GiscusComments component


    - Client component wrapping Giscus
    - Configure with Shourya-8416/blog-discussion repo settings
    - _Requirements: 7.1, 7.2, 7.3, 7.4_


- [x] 6. Checkpoint - Ensure components render correctly




  - Ensure all tests pass, ask the user if questions arise.


- [x] 7. Implement blog pages




  - [x] 7.1 Create blog listing page (app/blog/page.tsx)


    - Fetch all posts sorted by date
    - Fetch discussion metrics for each post
    - Render BlogHeader and grid of BlogCards
    - _Requirements: 1.1, 1.2, 1.4_
  - [x] 7.2 Create blog post page (app/blog/[slug]/page.tsx)


    - Fetch post by slug
    - Render BlogPostContent with MDX
    - Include GiscusComments section
    - Handle 404 for invalid slugs
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.1_
  - [x] 7.3 Write property test for markdown rendering


    - **Property 4: Markdown renders to HTML**
    - **Validates: Requirements 2.1, 3.1**

- [x] 8. Update site navigation






  - [x] 8.1 Add Blog link to header navigation

    - Update Header component to include Blog link
    - _Requirements: 4.4_

- [x] 9. Add sample blog post






  - [x] 9.1 Create sample markdown blog post

    - Create content/blog/hello-world.md with frontmatter and content
    - Include examples of all supported content types
    - _Requirements: 3.1, 3.2, 3.3_


- [x] 10. Add styling and animations




  - [x] 10.1 Add blog-specific styles to globals.css


    - Style markdown content (prose styles)
    - Style code blocks with syntax highlighting
    - Style tables and callouts
    - _Requirements: 4.2, 6.3, 6.4, 6.5_
  - [x] 10.2 Write property test for table rendering


    - **Property 10: Tables render as HTML tables**
    - **Validates: Requirements 6.5**
  - [x] 10.3 Add page transitions and entry animations


    - Apply Framer Motion animations consistent with site
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 11. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
