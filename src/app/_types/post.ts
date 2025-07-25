export type Post = {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  imageUrls: string[];
  username: string;
  categories: string[];
  createdAt: string;
};

export type MemoRequestDto = {
  title: string;
  content: string;
  categories: string[];
  thumbnailUrl: string | null;
  imageUrls: string[];
};

export type CategoryCount = {
  name: string;
  postCount: number;
};

export type MemoSitemapDto = {
  id: number;
  createdAt: string;
};
