// ─── Notion CMS utility ──────────────────────────────────────────────────────
// Reads blog posts from the Notion Content Inbox database.
// No Notion SDK — plain fetch with revalidation.

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = "2cfef582-d259-806b-a7a6-efc8bff25a68";
const NOTION_VERSION = "2022-06-28";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content: string; // HTML from Blog Expanded
  tags: string[];
  publishedDate: string;
  metaTitle: string;
  metaDescription: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

function extractRichText(rich: { plain_text: string }[]): string {
  if (!Array.isArray(rich)) return "";
  return rich.map((r) => r.plain_text).join("");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePost(page: any): BlogPost {
  const props = page.properties;

  const title = extractRichText(props?.Title?.title ?? []);
  const abstract = extractRichText(props?.["Blog Abstract"]?.rich_text ?? []);
  const content = extractRichText(props?.["Blog Expanded"]?.rich_text ?? []);
  const metaTitle = extractRichText(props?.["Meta Title"]?.rich_text ?? []);
  const metaDescription = extractRichText(props?.["Meta Description"]?.rich_text ?? []);
  const tags: string[] = (props?.Tags?.multi_select ?? []).map(
    (t: { name: string }) => t.name
  );
  const publishedDate: string = props?.["Published Date"]?.date?.start ?? "";

  return {
    id: page.id,
    title,
    slug: generateSlug(title),
    abstract,
    content,
    tags,
    publishedDate,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || abstract,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!NOTION_API_KEY) return [];

  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          property: "Status",
          select: { equals: "Published" },
        },
        sorts: [
          {
            property: "Published Date",
            direction: "descending",
          },
        ],
      }),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.results ?? []).map(parsePost).filter((p: BlogPost) => p.title);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
