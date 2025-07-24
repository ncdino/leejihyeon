const axios = require('axios');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://leejihyeon.dev',
  generateRobotsTxt: true,

  // 동적 URL을 생성하기 위한 함수
  transform: async (config, path) => {
    // 기본 속성을 반환하도록 설정
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },

  // 추가적인 동적 경로를 생성
  additionalPaths: async (config) => {
    const response = await axios.get('https://api.leejihyeon.dev/api/memos/all');
    const posts = response.data;

    return posts.map(post => ({
      loc: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.createdAt,
      priority: 0.8,
    }));
  },
};