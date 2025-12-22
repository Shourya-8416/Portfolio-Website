---
title: "Hello World: Welcome to My Blog"
date: "2025-01-15"
description: "An introduction to my new blog featuring examples of all supported content types including code blocks, tables, callouts, and embedded media."
tags: ["introduction", "tutorial", "web-development"]
slug: "hello-world"
featuredImage: "/project-1.png"
---

# Welcome to My Blog! 👋

I'm excited to launch this blog where I'll be sharing my thoughts on web development, programming, and technology. This first post serves as both an introduction and a demonstration of all the content types supported by this blog.

## About This Blog

This blog is built with **Next.js** and uses **MDX** for content, allowing me to write in Markdown while also embedding interactive React components. Let me show you what's possible!

## Text Formatting

You can use all standard Markdown formatting:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ~~Strikethrough~~ for corrections
- `inline code` for technical terms
- [Links](https://nextjs.org) to external resources

### Lists

Here's an ordered list of my favorite technologies:

1. TypeScript
2. React
3. Next.js
4. Tailwind CSS

And an unordered list of things I enjoy:

- Building user interfaces
- Solving complex problems
- Learning new technologies
- Writing clean code

## Code Blocks

One of the most important features for a developer blog is syntax highlighting. Here's an example of a TypeScript function:

```typescript
interface BlogPost {
  title: string;
  date: string;
  content: string;
  tags: string[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const post: BlogPost = {
  title: "Hello World",
  date: "2025-01-15",
  content: "Welcome to my blog!",
  tags: ["introduction"]
};

console.log(formatDate(post.date)); // January 15, 2025
```

Here's some CSS for styling:

```css
.blog-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
}
```

And a simple shell command:

```bash
npm install next-mdx-remote gray-matter
```

## Tables

Tables are great for comparing information:

| Feature | Description | Status |
|---------|-------------|--------|
| MDX Support | Write JSX in Markdown | ✅ Complete |
| Syntax Highlighting | Code blocks with colors | ✅ Complete |
| Comments | Giscus integration | ✅ Complete |
| Dark Mode | Matches site theme | ✅ Complete |

## Callouts

Callouts help highlight important information:

<Callout type="note">
This is a note callout. Use it for additional information that readers might find helpful.
</Callout>

<Callout type="tip">
Pro tip: You can use keyboard shortcuts to navigate faster. Press `Ctrl+K` to open the command palette in VS Code!
</Callout>

<Callout type="warning">
Be careful when using `rm -rf` commands. Always double-check the path before executing!
</Callout>

<Callout type="important">
Important: Make sure to back up your data before making any major changes to your system.
</Callout>

## Embedded Media

### YouTube Videos

You can embed YouTube videos directly in your posts:

<YouTube videoId="dQw4w9WgXcQ" />

### Tweets

And embed tweets from Twitter/X:

<Tweet id="1234567890" />

## Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

## Images

You can include images in your posts:

![Project Screenshot](/project-1.png)

## What's Next?

In upcoming posts, I'll be covering:

- Building a portfolio website with Next.js
- Implementing dark mode with Tailwind CSS
- Setting up a blog with MDX
- Deploying to Vercel

Stay tuned for more content! Feel free to leave a comment below using your GitHub account.

---

*Thanks for reading! If you found this helpful, consider sharing it with others.*
