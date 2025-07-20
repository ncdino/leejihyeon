"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAllCategories } from "../_services/posts";
import { useCategoryState } from "../_store/themeStore";

export default function CategoryList() {
  const { data: categories, isLoading } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { isOpen, toggle } = useCategoryState();

  if (isLoading) return <div>Loading...</div>;

  return (
    <aside className="font-paperlogy max-w-5xl mx-auto tracking-tighter p-4 rounded-lg bg-transparent mb-10">
      <div>
        <div className="flex justify-between items-center font-bold mb-4 text-lg dark:text-white uppercase">
          <h3 className="">TAGS</h3>
          <button onClick={toggle}>
            <div className="cursor-pointer">
              {isOpen ? (
                <i className="bx bx-chevron-up text-3xl"></i>
              ) : (
                <i className="bx bx-chevron-down text-3xl"></i>
              )}
            </div>
          </button>
        </div>
        {isOpen && (
          <ul className="flex flex-row flex-wrap gap-2">
            {categories?.map((category) => (
              <li key={category}>
                <Link
                  href={`/category/${category}`}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-300 transition-colors duration-300"
                >
                  #{category}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
