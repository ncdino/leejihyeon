"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Post } from "../_types/post";

export default function RecentPosts() {
  const [recentPost, setRecentPost] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const items: Post[] = JSON.parse(
      localStorage.getItem("recentPosts") || "[]"
    );

    if (items.length > 0) {
      setRecentPost(items[0]);
    }
  }, [pathname]);

  const showOnPaths = ["/", "/category/"];
  const shouldShow = showOnPaths.some((path) => pathname.startsWith(path));

  if (!isOpen || !shouldShow || !recentPost) {
    return null;
  }

  return (
    <aside
      className="fixed z-40 w-10/12 max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-400 dark:border-gray-700 
             bottom-4 left-1/2 -translate-x-1/2 
             md:bottom-6 md:right-4 md:left-auto md:translate-x-0"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,1)_0%,rgba(59,130,246,0)_70%)]" />
          <h3 className="font-bitcount font-bold text-sm dark:text-white">
            Recently viewed post
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="dark:text-gray-400 hover:dark:text-white"
        >
          <i className="bx bx-x"></i>
        </button>
      </div>
      <div className="text-sm truncate flex flex-row items-center">
        <Link
          href={`/posts/${recentPost.id}`}
          className="font-paperlogy text-gray-600 dark:text-gray-300 hover:font-bold"
        >
          {recentPost.title}
        </Link>
      </div>
    </aside>
  );
}
