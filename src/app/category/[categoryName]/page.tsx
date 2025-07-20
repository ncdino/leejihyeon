"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getPostsByCategory } from "@/app/_services/posts";
import { Post } from "@/app/_types/post";
import { stripMarkdown } from "@/app/_lib/stripMarkdown";
import dayjs from "dayjs";
import { useLayoutStore } from "@/app/_store/viewStore";

interface Page<T> {
  content: T[];
  totalPages: number;
  number: number;
}

export default function CategoryPage() {
  const headerHeight = useLayoutStore((state) => state.headerHeight);
  const params = useParams();
  const searchParams = useSearchParams();

  const categoryName = Array.isArray(params.categoryName)
    ? params.categoryName[0]
    : params.categoryName;
  const page = parseInt(searchParams.get("page") || "0", 10);

  const {
    data: postPage,
    isLoading,
    isError,
  } = useQuery<Page<Post>>({
    queryKey: ["posts", categoryName, page],
    // 카테고리, 페이지가 바뀔때마다 쿼리 재실행함.
    queryFn: () =>
      getPostsByCategory({ category: categoryName as string, pageParam: page }),
    enabled: !!categoryName,
  });

  if (isLoading || !categoryName) {
    return <div className="p-5 text-center">로딩 중입니다...</div>;
  }
  if (isError || !postPage) {
    return (
      <div className="p-5 text-center text-red-500">에러가 발생했습니다.</div>
    );
  }
  const decodedCategoryName = decodeURIComponent(categoryName);

  const renderPageNumbers = () => {
    if (!postPage) return null;

    const pageNumbers = [];
    for (let i = 0; i < postPage.totalPages; i++) {
      pageNumbers.push(
        <Link key={i} href={`/category/${categoryName}?page=${i}`}>
          <span
            className={`font-paperlogy text-lg px-3 py-1 rounded-md mx-1 transition-colors ${
              page === i
                ? "font-bold bg-gray-800 text-white"
                : "bg-neutral-50 hover:bg-neutral-200"
            }`}
          >
            {i + 1}
          </span>
        </Link>
      );
    }
    return pageNumbers;
  };

  return (
    <main className="p-5 max-w-7xl mx-auto" style={{ marginTop: headerHeight }}>
      <h1 className="flex justify-center mb-10">
        <span className="font-paperlogy inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2 text-2xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 group transition-all duration-300">
          <span className="text-gray-400 group-hover:text-gray-700 dark:text-gray-400 group-hover:dark:text-gray-200 mr-1 transition-colors duration-300">
            #
          </span>
          {decodedCategoryName}
        </span>
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {postPage.content.length > 0 ? (
          postPage.content.map((post) => {
            const summaryText = stripMarkdown(post.content);
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="no-underline text-inherit"
              >
                <li className="col-span-1 border-dashed border-2 border-gray-400 rounded-3xl p-4 cursor-pointer text-neutral-950 dark:text-neutral-50 font-paperlogy tracking-tight h-96 flex flex-col overflow-hidden hover:border-gray-600 hover:dark:border-neutral-50 transition-colors duration-200">
                  <div className="flex-shrink-0 mb-3">
                    {post.imageUrls[0] ? (
                      <img
                        src={post.imageUrls[0] || undefined}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-40 rounded-2xl bg-yellow-300">
                        <i className="bx bx-pyramid text-6xl text-gray-700"></i>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-h-0">
                    <div className="flex justify-end items-center text-sm text-gray-500 dark:text-neutral-300 mb-2">
                      <span>
                        {dayjs(post.createdAt).format("YYYY년 M월 D일")}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2 line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-gray-700 dark:text-neutral-300 text-sm line-clamp-4 flex-1">
                      {summaryText}
                    </p>
                  </div>
                </li>
              </Link>
            );
          })
        ) : (
          <p>이 카테고리에는 아직 게시글이 없습니다.</p>
        )}
      </ul>
      <div className="flex justify-center items-center mt-8">
        {renderPageNumbers()}
      </div>
    </main>
  );
}
