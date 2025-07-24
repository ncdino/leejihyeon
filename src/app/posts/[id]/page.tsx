import { getPostById } from "@/app/_services/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDisplay from "./PostDisplay";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getPostById(id);
    return {
      title: post.title,
      description: post.content.substring(0, 150),
    };
  } catch {
    return {
      title: "게시글을 찾을 수 없음",
      description: "존재하지 않거나 삭제된 게시글입니다.",
    };
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  let post;
  try {
    post = await getPostById(id);
  } catch {
    notFound();
  }

  return <PostDisplay post={post} />;
}
