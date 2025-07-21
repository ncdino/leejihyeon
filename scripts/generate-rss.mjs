import fs from "fs";
import RSS from "rss";

const API_URL =
  "https://api.leejihyeon.dev/api/memos?size=999" ||
  "http://localhost:8088/api/memos?size=999";
async function fetchAllPosts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.content;
}

async function generateRSSFeed() {
  const siteUrl = "https://leejihyeon.dev";
  const allPosts = await fetchAllPosts();

  const feed = new RSS({
    title: "leejihyeon.dev",
    description: "프론트엔드 개발자 블로그, leejihyeon.dev",
    feed_url: `${siteUrl}/feed.xml`,
    site_url: siteUrl,
    language: "ko",
  });

  allPosts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.content,
      url: `${siteUrl}/posts/${post.id}`,
      guid: `${siteUrl}/posts/${post.id}`,
      date: post.createdAt,
    });
  });

  fs.writeFileSync("./public/feed.xml", feed.xml({ indent: true }));
  console.log("RSS feed generated successfully.");
}

generateRSSFeed();
