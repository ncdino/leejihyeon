"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/post";
import dayjs from "dayjs";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { useLayoutStore } from "@/app/_store/viewStore";
import { useAuthStore } from "@/app/_store/authStore";
import { deletePost } from "@/app/_services/posts";
import Comments from "@/app/_components/Comments";
import TOC from "@/app/_components/TOC";
import PostActions from "@/app/_components/PostActions";

export default function PostDisplay({ post }: { post: Post }) {
  const headerHeight = useLayoutStore((state) => state.headerHeight);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isLogin } = useAuthStore(); // 현재 사용자 정보

  useEffect(() => {
    // Recently viewed post 저장 로직
    if (post) {
      const recentPosts: Post[] = JSON.parse(
        localStorage.getItem("recentPosts") || "[]"
      );
      const filteredPosts = recentPosts.filter((p) => p.id !== post.id);
      const newRecentPosts = [post, ...filteredPosts];
      const limitedPosts = newRecentPosts.slice(0, 5);
      localStorage.setItem("recentPosts", JSON.stringify(limitedPosts));
    }
  }, [post]);

  const handleEdit = () => {
    router.push(`/new-post?edit=${post.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id.toString());
      alert("게시글이 삭제되었습니다.");
      router.push("/");
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <TOC content={post.content} />
      <article
        className="font-paperlogy text-neutral-800 dark:text-neutral-100 max-w-4xl mx-auto"
        style={{ paddingTop: headerHeight + 40 }}
      >
        {/* 썸네일 */}
        {post.thumbnailUrl ? (
          <div className="relative w-full h-[50vh] min-h-[400px] rounded-3xl mb-12 overflow-hidden shadow-2xl">
            {isLogin && (
              <PostActions
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isDeleting={isDeleting}
                className="absolute top-6 right-6 z-10"
                iconClassName="text-white"
              />
            )}
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover blur-[2px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <title className="text-2xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {post.title}
              </title>
              <span className="text-lg font-medium text-white/90 mt-4">
                {dayjs(post.createdAt).format("YYYY년 M월 D일")}
              </span>
            </div>
          </div>
        ) : (
          // 썸네일 x 텍스트 only
          <div className="mb-12 px-6 lg:px-8">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-6 flex-1">
                <h1 className="text-2xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                  {post.title}
                </h1>
                <span className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
                  {dayjs(post.createdAt).format("YYYY년 M월 D일")}
                </span>
              </div>
              {isLogin && (
                <PostActions
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          </div>
        )}

        {/* --- 본문 (content) --- */}
        <div className="px-6 lg:px-8">
          <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            <ReactMarkdown
              rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "prepend" }],
              ]}
              remarkPlugins={[
                remarkGfm,
                [remarkToc, { heading: "목차", tight: true }],
              ]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category}`}
                      className="group relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-gray-100 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900/30 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300"
                    >
                      <span className="mr-1 opacity-60">#</span>
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 border-t pt-8 px-4 md:px-5 lg:px-6">
          <Comments />
        </div>
      </article>
    </div>
  );
}
