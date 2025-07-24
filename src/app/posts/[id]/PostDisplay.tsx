"use client";

import { useEffect, useState } from "react";
import { Post } from "@/app/_types/post";
import dayjs from "dayjs";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useLayoutStore } from "@/app/_store/viewStore";
import Comments from "@/app/_components/Comments";
import { deletePost } from "@/app/_services/posts";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/_store/authStore";

export default function PostDisplay({ post }: { post: Post }) {
  const headerHeight = useLayoutStore((state) => state.headerHeight);
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isLogin } = useAuthStore();

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
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      alert("게시글이 삭제되었습니다.");
      router.push("/");
    } catch {
      // error 매개변수 완전히 제거
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <article
      className="font-paperlogy text-neutral-800 dark:text-neutral-100 max-w-5xl mx-auto"
      style={{ paddingTop: headerHeight + 40 }}
    >
      {/* 썸네일 */}
      {post.thumbnailUrl && (
        <div className="relative w-full h-[50vh] min-h-[400px] rounded-3xl mb-12 overflow-hidden shadow-2xl">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          {/* 수정/삭제 버튼 */}
          {isLogin && (
            <div className="absolute top-6 right-6 z-10">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  <i className="bx bx-dots-vertical-rounded text-xl text-white"></i>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <i className="bx bx-edit-alt text-lg"></i>
                      수정하기
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50"
                    >
                      <i className="bx bx-trash text-lg"></i>
                      {isDeleting ? "삭제 중..." : "삭제하기"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 제목 오버레이 */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {post.title}
              </h1>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                <span className="text-lg font-medium">
                  {dayjs(post.createdAt).format("YYYY년 M월 D일")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* thumbnail 관련 */}
      {!post.thumbnailUrl && (
        <div className="mb-12 px-6 lg:px-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-6 flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                {post.title}
              </h1>
              <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <span className="text-lg font-medium">
                  {dayjs(post.createdAt).format("YYYY년 M월 D일")}
                </span>
              </div>
            </div>

            {/* no thumbnail del,update 버튼 */}
            <div className="relative ml-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <i className="bx bx-dots-vertical-rounded text-xl text-gray-600 dark:text-gray-400"></i>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <i className="bx bx-edit-alt text-lg"></i>
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50"
                  >
                    <i className="bx bx-trash text-lg"></i>
                    {isDeleting ? "삭제 중..." : "삭제하기"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* contents */}
      <div className="px-6 lg:px-8">
        <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 카테고리(태그) */}
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
                    className="group relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-md transform hover:scale-105"
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
  );
}
