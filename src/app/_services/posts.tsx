import apiClient from "./api";
import { Post } from "../_types/post";

export const getAllPosts = async ({ pageParam = 0 }) => {
  const res = await apiClient.get(`/api/memos?page=${pageParam}&size=10`);
  return res.data;
};

export const getPostsByCategory = async ({
  category,
  pageParam = 0,
}: {
  category: string;
  pageParam: number;
}) => {
  const res = await apiClient.get(
    `/api/memos?category=${category}&page=${pageParam}&size=6`
  );
  return res.data;
};

export const searchPosts = async ({
  searchTerm,
  pageParam = 0,
}: {
  searchTerm: string;
  pageParam: number;
}) => {
  const res = await apiClient.get(
    `/api/memos/search?q=${encodeURIComponent(
      searchTerm
    )}&page=${pageParam}&size=10`
  );
  return res.data;
};

export const getPostById = async (id: string) => {
  const res = await apiClient.get(`/api/memos/${id}`);
  return res.data;
};

export const getPostCount = async () => {
  const res = await apiClient.get("/api/memos/count");
  return res.data;
};

export const getSearchResultCount = async (searchTerm: string) => {
  const res = await apiClient.get(
    `/api/memos/search/count?q=${encodeURIComponent(searchTerm)}`
  );
  return res.data;
};

export const getAllCategories = async (): Promise<string[]> => {
  const response = await apiClient.get("/api/categories");
  return response.data;
};

export const deletePost = async (id: string) => {
  await apiClient.delete(`/api/memos/${id}`);
};

export const updatePost = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await apiClient.put<Post>(`/api/memos/${id}`, formData);
  return response.data;
};
