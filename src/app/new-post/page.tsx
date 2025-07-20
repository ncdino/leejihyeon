"use client";

import { useEffect, useState, useCallback, Suspense } from "react"; // Suspense 추가
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import apiClient from "@/app/_services/api";
import { MemoRequestDto } from "@/app/_types/post";
import { useLayoutStore } from "../_store/viewStore";
import { useAuthStore } from "../_store/authStore";
import { getPostById, updatePost } from "@/app/_services/posts";

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await apiClient.post<string>("/api/upload/image", formData);
  return response.data;
};

const createPost = async (postData: MemoRequestDto) => {
  const response = await apiClient.post("/api/memos", postData);
  return response.data;
};

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center text-center h-screen">
          <span>게시글 페이지를 불러오는 중...</span>
        </div>
      }
    >
      <NewPostContent />
    </Suspense>
  );
}

function NewPostContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("입력");
  const [categories, setCategories] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const headerHeight = useLayoutStore((state) => state.headerHeight);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLogin, authChecked } = useAuthStore();

  // loadPostData를 useCallback으로 메모이제이션
  const loadPostData = useCallback(
    async (postId: string) => {
      setIsLoading(true);
      try {
        const post = await getPostById(postId);
        setTitle(post.title || "");
        setContent(post.content || "**내용을 입력하세요**");
        setCategories(post.categories ? post.categories.join(", ") : "");
        setUploadedImageUrls(post.imageUrls || []);
      } catch {
        alert("게시글을 불러오는데 실패했습니다.");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  ); // router만 의존성으로 추가

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditMode(true);
      setEditPostId(editId);
      loadPostData(editId);
    }
  }, [searchParams, loadPostData]); // loadPostData를 의존성에 추가

  useEffect(() => {
    if (authChecked) {
      if (!isLogin) {
        alert("로그인이 필요한 페이지입니다.");
        return;
      }
    }
  }, [isLogin, authChecked, router]);

  // new-post) 이미지 업로드 전용 useMutation
  const imageUploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data: string) => {
      setUploadedImageUrls((prev) => [...prev, data]);
      navigator.clipboard.writeText(`![](${data})`);
      alert(
        "이미지 업로드 성공! URL이 클립보드에 복사되었습니다. 에디터에 붙여넣으세요."
      );
    },
    onError: (error) => {
      alert(`이미지 업로드 실패: ${error.message}`);
    },
  });

  // 게시글 최종 작성
  const postSubmitMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("게시글이 성공적으로 작성되었습니다!");
      router.push("/");
    },
    onError: (error) => {
      alert(`게시글 작성 실패: ${error.message}`);
    },
  });

  // 게시글 수정
  const postUpdateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updatePost({ id, formData }),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("게시글이 성공적으로 수정되었습니다!");
      router.push(`/post/${updatedPost.id}`);
    },
    onError: (error) => {
      alert(`게시글 수정 실패: ${error.message}`);
    },
  });

  const handleImageUpload = () => {
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        imageUploadMutation.mutate(file);
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditMode && editPostId) {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());

      const categoryList = categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat);

      categoryList.forEach((category) => {
        formData.append("categories", category);
      });

      uploadedImageUrls.forEach((url) => {
        formData.append("imageUrls", url);
      });

      if (uploadedImageUrls.length > 0) {
        formData.append("thumbnailUrl", uploadedImageUrls[0]);
      }

      postUpdateMutation.mutate({ id: editPostId, formData });
    } else {
      // 생성
      const postData: MemoRequestDto = {
        title,
        content,
        categories: categories
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat),
        thumbnailUrl:
          uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null,
        imageUrls: uploadedImageUrls,
      };

      postSubmitMutation.mutate(postData);
    }
  };

  // 업로드된 이미지 제거
  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  if (!authChecked || !isLogin) {
    return (
      <div className="flex justify-center items-center text-center">
        <span>권한 확인중.</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center text-center"
        style={{ marginTop: headerHeight }}
      >
        <span>게시글 로딩 중...</span>
      </div>
    );
  }

  return (
    <div
      className="text-neutral-950 dark:text-neutral-50 p-5 md:p-10 max-w-4xl mx-auto"
      style={{ marginTop: headerHeight }}
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <i className="bx bx-arrow-back text-xl"></i>
        </button>
        <h1 className="sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          {isEditMode ? "게시글 수정" : "새 게시글 작성"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 text-lg font-bold">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="categories" className="block mb-2 text-lg font-bold">
            카테고리 (콤마로 구분)
          </label>
          <input
            id="categories"
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="mb-6 p-4 border border-dashed rounded-md dark:border-gray-600">
          <label
            htmlFor="images-input"
            className="block mb-2 text-lg font-bold"
          >
            본문 이미지 업로드
          </label>
          <div className="flex items-center gap-2">
            <input
              id="images-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 hover:file:bg-gray-300"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={!selectedFiles || imageUploadMutation.isPending}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 whitespace-nowrap"
            >
              {imageUploadMutation.isPending
                ? "업로드 중..."
                : "선택 파일 업로드"}
            </button>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">
              업로드된 이미지 URL (클릭하여 마크다운 태그 복사)
            </h4>
            {uploadedImageUrls.length > 0 ? (
              <ul className="list-none mt-2">
                {uploadedImageUrls.map((url, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded mb-2"
                  >
                    <span
                      className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline truncate flex-1 mr-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`![](${url})`);
                        alert("마크다운 이미지 태그가 복사되었습니다.");
                      }}
                    >
                      {url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="이미지 제거"
                    >
                      <i className="bx bx-trash text-lg"></i>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                업로드된 이미지가 없습니다.
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-bold">내용</label>
          <div className="mt-2" data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              height={400}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={
              postSubmitMutation.isPending || postUpdateMutation.isPending
            }
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <i
              className={`bx ${isEditMode ? "bx-save" : "bx-plus"} text-lg`}
            ></i>
            {postSubmitMutation.isPending || postUpdateMutation.isPending
              ? isEditMode
                ? "수정 중..."
                : "작성 중..."
              : isEditMode
              ? "수정 완료"
              : "작성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
