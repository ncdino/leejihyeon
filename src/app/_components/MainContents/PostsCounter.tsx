import { getPostCount } from "@/app/_services/posts";
import { useQuery } from "@tanstack/react-query";

export function PostsCounter() {
  const { data: totalCount, isLoading } = useQuery<number>({
    queryKey: ["postCount"],
    queryFn: getPostCount,
  });

  if (isLoading) return <span>0</span>;

  return <h1>총 {totalCount}개의 글</h1>;
}

