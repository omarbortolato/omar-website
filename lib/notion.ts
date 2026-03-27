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
  content: string; // HTML from page blocks
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
    .replace(/[\u0300-\u036f]/g, "")
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

// Converts a rich_text array to HTML, handling bold and italic annotations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextToHtml(rich: any[]): string {
  if (!Array.isArray(rich)) return "";
  return rich
    .map((r) => {
      let text = r.plain_text ?? "";
      if (!text) return "";
      // Escape HTML entities
      text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      if (r.annotations?.bold) text = `<strong>${text}</strong>`;
      if (r.annotations?.italic) text = `<em>${text}</em>`;
      if (r.annotations?.code) text = `<code>${text}</code>`;
      if (r.href) text = `<a href="${r.href}">${text}</a>`;
      return text;
    })
    .join("");
}

// Fetches page blocks and converts them to an HTML string
async function getPageBlocks(pageId: string): Promise<string> {
  if (!NOTION_API_KEY) return "";

  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children`,
    {
      headers: notionHeaders(),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: { results: any[] } = await res.json();
  const blocks = data.results ?? [];

  const html: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const type: string = block.type;

    // Group consecutive bulleted_list_item into <ul>
    if (type === "bulleted_list_item") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(`<li>${richTextToHtml(blocks[i].bulleted_list_item.rich_text)}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Group consecutive numbered_list_item into <ol>
    if (type === "numbered_list_item") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(`<li>${richTextToHtml(blocks[i].numbered_list_item.rich_text)}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    switch (type) {
      case "paragraph": {
        const text = richTextToHtml(block.paragraph.rich_text);
        if (text) html.push(`<p>${text}</p>`);
        break;
      }
      case "heading_2": {
        const text = richTextToHtml(block.heading_2.rich_text);
        if (text) html.push(`<h2>${text}</h2>`);
        break;
      }
      case "heading_3": {
        const text = richTextToHtml(block.heading_3.rich_text);
        if (text) html.push(`<h3>${text}</h3>`);
        break;
      }
      case "quote": {
        const text = richTextToHtml(block.quote.rich_text);
        if (text) html.push(`<blockquote>${text}</blockquote>`);
        break;
      }
      case "code": {
        const text = extractRichText(block.code.rich_text);
        if (text) html.push(`<pre><code>${text}</code></pre>`);
        break;
      }
      default:
        break;
    }

    i++;
  }

  return html.join("\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePost(page: any): BlogPost {
  const props = page.properties;

  const title = extractRichText(props?.Title?.title ?? []);
  const abstract = extractRichText(props?.["Blog Abstract"]?.rich_text ?? []);
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
    content: "", // populated only in getBlogPost()
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
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  // content is intentionally empty here — loaded only per-article
  return (data.results ?? []).map(parsePost).filter((p: BlogPost) => p.title);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug) ?? null;
  if (!post) return null;

  // Load the full body from page blocks
  post.content = await getPageBlocks(post.id);
  return post;
}
