import { graphql } from '@octokit/graphql';

export interface DiscussionMetrics {
  commentCount: number;
  reactionCount: number;
}

// Cache for discussion metrics to avoid rate limits
const metricsCache = new Map<string, { data: DiscussionMetrics; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const REPO_OWNER = 'Shourya-8416';
const REPO_NAME = 'blog-discussion';

/**
 * Create authenticated GraphQL client
 */
function getGraphQLClient() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return null;
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

/**
 * Fetch discussion metrics for a single post by slug
 * Requirements: 7.1
 */
export async function getDiscussionMetrics(slug: string): Promise<DiscussionMetrics | null> {
  // Check cache first
  const cached = metricsCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const client = getGraphQLClient();
  if (!client) {
    return null;
  }

  try {
    const query = `
      query GetDiscussion($owner: String!, $repo: String!, $searchQuery: String!) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 1, filterBy: { answered: null }, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              title
              url
              comments {
                totalCount
              }
              reactions {
                totalCount
              }
            }
          }
        }
        search(query: $searchQuery, type: DISCUSSION, first: 1) {
          nodes {
            ... on Discussion {
              title
              comments {
                totalCount
              }
              reactions {
                totalCount
              }
            }
          }
        }
      }
    `;

    const searchQuery = `repo:${REPO_OWNER}/${REPO_NAME} in:title ${slug}`;
    
    const response = await client<{
      search: {
        nodes: Array<{
          title: string;
          comments: { totalCount: number };
          reactions: { totalCount: number };
        }>;
      };
    }>(query, {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      searchQuery,
    });

    const discussion = response.search.nodes[0];
    if (!discussion) {
      return { commentCount: 0, reactionCount: 0 };
    }

    const metrics: DiscussionMetrics = {
      commentCount: discussion.comments.totalCount,
      reactionCount: discussion.reactions.totalCount,
    };

    // Cache the result
    metricsCache.set(slug, { data: metrics, timestamp: Date.now() });

    return metrics;
  } catch (error) {
    console.error(`Error fetching discussion metrics for ${slug}:`, error);
    return null;
  }
}


/**
 * Fetch metrics for all posts (batched)
 * Requirements: 7.1
 */
export async function getAllDiscussionMetrics(): Promise<Map<string, DiscussionMetrics>> {
  const client = getGraphQLClient();
  const result = new Map<string, DiscussionMetrics>();

  if (!client) {
    return result;
  }

  try {
    const query = `
      query GetAllDiscussions($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              title
              comments {
                totalCount
              }
              reactions {
                totalCount
              }
            }
          }
        }
      }
    `;

    const response = await client<{
      repository: {
        discussions: {
          nodes: Array<{
            title: string;
            comments: { totalCount: number };
            reactions: { totalCount: number };
          }>;
        };
      };
    }>(query, {
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    const discussions = response.repository.discussions.nodes;
    
    for (const discussion of discussions) {
      // Extract slug from discussion title
      // Handle titles like "blog/building-scalable-apis-with-spring-boot" or just "building-scalable-apis-with-spring-boot"
      let slug = discussion.title.toLowerCase().replace(/\s+/g, '-');
      
      // Remove "blog/" prefix if present
      if (slug.startsWith('blog/')) {
        slug = slug.substring(5);
      }
      
      const metrics: DiscussionMetrics = {
        commentCount: discussion.comments.totalCount,
        reactionCount: discussion.reactions.totalCount,
      };

      result.set(slug, metrics);
      
      // Also cache individual results
      metricsCache.set(slug, { data: metrics, timestamp: Date.now() });
    }

    return result;
  } catch (error) {
    console.error('Error fetching all discussion metrics:', error);
    return result;
  }
}

/**
 * Clear the metrics cache (useful for testing or forced refresh)
 */
export function clearMetricsCache(): void {
  metricsCache.clear();
}
