import fs from "fs";
import RSS from "rss";
const isProd = process.env.NODE_ENV === "production";

const API_URL = isProd
  ? "https://api.leejihyeon.dev/api/memos?size=999"
  : "http://localhost:8088/api/memos?size=999";

async function fetchAllPosts() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      const text = await res.text();
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data.content)) {
      console.error("content 없음");
      return [];
    }

    return data.content;
  } catch (err) {
    console.error("fetchAllPosts 실패: ", err);
    return [];
  }
}

async function generateRSSFeed() {
  const siteUrl = "https://leejihyeon.dev";
  const allPosts = await fetchAllPosts();

  if (!allPosts.length) {
    console.warn("RSS 생성을 건너뜁니다: 가져온 게시물이 없습니다.");
    return;
  }

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

  try {
    fs.writeFileSync("./public/feed.xml", feed.xml({ indent: true }));
  } catch (err) {
    console.error("RSS 생성실패 ", err);
  }
}

generateRSSFeed();
