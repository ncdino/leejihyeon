"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAllCategories } from "../_services/posts";
import { useCategoryState } from "../_store/themeStore";
import { CategoryCount } from "../_types/post";

export default function CategoryList() {
  const { data: categories, isLoading } = useQuery<CategoryCount[]>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { isOpen, toggle } = useCategoryState();

  if (isLoading) return <div>Loading...</div>;

  return (
    <aside className="font-paperlogy max-w-3xl mx-auto tracking-tighter p-4 rounded-lg bg-transparent mb-4">
      <div>
        <div className="flex justify-between items-center font-bold mb-4 text-lg dark:text-white uppercase">
          <h3 className="">TAGS</h3>
          <button onClick={toggle}>
            <div className="cursor-pointer">
              {isOpen ? (
                <i className="bx bx-chevron-down text-4xl"></i>
              ) : (
                <i className="bx bx-chevron-up text-4xl"></i>
              )}
            </div>
          </button>
        </div>
        {isOpen && (
          <ul className="flex flex-row flex-wrap gap-2">
            {categories?.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/category/${category.name}`}
                  className="inline-block bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs lg:text-sm font-bold text-gray-700 dark:text-gray-100 hover:bg-gray-300 transition-colors duration-300"
                >
                  <span className="mr-0.5">#{category.name}</span>
                  <span className="text-[9px] lg:text-[10px]">
                    ({category.postCount})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
