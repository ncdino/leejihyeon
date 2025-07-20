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
    <li className="border-b pt-4 pb-8 border-gray-300 dark:border-gray-700 font-paperlogy font-light tracking-tight transition-colors duration-300">
      <div className="flex justify-end">
        <span className="inline-block md:hidden text-xs text-neutral-600 dark:text-neutral-400">
          {dayjs(post.createdAt).format("YYYY. M. D.")}
        </span>{" "}
      </div>
      <div className="flex justify-between items-start">
        <Link href={`/posts/${post.id}`} className="no-underline text-inherit">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 lg:mb-4 truncate text-black dark:text-neutral-50 hover:text-neutral-700 hover:dark:text-neutral-300 transition-colors duration-300">
            {post.title}
          </h2>
        </Link>
        <span className="hidden md:inline-block text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          {dayjs(post.createdAt).format("YYYY. M. D.")}
        </span>
      </div>
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
      <p className="line-clamp-4 lg:line-clamp-3 text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-2">
        {summaryText}
      </p>
    </li>
  );
}
