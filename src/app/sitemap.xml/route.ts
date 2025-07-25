import { MemoSitemapDto } from "../_types/post";
import { getAllMemosForSitemap } from "../_services/posts";

export const revalidate = 3600;

export async function GET() {
  const baseUrl = "https://leejihyeon.dev";

  const posts: MemoSitemapDto[] = await getAllMemosForSitemap();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts
    .map((post) => {
      return `
    <url>
      <loc>${baseUrl}/posts/${post.id}</loc>
      <lastmod>${new Date(post.createdAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
      `;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
