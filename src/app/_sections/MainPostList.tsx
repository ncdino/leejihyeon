"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  getAllPosts,
  searchPosts,
  getPostCount,
  getSearchResultCount,
} from "@/app/_services/posts";
import { Post } from "@/app/_types/post";
import MainPostCard from "../_components/MainContents/MainPostCard";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "@/app/_store/searchStore";
import CategoryList from "../_components/CategoryList";

export default function MainPostList() {
  const { searchTerm } = useSearchStore();
  const isSearching = searchTerm.trim().length > 0;

  const { data: totalCount } = useQuery<number>({
    queryKey: isSearching ? ["searchResultCount", searchTerm] : ["postCount"],
    queryFn: isSearching
      ? () => getSearchResultCount(searchTerm)
      : getPostCount,
    enabled: isSearching ? searchTerm.trim().length > 0 : true,
  });

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: isSearching ? ["searchPosts", searchTerm] : ["posts"],
      queryFn: isSearching
        ? ({ pageParam = 0 }) => searchPosts({ searchTerm, pageParam })
        : getAllPosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.number + 1;
        }
        return undefined;
      },
      enabled: isSearching ? searchTerm.trim().length > 0 : true,
    });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [observerRef, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 text-center bg-opacity-90">
        <img
          // src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Eyes.png"
          // alt="Eyes"
          src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png"
          alt="Star"
          className="w-38 h-38 md:w-44 md:h-44 lg:w-48 lg:h-48 mx-auto mb-4"
        />
        <p className="font-paperlogy text-lg md:text-xl lg:text-2xl dark:text-gray-200 text-gray-600 font-bold">
          글을 찾는중이에요
        </p>
      </div>
    );
  if (isError)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 text-center dark: bg-opacity-90">
        <img
          src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud%20with%20Lightning%20and%20Rain.png"
          alt="Cloud with Lightning and Rain"
          className="w-38 h-38 md:w-44 md:h-44 lg:w-48 lg:h-48 mx-auto mb-4"
        />
        <p className="font-paperlogy text-lg md:text-xl lg:text-2xl dark:text-orange-400 text-orange-600 font-bold">
          지금은 데이터를 불러올 수 없어요
        </p>
      </div>
    );

  return (
    <section className="max-w-5xl mx-auto">
      <CategoryList />

      <ul className="">
        {data?.pages.map((page) =>
          page.content.map((post: Post) => (
            <MainPostCard key={post.id} post={post} />
          ))
        )}
      </ul>
      <div ref={observerRef} />
      {hasNextPage && (
        <div className="text-center">더 많은 글을 불러오는 중...</div>
      )}
      <div className="flex justify-center text-neutral-600 dark:text-neutral-300 mt-12">
        <span className="font-paperlogy text-xl">
          {isSearching ? (
            <>
              <span>&quot;</span>
              <span className="font-bold text-neutral-950 dark:text-neutral-50">
                {searchTerm}
              </span>
              &quot;에 대한 검색 결과{" "}
              <span className="font-bold text-neutral-950 dark:text-neutral-50">
                {totalCount || 0}
              </span>
              개
            </>
          ) : (
            <>
              <span className="mr-1">총</span>
              <span className="font-bold text-neutral-950 dark:text-neutral-50 mr-0.5">
                {totalCount}
              </span>
              개의 글이 있습니다.
            </>
          )}
        </span>
      </div>
    </section>
  );
}
