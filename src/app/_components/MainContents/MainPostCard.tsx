import Link from "next/link";
import dayjs from "dayjs";
import { Post } from "@/app/_types/post";
import { stripMarkdown } from "@/app/_lib/stripMarkdown";

interface PostCardProps {
  post: Post;
}

export default function MainPostCard({ post }: PostCardProps) {
  const summaryText = stripMarkdown(post.content);

  return (
    <li className="border-b pt-4 pb-8 border-gray-300 dark:border-gray-700 font-paperlogy font-light tracking-tight transition-colors duration-300 max-w-3xl mx-auto">
      <div className="flex justify-between">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-4 transition-colors duration-300">
          <div className="flex justify-start">
            {post.categories?.map((category) => (
              <Link
                key={category}
                href={`/category/${category}`}
                className="inline-block bg-gray-200 rounded-full px-2 md:px-3 py-1 text-xs md:text-sm font-bold text-gray-700 mr-2 hover:bg-gray-300 transition-colors duration-300"
              >
                #{category}
              </Link>
            ))}
          </div>
        </div>
        <span className="inline-block md:hidden font-bold text-xs text-neutral-600 dark:text-neutral-400">
          {dayjs(post.createdAt).format("YY. M. D.")}
        </span>
      </div>
      <div className="flex justify-between items-start">
        <Link href={`/posts/${post.id}`} className="no-underline text-inherit">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 text-black dark:text-neutral-50 hover:text-neutral-700 hover:dark:text-neutral-300 transition-colors duration-300">
            {post.title}
          </h2>
        </Link>
        <span className="hidden md:inline-block font-bold text-xs md:text-sm text-neutral-600 dark:text-neutral-400 ml-4 flex-shrink-0 border-2 px-2 py-1 border-neutral-300 dark:border-neutral-600 rounded-2xl">
          {dayjs(post.createdAt).format("YYYY. M. D.")}
        </span>
      </div>

      <p className="line-clamp-4 lg:line-clamp-3 text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-2">
        {summaryText}
      </p>
    </li>
  );
}
